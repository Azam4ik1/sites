import bcrypt from 'bcryptjs';
import { db, initDb } from './db';

export async function runSeed() {
  initDb();

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@medcollege.tj';
  const adminPassword = process.env.ADMIN_PASSWORD || 'AdminMedCollege2026!';

  const editorEmail = process.env.EDITOR_EMAIL || 'editor@medcollege.tj';
  const editorPassword = process.env.EDITOR_PASSWORD || 'EditorMedCollege2026!';

  const employeeEmail = process.env.EMPLOYEE_EMAIL || 'employee@medcollege.tj';
  const employeePassword = process.env.EMPLOYEE_PASSWORD || 'EmployeeMedCollege2026!';

  // 1. Seed Users if table is empty or missing admin
  const existingAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail);
  let adminId = 1;

  if (!existingAdmin) {
    const adminHash = await bcrypt.hash(adminPassword, 10);
    const editorHash = await bcrypt.hash(editorPassword, 10);
    const employeeHash = await bcrypt.hash(employeePassword, 10);

    const insertUser = db.prepare(`
      INSERT INTO users (email, password, name, role, status, must_change_password)
      VALUES (?, ?, ?, ?, 'active', 1)
    `);

    const adminResult = insertUser.run(adminEmail, adminHash, 'Ҷабборзода Умед Убайдулло (Администратор)', 'admin');
    adminId = adminResult.lastInsertRowid as number;

    insertUser.run(editorEmail, editorHash, 'Муҳаррири шӯъбаи нашрия', 'editor');
    insertUser.run(employeeEmail, employeeHash, 'Корманди шӯъбаи таълим', 'employee');

    console.log('Users seeded successfully');
  } else {
    adminId = (existingAdmin as { id: number }).id;
  }

  // 2. Seed Settings
  const settingsCount = (db.prepare('SELECT COUNT(*) as count FROM settings').get() as { count: number }).count;
  if (settingsCount === 0) {
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
    console.log('Settings seeded successfully');
  }

  // 3. Seed Faculties (11 Specialties)
  const facultiesCount = (db.prepare('SELECT COUNT(*) as count FROM faculties').get() as { count: number }).count;
  if (facultiesCount === 0) {
    const insertFaculty = db.prepare(`
      INSERT INTO faculties (name, slug, description, image, phone, email, head, display_order, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')
    `);

    const facultiesList = [
      {
        name: 'Кори табобатӣ',
        slug: 'kori-tabobati',
        description: 'Омодасозии фелдшерҳо ва мутахассисони баландихтисоси соҳаи табобати бемориҳои дохилӣ, ҷарроҳӣ ва кӯдакона.',
        head: 'д.и.т. Собиров Ф.М.',
        order: 1,
      },
      {
        name: 'Кори момодоягӣ',
        slug: 'kori-momodoyagi',
        description: 'Омодасозии момодояҳои касбӣ барои пешбурди ҳомиладорӣ, таваллуд ва нигоҳубини модару кӯдак.',
        head: 'н.и.т. Раҳимова М.А.',
        order: 2,
      },
      {
        name: 'Кори ҳамширагӣ',
        slug: 'kori-hamshiragi',
        description: 'Ихтисоси ҳаётан муҳим барои таъмини нигоҳубини хушсифати тиббии беморон ва кӯмаки аввалия.',
        head: 'Азизова С.Ҳ.',
        order: 3,
      },
      {
        name: 'Кори тиббию-ташхисӣ',
        slug: 'kori-tibbiu-tashkhisi',
        description: 'Мутахассисони таҳлилҳои лаборатории клиникие, ки ташхиси дақиқи бемориҳоро таъмин менамоянд.',
        head: 'Муродов Б.Қ.',
        order: 4,
      },
      {
        name: 'Кори тиббию-профилактикӣ',
        slug: 'kori-tibbiu-profilaktiki',
        description: 'Омодасозии мутахассисони гигиена, эпидемиология ва ҳифзи саломатии ҷомеа.',
        head: 'Ҳасанов Ш.Н.',
        order: 5,
      },
      {
        name: 'Кори фарматсевтӣ',
        slug: 'kori-farmatsevti',
        description: 'Ихтисос оид ба истеҳсол, нигоҳдорӣ ва тақсимоти доруворӣ ва маводи фарматсевтӣ.',
        head: 'к.фарм.н. Юсупов Д.С.',
        order: 6,
      },
      {
        name: 'Кори дандонсозӣ',
        slug: 'kori-dandonsozi',
        description: 'Омода намудани техникҳои зубной барои сохтани протезҳо ва конструксияҳои ортопедӣ.',
        head: 'Каримов Р.А.',
        order: 7,
      },
      {
        name: 'Кори табобати дандон',
        slug: 'kori-tabobati-dandon',
        description: 'Омодасозии ассистентҳои стоматологӣ ва фелдшерҳои гигиенисти соҳаи дандонпизишкӣ.',
        head: 'Шарипов У.Т.',
        order: 8,
      },
      {
        name: 'Кори тиббӣ – офиятӣ',
        slug: 'kori-tibbi-ofiyati',
        description: 'Барқарорсозии саломатии беморон тавассути физиотерапия, масаж ва тарбияи ҷисмонии табобатӣ.',
        head: 'Зарипова Ғ.И.',
        order: 9,
      },
      {
        name: 'Истифодабарии техника ва таҷҳизоти тиббӣ',
        slug: 'istifodabarii-texnika-va-tajhizoti-tibbi',
        description: 'Омодасозии мутахассисони хизматрасонии техникӣ ва истифодабарии дастгоҳҳои муосири тиббӣ.',
        head: 'Олимов А.Р.',
        order: 10,
      },
      {
        name: 'Кори ҳифзи иҷтимоӣ',
        slug: 'kori-hifzi-ijtimoi',
        description: 'Омода кардани кормандони иҷтимоӣ барои дастгирии шахсони имконияташон маҳдуд ва пиронсолон.',
        head: 'Нурзода З.Б.',
        order: 11,
      },
    ];

    for (const fac of facultiesList) {
      insertFaculty.run(
        fac.name,
        fac.slug,
        fac.description,
        '/logo.svg',
        '+992 (372) 39-89-44',
        'medcoll.tj@mail.ru',
        fac.head,
        fac.order
      );
    }
    console.log('Faculties seeded successfully');
  }

  // 4. Seed News
  const newsCount = (db.prepare('SELECT COUNT(*) as count FROM news').get() as { count: number }).count;
  if (newsCount === 0) {
    const insertNews = db.prepare(`
      INSERT INTO news (title, slug, summary, content, category, author_id, status, is_featured, published_at)
      VALUES (?, ?, ?, ?, ?, ?, 'published', ?, CURRENT_TIMESTAMP)
    `);

    const newsList = [
      {
        title: 'Конфронси илмӣ-амалӣ бахшида ба 90-солагии Коллеҷи тиббии ҷумҳуриявӣ',
        slug: 'konfransi-ilmi-amali-90-solagii-medcollege',
        summary: 'Дар МДТ «Коллеҷи тиббии ҷумҳуриявӣ» конфронси пуршукӯҳи илмӣ бо иштироки намояндагони Вазорати тандурустӣ баргузор гардид.',
        content: `
          <p>Дар толори фарҳангии Муассисаи давлатии таълимии «Коллеҷи тиббии ҷумҳуриявӣ» конфронси илмӣ-амалӣ бо иштироки олимон, омӯзгорон ва донишҷӯён баргузор гардид.</p>
          <p>Директори коллеҷ, Ҷабборзода Умед Убайдулло конфронсро кушода, хайрамақдам намуданд ва қайд карданд, ки муассиса аз соли 1935 инҷониб ҳазорҳо мутахассисони баландихтисоси соҳаи тандурустиро тайёр намудааст.</p>
        `,
        category: 'Конфронсҳо',
        featured: 1,
      },
      {
        title: 'Қабули ҳуҷҷатҳои довталабон барои соли таҳсили 2025-2026 оғоз ёфт',
        slug: 'qabuli-hujjathoi-dovtalabon-2025-2026',
        summary: 'МДТ «Коллеҷи тиббии ҷумҳуриявӣ» қабули донишҷӯёнро аз рӯи 11 ихтисоси тиббӣ тавассути Маркази миллии тестӣ эълон менамояд.',
        content: `
          <p>Муассисаи давлатии таълимии «Коллеҷи тиббии ҷумҳуриявӣ» ба диққати сӯҳбаткунандагон ва довталабон мерасонад, ки қабули ҳуҷҷатҳо барои соли нави таҳсил оғоз гардид.</p>
        `,
        category: 'Эълонҳо',
        featured: 1,
      },
    ];

    for (const item of newsList) {
      insertNews.run(
        item.title,
        item.slug,
        item.summary,
        item.content,
        item.category,
        adminId,
        item.featured
      );
    }
    console.log('News seeded successfully');
  }

  // 5. Seed Pages
  const pagesCount = (db.prepare('SELECT COUNT(*) as count FROM pages').get() as { count: number }).count;
  if (pagesCount === 0) {
    const insertPage = db.prepare(`
      INSERT INTO pages (title, slug, content, seo_title, seo_description, status)
      VALUES (?, ?, ?, ?, ?, 'published')
    `);

    const pagesList = [
      {
        title: 'Дар бораи коллеҷ',
        slug: 'about',
        seo_title: 'Дар бораи Коллеҷи тиббии ҷумҳуриявӣ | Таърих аз соли 1935',
        seo_description: 'Маълумоти пурра дар бораи таърихи таъсисёбӣ, сохтор ва фаъолияти МДТ «Коллеҷи тиббии ҷумҳуриявӣ».',
        content: `
          <h2>Таърихи пайдоиш ва рушди коллеҷ</h2>
          <p>Муассисаи давлатии таълимии «Коллеҷи тиббии ҷумҳуриявӣ» яке аз куҳантарин ва беҳтарин муассисаҳои таҳсилоти миёнаи тиббии Ҷумҳурии Тоҷикистон мебошад. Муассиса соли 1935 ҳамчун техникуми тиббӣ таъсис ёфта, дар давоми зиёда аз 90 соли фаъолияти худ даҳҳо ҳазор мутахассисони баландихтисосро барои соҳаи тандурустии кишвар омода намудааст.</p>
        `,
      },
      {
        title: 'Маъмурият ва роҳбарият',
        slug: 'administration',
        seo_title: 'Роҳбарияти Коллеҷи тиббии ҷумҳуриявӣ',
        seo_description: 'Ҳайати роҳбарият ва маъмурияти МДТ Коллеҷи тиббии ҷумҳуриявӣ.',
        content: `
          <h2>Роҳбарияти Муассиса</h2>
          <div class="leadership-info">
            <h3>Директори коллеҷ: Ҷабборзода Умед Убайдулло</h3>
            <p>Унвон: Доктори илмҳои тиб, профессор</p>
            <p>Телефон: +992 (372) 39-89-44</p>
            <p>Email: medcoll.tj@mail.ru</p>
          </div>
        `,
      },
      {
        title: 'Ба донишҷӯён',
        slug: 'students',
        seo_title: 'Маълумот барои донишҷӯёни Коллеҷи тиббии ҷумҳуриявӣ',
        seo_description: 'Дастурҳо, ҷадвали дарсҳо ва қоидаҳои дохилии коллеҷ.',
        content: `
          <h2>Ахбор ва дастурҳо барои донишҷӯён</h2>
          <p>Коллеҷи тиббии ҷумҳуриявӣ барои донишҷӯён тамоми шароити муосири таълимию амалиро фароҳам овардааст. Дар ин ҷо шумо метавонед бо ҷадвали дарсҳо, барномаҳои таълимӣ ва қоидаҳои дохилии муассиса шинос шавед.</p>
        `,
      },
      {
        title: 'Ба довталабон',
        slug: 'applicants',
        seo_title: 'Қоидаҳои қабул ва маълумот барои довталабон',
        seo_description: 'Шартҳои қабул, номгӯи ҳуҷҷатҳо ва ихтисосҳо барои довталабон.',
        content: `
          <h2>Маълумот барои довталабони соли 2025–2026</h2>
          <p>Қабули донишҷӯён ба МДТ «Коллеҷи тиббии ҷумҳуриявӣ» тавассути Маркази миллии тестии назди Президенти Ҷумҳурии Тоҷикистон амалӣ карда мешавад.</p>
          <h3>Ҳуҷҷатҳои зарурӣ:</h3>
          <ul>
            <li>Ариза ба номи директор</li>
            <li>Ҳуҷҷат дар бораи маълумот (асли)</li>
            <li>Маълумотномаи тиббӣ (шакли 086-У)</li>
            <li>6 адад сурати 3x4</li>
            <li>Нусхаи шиноснома ё шаҳодатнома дар бораи таваллуд</li>
          </ul>
        `,
      },
      {
        title: 'Пешвои миллат ва соҳаи тандурустӣ',
        slug: 'president',
        seo_title: 'Асосгузори сулҳу ваҳдати миллӣ – Пешвои миллат Эмомали Раҳмон',
        seo_description: 'Ғамхорӣ ва дастгирии Асосгузори сулҳу ваҳдати миллӣ – Пешвои миллат.',
        content: `
          <h2>Таваҷҷуҳи Пешвои миллат ба соҳаи тандурустӣ</h2>
          <blockquote>
            «Сиҳатии омма бойгарии давлат ва асоси рушди ҷомеа мебошад.»
            <br />
            <strong>— Эмомалӣ Раҳмон</strong>
          </blockquote>
        `,
      },
      {
        title: 'Кафедраҳо',
        slug: 'departments',
        seo_title: 'Кафедраҳои Коллеҷи тиббии ҷумҳуриявӣ',
        seo_description: 'Кафедраҳои таълимӣ ва фаъолияти илмии коллеҷ.',
        content: `
          <h2>Кафедраҳои таълимӣ</h2>
          <p>Дар коллеҷ кафедраҳои фанҳои ҷамъиятӣ-гуманитарӣ, фанҳои тиббию-биологӣ, кори табобатӣ, ҳамширагӣ ва фарматсевтӣ фаъолият менамоянд.</p>
        `,
      },
      {
        title: 'Марказҳо',
        slug: 'centers',
        seo_title: 'Марказҳои таълимию амлаӣ ва инноватсионӣ',
        seo_description: 'Марказҳои симулятсионӣ ва озмоишгоҳҳои муосир.',
        content: `
          <h2>Марказҳои симулятсионӣ ва таълимӣ</h2>
          <p>Коллеҷ дорои маркази муосири симулятсионии клиникӣ мебошад, ки дар он донишҷӯён малакаҳои амалиро пеш аз кор бо беморон пайдо мекунанд.</p>
        `,
      },
      {
        title: 'Конфронсҳо',
        slug: 'conferences',
        seo_title: 'Конфронсҳои илмӣ-амалӣ',
        seo_description: 'Конфронсҳо ва симпозиумҳои илмӣ дар Коллеҷи тиббӣ.',
        content: `
          <h2>Фаъолияти илмӣ ва конфронсҳо</h2>
          <p>Ҳар сол дар муассиса конфронсҳои ҷумҳуриявӣ ва байналмилалӣ бо иштироки олимон ва мутахассисон баргузор мегарданд.</p>
        `,
      },
      {
        title: 'Газетаи «Шафқат»',
        slug: 'newspaper',
        seo_title: 'Газетаи «Шафқат» | Нашрияи Коллеҷи тиббии ҷумҳуриявӣ',
        seo_description: 'Нашрияи расмии МДТ Коллеҷи тиббии ҷумҳуриявӣ.',
        content: `
          <h2>Нашрияи «Шафқат»</h2>
          <p>Газетаи «Шафқат» минбари озоди омӯзгорон ва донишҷӯёни Коллеҷи тиббии ҷумҳуриявӣ мебошад.</p>
        `,
      },
      {
        title: 'Зеботарин манзараҳои Тоҷикистон',
        slug: 'landscapes',
        seo_title: 'Зеботарин манзараҳои Тоҷикистон',
        seo_description: 'Табиат ва манзараҳои водии Ватан.',
        content: `
          <h2>Зеботарин манзараҳои Тоҷикистон</h2>
          <p>Тоҷикистон диёри кӯҳҳои баланд, чашмасорон ва табиати афсонавӣ мебошад.</p>
        `,
      },
      {
        title: 'Нашрия',
        slug: 'publications',
        seo_title: 'Нашрияҳо ва китобҳои таълимии коллеҷ',
        seo_description: 'Китобҳои дарсӣ ва маводи илмии нашршуда.',
        content: `
          <h2>Нашрияҳои таълимию методии омӯзгорони коллеҷ</h2>
          <p>Омӯзгорони муассиса ҳамасола даҳҳо китобҳои дарсӣ ва дастурҳои методиро барои донишҷӯён ба нашр мерасонанд.</p>
        `,
      },
      {
        title: 'Об барои рушди устувор',
        slug: 'water-for-sustainable-development',
        seo_title: 'Даҳсолаи байналмилалии амал «Об барои рушди устувор»',
        seo_description: 'Ташаббусҳои глобалии Тоҷикистон дар соҳаи об.',
        content: `
          <h2>Даҳсолаи байналмилалии амал «Об барои рушди устувор, 2018-2028»</h2>
          <p>Тоҷикистон ҳамчун кишвари пешсаф дар ҳалли масъалаҳои об ва иқлим дар сатҳи ҷаҳонӣ шинохта шудааст.</p>
        `,
      },
      {
        title: 'Соли рушди деҳот, сайёҳӣ ва ҳунарҳои мардумӣ',
        slug: 'rural-development',
        seo_title: 'Рушди деҳот, сайёҳӣ ва ҳунарҳои мардумӣ',
        seo_description: 'Дастгирии ҳунарҳои мардумӣ ва сайёҳӣ.',
        content: `
          <h2>Рушди деҳот ва ҳунарҳои мардумӣ</h2>
          <p>Эҳё ва рушди ҳунарҳои мардумӣ яке аз самтҳои афзалиятноки сиёсати фарҳангии кишвар мебошад.</p>
        `,
      },
      {
        title: 'Ҳисоботҳо',
        slug: 'reports',
        seo_title: 'Ҳисоботҳои фаъолияти Коллеҷи тиббии ҷумҳуриявӣ',
        seo_description: 'Ҳисоботҳои солона ва шаффофияти молиявӣ ва таълимӣ.',
        content: `
          <h2>Ҳисоботҳои фаъолияти муассиса</h2>
          <p>Ҳисоботи солонаи роҳбарият оид ба нақшаҳои таълимӣ, корҳои тарбиявӣ ва ободонӣ.</p>
        `,
      },
      {
        title: 'Шӯрои директорон',
        slug: 'council-of-directors',
        seo_title: 'Шӯрои директорони муассисаҳои таҳсилоти миёнаи касбии тиббӣ',
        seo_description: 'Фаъолият ва қарорҳои Шӯрои директорон.',
        content: `
          <h2>Шӯрои директорон</h2>
          <p>Муҳокимаи масъалаҳои муҳими таълиму тарбия ва ҳамоҳангсозии фаъолияти коллеҷҳои тиббии кишвар.</p>
        `,
      },
    ];

    for (const page of pagesList) {
      insertPage.run(
        page.title,
        page.slug,
        page.content,
        page.seo_title,
        page.seo_description
      );
    }
    console.log('Pages seeded successfully');
  }
}

if (require.main === module) {
  runSeed()
    .then(() => {
      console.log('Database seed completed successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Database seed error:', err);
      process.exit(1);
    });
}
