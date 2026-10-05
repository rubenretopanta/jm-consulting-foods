/**
 * Curso activo — lo usan CursoBarra.astro y CursoDestacado.astro.
 *
 * Los cursos se crean y borran desde el panel /admin (colección «Cursos»).
 * Se muestra UNO solo: entre los marcados como «Mostrar en la web» que aún
 * no terminaron, el que empieza antes. Así el cliente puede dejar varios
 * cursos programados y cada uno sale cuando el anterior termina. Sin cursos
 * vigentes → null, y la barra y la sección no se renderizan.
 *
 * Un curso termina al acabar (hora de Lima) su último día: «fechaFin», o
 * «fechaInicio» si el curso es de un solo día. El filtro corre al construir
 * el sitio; como la web es estática, un rebuild diario
 * (.github/workflows/rebuild-diario.yml) y el script de los componentes
 * (data-curso-hasta) hacen que desaparezca a tiempo aunque nadie publique.
 */
import { getCollection, type CollectionEntry } from 'astro:content';

type Curso = CollectionEntry<'cursos'>['data'];

/** Último día del curso como «AAAA-MM-DD» (las fechas del panel van en UTC). */
export function ultimoDia(curso: Curso): string {
  return (curso.fechaFin ?? curso.fechaInicio).toISOString().slice(0, 10);
}

/** true si ya pasó la medianoche de Lima (UTC−5, sin horario de verano) tras el último día. */
export function cursoTerminado(hasta: string, ahora = Date.now()): boolean {
  return ahora > Date.parse(`${hasta}T23:59:59.999-05:00`);
}

export async function getCursoActivo() {
  const cursos = await getCollection(
    'cursos',
    ({ data }) => data.mostrar && !cursoTerminado(ultimoDia(data))
  );
  if (cursos.length === 0) return null;
  cursos.sort((a, b) => a.data.fechaInicio.getTime() - b.data.fechaInicio.getTime());
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
