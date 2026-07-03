/**
 * FUENTE ÚNICA DE VERDAD — datos de J&M Consulting Foods S.A.C.
 *
 * Los datos viven en `site.json` (editable desde el panel /admin).
 * Este archivo solo los importa y expone el helper waLink().
 * No edites los valores aquí: hazlo en site.json o desde el panel.
 */
import site from './site.json';

export const SITE = site;

/**
 * Construye un enlace de WhatsApp con mensaje opcional pre-escrito.
 * Uso: waLink('Hola, quiero información sobre HACCP')
 */
export function waLink(message?: string): string {
  const base = `https://wa.me/${SITE.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
