import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Емейли нодуруст ворид карда шуд'),
  password: z.string().min(6, 'Парол бояд ақаллан 6 аломат бошад'),
});

export const userCreateSchema = z.object({
  email: z.string().email('Емейли нодуруст ворид карда шуд'),
  password: z.string().min(8, 'Парол бояд ақаллан 8 аломат бошад'),
  name: z.string().min(2, 'Ном бояд ақаллан 2 аломат бошад'),
  role: z.enum(['admin', 'editor', 'employee']),
  status: z.enum(['active', 'inactive']).default('active'),
});

export const userUpdateSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(8).optional().or(z.literal('')),
  name: z.string().min(2).optional(),
  role: z.enum(['admin', 'editor', 'employee']).optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export const newsSchema = z.object({
  title: z.string().min(3, 'Сарлавҳа лозим аст'),
  slug: z.string().min(3, 'Slug лозим аст'),
  summary: z.string().optional(),
  content: z.string().min(5, 'Матни хабар лозим аст'),
  featured_image: z.string().optional(),
  category: z.string().default('Ахбор'),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  is_featured: z.boolean().default(false),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
});

export const facultySchema = z.object({
  name: z.string().min(2, 'Номи факултет лозим аст'),
  slug: z.string().min(2, 'Slug лозим аст'),
  description: z.string().min(5, 'Тавсиф лозим аст'),
  image: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  head: z.string().optional(),
  display_order: z.number().int().default(0),
  status: z.enum(['active', 'inactive']).default('active'),
});

export const pageSchema = z.object({
  title: z.string().min(2, 'Сарлавҳа лозим аст'),
  slug: z.string().min(2, 'Slug лозим аст'),
  content: z.string().min(5, 'Матни саҳифа лозим аст'),
  featured_image: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  status: z.enum(['draft', 'published']).default('published'),
});

export const settingsSchema = z.record(z.string(), z.string());

export const contactSchema = z.object({
  name: z.string().min(2, 'Ном ва насаб лозим аст'),
  email: z.string().email('Емейл нодуруст аст'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(5, 'Матни паём лозим аст'),
});
