import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    image: z.string().optional(),      // URL de Cloudinary (portada)
    draft: z.boolean().optional(),     // true = no se publica todavía
  }),
});

const clientes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/clientes' }),
  schema: z.object({
    name: z.string(),                  // nombre del cliente / empresa
    image: z.string().optional(),      // URL de Cloudinary (foto o logo)
    description: z.string().optional(),// rubro o breve descripción
    order: z.number().optional(),      // menor = aparece primero
    draft: z.boolean().optional(),     // true = no se muestra todavía
  }),
});

export const collections = { services, blog, clientes };