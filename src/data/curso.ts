/**
 * Curso activo — lo usan CursoBarra.astro y CursoDestacado.astro.
 *
 * Los cursos se crean y borran desde el panel /admin (colección «Cursos»).
 * Se muestra UNO solo: entre los marcados como «Mostrar en la web», el de
 * fecha de inicio más reciente. Así, si el cliente sube uno nuevo y olvida
 * borrar el anterior, igual sale el nuevo. Sin cursos visibles → null, y la
 * barra y la sección no se renderizan.
 */
import { getCollection } from 'astro:content';

export async function getCursoActivo() {
  const cursos = await getCollection('cursos', ({ data }) => data.mostrar);
  if (cursos.length === 0) return null;
  cursos.sort((a, b) => b.data.fechaInicio.getTime() - a.data.fechaInicio.getTime());
  return cursos[0].data;
}

/**
 * Los afiches subidos desde el panel van a Cloudinary a tamaño completo.
 * Se pide una versión de 1200 px de ancho en el formato más liviano que
 * acepte el navegador. Las rutas locales se devuelven tal cual.
 */
export function urlAfiche(src: string): string {
  return src.replace(
    /(res\.cloudinary\.com\/[^/]+\/image\/upload\/)(?!f_auto)/,
    '$1f_auto,q_auto,w_1200/'
  );
}
