import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = process.env.DATABASE_PATH
  ? path.isAbsolute(process.env.DATABASE_PATH)
    ? process.env.DATABASE_PATH
    : path.join(/*turbopackIgnore: true*/ process.cwd(), process.env.DATABASE_PATH)
  : path.join(/*turbopackIgnore: true*/ process.cwd(), 'medical_college.db');

const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'editor', 'employee')),
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
      must_change_password INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login_at DATETIME
    );

    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      summary TEXT,
      content TEXT NOT NULL,
      featured_image TEXT,
      category TEXT NOT NULL DEFAULT 'Ахбор',
      author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'archived')),
      is_featured INTEGER NOT NULL DEFAULT 0,
      seo_title TEXT,
      seo_description TEXT,
      published_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS faculties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      image TEXT,
      phone TEXT,
      email TEXT,
      head TEXT,
      display_order INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content TEXT NOT NULL,
      featured_image TEXT,
      seo_title TEXT,
      seo_description TEXT,
      status TEXT NOT NULL DEFAULT 'published' CHECK(status IN ('draft', 'published')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      url TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      size INTEGER NOT NULL,
      uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
    CREATE INDEX IF NOT EXISTS idx_news_status ON news(status);
    CREATE INDEX IF NOT EXISTS idx_faculties_slug ON faculties(slug);
    CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  `);

  autoSeedIfEmpty();
}

function autoSeedIfEmpty() {
  const userCount = (db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }).count;
  if (userCount === 0) {
    const bcrypt = require('bcryptjs');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@medcollege.tj';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminMedCollege2026!';
    const editorEmail = process.env.EDITOR_EMAIL || 'editor@medcollege.tj';
    const editorPassword = process.env.EDITOR_PASSWORD || 'EditorMedCollege2026!';
    const employeeEmail = process.env.EMPLOYEE_EMAIL || 'employee@medcollege.tj';
    const employeePassword = process.env.EMPLOYEE_PASSWORD || 'EmployeeMedCollege2026!';

    const adminHash = bcrypt.hashSync(adminPassword, 10);
    const editorHash = bcrypt.hashSync(editorPassword, 10);
    const employeeHash = bcrypt.hashSync(employeePassword, 10);

    const insertUser = db.prepare(`
      INSERT INTO users (email, password, name, role, status, must_change_password)
      VALUES (?, ?, ?, ?, 'active', 1)
    `);

    const adminResult = insertUser.run(adminEmail, adminHash, 'Ҷабборзода Умед Убайдулло (Администратор)', 'admin');
    const adminId = adminResult.lastInsertRowid as number;

    insertUser.run(editorEmail, editorHash, 'Муҳаррири шӯъбаи нашрия', 'editor');
    insertUser.run(employeeEmail, employeeHash, 'Корманди шӯъбаи таълим', 'employee');

    // Seed Settings
    const insertSetting = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    const defaultSettings: Record<string, string> = {
      site_title: 'Муассисаи давлатии таълимии «Коллеҷи тиббии ҷумҳуриявӣ»',
      site_description: 'Сайти расмии Коллеҷи тиббии ҷумҳуриявии Вазорати тандурустӣ ва ҳифзи иҷтимоии аҳолии Ҷумҳурии Тоҷикистон (таъсис 1935)',
      founding_year: '1935',
      subordination: 'Вазорати тандурустӣ ва ҳифзи иҷтимоии аҳолии Ҷумҳурии Тоҷикистон',
      address: 'ш. Душанбе, кӯчаи Раҳмон Набиев, 248',
      phone_primary: '+992 (372) 39-89-44',
      phone_secondary: '+992 (372) 39-89-49',
      email: 'medcoll.tj@mail.ru',
      working_hours: 'Дон.-Шан.: 08:00 - 17:00',
      director_name: 'Ҷабборзода Умед Убайдулло',
      director_title: 'Директори МДТ «Коллеҷи тиббии ҷумҳуриявӣ»',
      previous_director: 'Ашуриён Шаҳло Сайфуллозода (н.и.т.)',
      facebook_url: 'https://facebook.com/medcollege.tj',
      instagram_url: 'https://instagram.com/medcollege.tj',
      youtube_url: 'https://youtube.com/medcollegetj',
      telegram_url: 'https://t.me/medcollege_tj',
      seo_default_keywords: 'Коллеҷи тиббӣ, Душанбе, Таҳсилоти тиббӣ, Кори табобатӣ, Фарматсевтӣ, Ҳамширагӣ',
      og_image: '/logo.svg',
    };
    for (const [key, value] of Object.entries(defaultSettings)) {
      insertSetting.run(key, value);
    }

    // Seed Faculties
    const insertFaculty = db.prepare(`
      INSERT INTO faculties (name, slug, description, image, phone, email, head, display_order, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')
    `);
    const facultiesList = [
      { name: 'Кори табобатӣ', slug: 'kori-tabobati', description: 'Омодасозии фелдшерҳо ва мутахассисони баландихтисоси соҳаи табобати бемориҳои дохилӣ, ҷарроҳӣ ва кӯдакона.', head: 'д.и.т. Собиров Ф.М.', order: 1 },
      { name: 'Кори момодоягӣ', slug: 'kori-momodoyagi', description: 'Омодасозии момодояҳои касбӣ барои пешбурди ҳомиладорӣ, таваллуд ва нигоҳубини модару кӯдак.', head: 'н.и.т. Раҳимова М.А.', order: 2 },
      { name: 'Кори ҳамширагӣ', slug: 'kori-hamshiragi', description: 'Ихтисоси ҳаётан муҳим барои таъмини нигоҳубини хушсифати тиббии беморон ва кӯмаки аввалия.', head: 'Азизова С.Ҳ.', order: 3 },
      { name: 'Кори тиббию-ташхисӣ', slug: 'kori-tibbiu-tashkhisi', description: 'Мутахассисони таҳлилҳои лаборатории клиникие, ки ташхиси дақиқи бемориҳоро таъмин менамоянд.', head: 'Муродов Б.Қ.', order: 4 },
      { name: 'Кори тиббию-профилактикӣ', slug: 'kori-tibbiu-profilaktiki', description: 'Омодасозии мутахассисони гигиена, эпидемиология ва ҳифзи саломатии ҷомеа.', head: 'Ҳасанов Ш.Н.', order: 5 },
      { name: 'Кори фарматсевтӣ', slug: 'kori-farmatsevti', description: 'Ихтисос оид ба истеҳсол, нигоҳдорӣ ва тақсимоти доруворӣ ва маводи фарматсевтӣ.', head: 'к.фарм.н. Юсупов Д.С.', order: 6 },
      { name: 'Кори дандонсозӣ', slug: 'kori-dandonsozi', description: 'Омода намудани техникҳои зубной барои сохтани протезҳо ва конструксияҳои ортопедӣ.', head: 'Каримов Р.А.', order: 7 },
      { name: 'Кори табобати дандон', slug: 'kori-tabobati-dandon', description: 'Омодасозии ассистентҳои стоматологӣ ва фелдшерҳои гигиенисти соҳаи дандонпизишкӣ.', head: 'Шарипов У.Т.', order: 8 },
      { name: 'Кори тиббӣ – офиятӣ', slug: 'kori-tibbi-ofiyati', description: 'Барқарорсозии саломатии беморон тавассути физиотерапия, масаж ва тарбияи ҷисмонии табобатӣ.', head: 'Зарипова Ғ.И.', order: 9 },
      { name: 'Истифодабарии техника ва таҷҳизоти тиббӣ', slug: 'istifodabarii-texnika-va-tajhizoti-tibbi', description: 'Омодасозии мутахассисони хизматрасонии техникӣ ва истифодабарии дастгоҳҳои муосири тиббӣ.', head: 'Олимов А.Р.', order: 10 },
      { name: 'Кори ҳифзи иҷтимоӣ', slug: 'kori-hifzi-ijtimoi', description: 'Омода кардани кормандони иҷтимоӣ барои дастгирии шахсони имконияташон маҳдуд ва пиронсолон.', head: 'Нурзода З.Б.', order: 11 },
    ];
    for (const fac of facultiesList) {
      insertFaculty.run(fac.name, fac.slug, fac.description, '/logo.svg', '+992 (372) 39-89-44', 'medcoll.tj@mail.ru', fac.head, fac.order);
    }

    // Seed News
    const insertNews = db.prepare(`
      INSERT INTO news (title, slug, summary, content, category, author_id, status, is_featured, published_at)
      VALUES (?, ?, ?, ?, ?, ?, 'published', ?, CURRENT_TIMESTAMP)
    `);
    const newsList = [
      {
        title: 'Конфронси илмӣ-амалӣ бахшида ба 90-солагии Коллеҷи тиббии ҷумҳуриявӣ',
        slug: 'konfransi-ilmi-amali-90-solagii-medcollege',
        summary: 'Дар МДТ «Коллеҷи тиббии ҷумҳуриявӣ» конфронси пуршукӯҳи илмӣ бо иштироки намояндагони Вазорати тандурустӣ баргузор гардид.',
        content: '<p>Дар толори фарҳангии Муассисаи давлатии таълимии «Коллеҷи тиббии ҷумҳуриявӣ» конфронси илмӣ-амалӣ бо иштироки олимон, омӯзгорон ва донишҷӯён баргузор гардид.</p>',
        category: 'Конфронсҳо',
        featured: 1,
      },
      {
        title: 'Қабули ҳуҷҷатҳои довталабон барои соли таҳсили 2025-2026 оғоз ёфт',
        slug: 'qabuli-hujjathoi-dovtalabon-2025-2026',
        summary: 'МДТ «Коллеҷи тиббии ҷумҳуриявӣ» қабули донишҷӯёнро аз рӯи 11 ихтисоси тиббӣ тавассути Маркази миллии тестӣ эълон менамояд.',
        content: '<p>Муассисаи давлатии таълимии «Коллеҷи тиббии ҷумҳуриявӣ» ба диққати сӯҳбаткунандагон ва довталабон мерасонад, ки қабули ҳуҷҷатҳо барои соли нави таҳсил оғоз гардид.</p>',
        category: 'Эълонҳо',
        featured: 1,
      },
    ];
    for (const item of newsList) {
      insertNews.run(item.title, item.slug, item.summary, item.content, item.category, adminId, item.featured);
    }

    // Seed Pages
    const insertPage = db.prepare(`
      INSERT INTO pages (title, slug, content, seo_title, seo_description, status)
      VALUES (?, ?, ?, ?, ?, 'published')
    `);
    const pagesList = [
      { title: 'Дар бораи коллеҷ', slug: 'about', seo_title: 'Дар бораи Коллеҷи тиббии ҷумҳуриявӣ', seo_description: 'Маълумоти пурра дар бораи таърих.', content: '<h2>Таърихи пайдоиш ва рушди коллеҷ</h2>' },
      { title: 'Маъмурият ва роҳбарият', slug: 'administration', seo_title: 'Роҳбарияти Коллеҷи тиббии ҷумҳуриявӣ', seo_description: 'Ҳайати роҳбарият.', content: '<h2>Роҳбарияти Муассиса</h2>' },
      { title: 'Ба донишҷӯён', slug: 'students', seo_title: 'Маълумот барои донишҷӯён', seo_description: 'Дастурҳо.', content: '<h2>Ахбор барои донишҷӯён</h2>' },
      { title: 'Ба довталабон', slug: 'applicants', seo_title: 'Қоидаҳои қабул', seo_description: 'Шартҳои қабул.', content: '<h2>Маълумот барои довталабон</h2>' },
      { title: 'Пешвои миллат ва соҳаи тандурустӣ', slug: 'president', seo_title: 'Пешвои миллат Эмомали Раҳмон', seo_description: 'Ғамхории Пешвои миллат.', content: '<h2>Таваҷҷуҳи Пешвои миллат</h2>' },
    ];
    for (const p of pagesList) {
      insertPage.run(p.title, p.slug, p.content, p.seo_title, p.seo_description);
    }
  }
}

initDb();
