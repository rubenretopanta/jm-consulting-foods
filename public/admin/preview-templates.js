/* ============================================================
   Vista previa en vivo (side-by-side) para Decap CMS.
   Reconstruye el diseño de cada sección del sitio J&M dentro del
   panel, para que el cliente vea "cómo va quedando" mientras edita.
   Usa los globales que expone decap-cms.js: CMS, h, createClass.
   ============================================================ */
(function () {
  var h = window.h;
  var createClass = window.createClass;
  var CMS = window.CMS;

  // Estilos de la preview (se inyectan dentro del iframe aislado)
  CMS.registerPreviewStyle('/admin/preview.css');

  // --- Helpers para leer datos (Immutable.js) ---
  function val(entry, path) {
    var v = entry.getIn(['data'].concat(path));
    return (v === undefined || v === null) ? '' : v;
  }
  function items(entry, path) {
    var v = entry.getIn(['data'].concat(path));
    if (!v) return [];
    return v.toArray ? v.toArray() : (Array.isArray(v) ? v : []);
  }
  function el(tag, cls, children) {
    return h(tag, cls ? { className: cls } : null, children);
  }

  // ==========================================================
  //  PÁGINA DE INICIO (home.json)
  // ==========================================================
  var InicioPreview = createClass({
    render: function () {
      var e = this.props.entry;

      // --- Hero ---
      var hero = el('section', 'pv-hero', [
        el('p', 'pv-eyebrow', 'Consultoría en calidad e inocuidad alimentaria · Lima'),
        h('h1', { key: 'h1' }, [
          val(e, ['hero', 'tituloLinea1']),
          h('br', { key: 'br' }),
          h('span', { key: 'hl', className: 'hl' }, val(e, ['hero', 'tituloDestacado']))
        ]),
        el('p', 'pv-lead', 'Texto descriptivo de la empresa (se edita en «Datos de la empresa»).'),
        el('div', 'pv-btns', [
          h('span', { key: 'b1', className: 'pv-btn pv-btn-primary' }, val(e, ['hero', 'botonWhatsapp'])),
          h('span', { key: 'b2', className: 'pv-btn pv-btn-ghost' }, val(e, ['hero', 'botonServicios']))
        ])
      ]);

      // --- Encabezado de Servicios ---
      var servicios = el('section', 'pv-section', [
        el('header', 'pv-head', [
          el('p', 'pv-eyebrow', val(e, ['serviciosSeccion', 'eyebrow'])),
          h('h2', { key: 't' }, val(e, ['serviciosSeccion', 'titulo'])),
          el('p', 'pv-sub', val(e, ['serviciosSeccion', 'subtitulo']))
        ]),
        el('div', 'pv-note', 'Las tarjetas de servicios se editan en la sección «Servicios».')
      ]);

      // --- Nosotros ---
      var difs = items(e, ['nosotros', 'diferenciadores']).map(function (d, i) {
        return h('li', { key: i }, [
          h('span', { key: 'tk', className: 'pv-tick' }, '✓'),
          h('div', { key: 'tx' }, [
            h('strong', { key: 's' }, d.get('titulo')),
            h('span', { key: 'p' }, d.get('texto'))
          ])
        ]);
      });
      var nosotros = el('section', 'pv-section', [
        el('div', 'pv-about', [
          el('div', 'pv-about-card', [
            el('div', 'pv-avatar', val(e, ['nosotros', 'consultoraIniciales'])),
            h('h3', { key: 'n' }, [
              val(e, ['nosotros', 'consultoraNombre']) + ' ',
              h('span', { key: 'm', className: 'pv-mag' }, val(e, ['nosotros', 'consultoraGrado']))
            ]),
            el('p', 'pv-role', val(e, ['nosotros', 'consultoraRol'])),
            el('p', 'pv-bio', val(e, ['nosotros', 'consultoraBio']))
          ]),
          el('div', 'pv-about-text', [
            el('p', 'pv-eyebrow', val(e, ['nosotros', 'eyebrow'])),
            h('h2', { key: 't' }, val(e, ['nosotros', 'titulo'])),
            h('ul', { key: 'f', className: 'pv-features' }, difs)
          ])
        ])
      ]);

      // --- Proceso ---
      var pasos = items(e, ['proceso', 'pasos']).map(function (p, i) {
        return el('article', 'pv-step', [
          h('span', { key: 'n', className: 'pv-num' }, p.get('num')),
          h('h3', { key: 't' }, p.get('titulo')),
          h('p', { key: 'x' }, p.get('texto'))
        ]);
      });
      var proceso = el('section', 'pv-section', [
        h('header', { key: 'hd', className: 'pv-head center' }, [
          el('p', 'pv-eyebrow', val(e, ['proceso', 'eyebrow'])),
          h('h2', { key: 't' }, val(e, ['proceso', 'titulo'])),
          el('p', 'pv-sub', val(e, ['proceso', 'subtitulo']))
        ]),
        h('div', { key: 'st', className: 'pv-steps' }, pasos)
      ]);

      // --- Sectores ---
      var sectores = items(e, ['sectores', 'lista']).map(function (s, i) {
        return el('div', 'pv-sector', [
          h('span', { key: 'd', className: 'pv-dot' }),
          h('span', { key: 't' }, s)
        ]);
      });
      var sectoresSec = el('section', 'pv-section', [
        el('header', 'pv-head', [
          el('p', 'pv-eyebrow', val(e, ['sectores', 'eyebrow'])),
          h('h2', { key: 't' }, val(e, ['sectores', 'titulo'])),
          el('p', 'pv-sub', val(e, ['sectores', 'subtitulo']))
        ]),
        h('div', { key: 'g', className: 'pv-sectors' }, sectores)
      ]);

      // --- Contacto ---
      var opciones = items(e, ['contacto', 'opcionesServicio']).map(function (o, i) {
        return h('option', { key: i }, o);
      });
      var contacto = el('section', 'pv-contact', [
        el('header', 'pv-head', [
          h('p', { key: 'e', className: 'pv-eyebrow accent' }, val(e, ['contacto', 'eyebrow'])),
          h('h2', { key: 't' }, val(e, ['contacto', 'titulo'])),
          el('p', 'pv-sub', val(e, ['contacto', 'subtitulo']))
        ]),
        el('div', 'pv-form', [
          h('label', { key: 'l1' }, ['Nombre', h('input', { key: 'i', disabled: true, placeholder: 'Tu nombre' })]),
          h('label', { key: 'l2' }, ['¿Qué necesitas?', h('select', { key: 's', disabled: true }, opciones)])
        ])
      ]);

      return el('div', 'pv', [hero, servicios, nosotros, proceso, sectoresSec, contacto]);
    }
  });

  // ==========================================================
  //  SERVICIOS (tarjeta individual)
  // ==========================================================
  var ServicioPreview = createClass({
    render: function () {
      var e = this.props.entry;
      return el('div', 'pv', [
        h('div', { key: 'nt', className: 'pv-section' }, [
          el('div', 'pv-note', 'Así se verá esta tarjeta en la sección «Servicios» del inicio:'),
          h('div', { key: 'c', className: 'pv-cards', style: { marginTop: '16px' } }, [
            el('article', 'pv-card', [
              h('h3', { key: 't' }, val(e, ['title'])),
              h('p', { key: 'd' }, val(e, ['description']))
            ])
          ]),
          h('div', { key: 'b', className: 'pv-prose', style: { marginTop: '24px' } }, this.props.widgetFor('body'))
        ])
      ]);
    }
  });

  // ==========================================================
  //  BLOG (artículo)
  // ==========================================================
  var BlogPreview = createClass({
    render: function () {
      var e = this.props.entry;
      var image = val(e, ['image']);
      var cover = image ? h('img', { key: 'img', className: 'pv-cover', src: image, alt: '' }) : null;
      return el('div', 'pv', [
        el('article', 'pv-article', [
          h('time', { key: 'd' }, val(e, ['date'])),
          h('h1', { key: 't' }, val(e, ['title'])),
          h('p', { key: 'l', className: 'pv-lead' }, val(e, ['description'])),
          cover,
          h('div', { key: 'b', className: 'pv-prose' }, this.props.widgetFor('body'))
        ])
      ]);
    }
  });

  // ==========================================================
  //  DATOS DE LA EMPRESA (site.json) → cómo se ve en el pie
  // ==========================================================
  var EmpresaPreview = createClass({
    render: function () {
      var e = this.props.entry;
      var socials = [];
      var fb = val(e, ['social', 'facebook']);
      var li = val(e, ['social', 'linkedin']);
      var ig = val(e, ['social', 'instagram']);
      if (fb) socials.push(h('span', { key: 'fb', className: 'pv-social-chip' }, 'Facebook'));
      if (li) socials.push(h('span', { key: 'li', className: 'pv-social-chip' }, 'LinkedIn'));
      if (ig) socials.push(h('span', { key: 'ig', className: 'pv-social-chip' }, 'Instagram'));

      function dato(label, path, key) {
        return h('div', { key: key }, [
          h('small', { key: 's' }, label),
          h('strong', { key: 'v' }, val(e, path))
        ]);
      }

      return el('div', 'pv', [
        h('div', { key: 'wrap', className: 'pv-section' }, [
          el('div', 'pv-note', 'Estos datos aparecen en el pie de página, la sección de contacto y la cabecera del sitio.'),
          h('div', { key: 'f', className: 'pv-footer', style: { marginTop: '16px' } }, [
            h('div', { key: 'b', className: 'brand' }, val(e, ['name'])),
            h('p', { key: 'd' }, val(e, ['description'])),
            h('div', { key: 'data', className: 'pv-foot-data' }, [
              dato('Razón social', ['legalName'], 'd1'),
              dato('RUC', ['ruc'], 'd2'),
              dato('Correo', ['email'], 'd3'),
              dato('WhatsApp', ['whatsappDisplay'], 'd4'),
              dato('Ciudad', ['city'], 'd5'),
              dato('Dirección', ['address'], 'd6')
            ]),
            h('div', { key: 'soc', className: 'pv-socials' }, socials)
          ])
        ])
      ]);
    }
  });

  // --- Registrar todas las plantillas ---
  CMS.registerPreviewTemplate('inicio', InicioPreview);
  CMS.registerPreviewTemplate('servicios', ServicioPreview);
  CMS.registerPreviewTemplate('blog', BlogPreview);
  CMS.registerPreviewTemplate('empresa', EmpresaPreview);
})();
