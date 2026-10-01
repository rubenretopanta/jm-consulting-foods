import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().optional(),
    image: z.string().optional(),          // foto de la tarjeta (ruta local o URL de Cloudinary)
    bullets: z.array(z.string()).optional(), // qué incluye el servicio
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

// Cursos: campaña del «Próximo curso» (barra bajo la cabecera + sección tras
// la portada). Se muestra uno solo: ver src/data/curso.ts.
const cursos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cursos' }),
  schema: z.object({
    titulo: z.string(),                // nombre del curso
    tipo: z.string(),                  // ej. «Curso taller online»
    fechas: z.string(),                // texto libre: «7 y 8 de octubre»
    horario: z.string().optional(),    // texto libre: «7:00 p.m. – 10:00 p.m.»
    fechaInicio: z.coerce.date(),      // solo para elegir el más reciente
    afiche: z.string(),                // URL de Cloudinary o ruta local
    descripcionAfiche: z.string().optional(), // texto alternativo del afiche
    mostrar: z.boolean().default(true),
  }),
});

export const collections = { services, blog, clientes, cursos };