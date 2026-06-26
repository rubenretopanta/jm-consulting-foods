/**
 * FUENTE ÚNICA DE VERDAD — datos de J&M Consulting Foods S.A.C.
 * Cualquier dato de la empresa se edita AQUÍ y se refleja en todo el sitio.
 */

export const SITE = {
  // Identidad
  name: 'J&M Consulting Foods',
  legalName: 'J&M Consulting Foods S.A.C.',
  ruc: '20607994359',
  tagline: 'Consultoría en calidad e inocuidad alimentaria',
  description:
    'Te acompañamos paso a paso para obtener tu Registro Sanitario, implementar HACCP y BPM, y pasar tus auditorías de DIGESA con tranquilidad.',

  // Contacto
  whatsapp: '51933214520',              // formato internacional sin "+" ni espacios
  whatsappDisplay: '+51 933 214 520',   // como se muestra al usuario
  email: 'contacto@jmconsultingfoods.pe',   // PENDIENTE: confirmar correo real
  city: 'Lima, Perú',
  address: 'Lima, Perú',                // PENDIENTE: dirección exacta

  // Operación
  foundedYear: 2021,

  // Redes (rellenar cuando las tengas)
  social: {
    facebook: 'https://www.facebook.com/jmconsulting03/',
    instagram: '',
    linkedin: '',
  },
} as const;

/**
 * Construye un enlace de WhatsApp con mensaje opcional pre-escrito.
 * Uso: waLink('Hola, quiero información sobre HACCP')
 */
export function waLink(message?: string): string {
  const base = `https://wa.me/${SITE.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}