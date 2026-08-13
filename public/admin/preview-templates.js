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
      var heroImg = val(e, ['hero', 'imagen']);
      var hero = el('section', 'pv-hero', [
        h('div', { key: 'txt', className: 'pv-hero-text' }, [
          el('p', 'pv-eyebrow', 'Consultoría para la industria alimentaria · Lima'),
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
        ]),
        heroImg ? h('img', { key: 'img', className: 'pv-media', src: heroImg, alt: '' }) : null
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

      // --- Beneficios (HACCP) ---
      var benefImg = val(e, ['beneficios', 'imagen']);
      var benefItems = items(e, ['beneficios', 'lista']).map(function (b, i) {
        return h('li', { key: i }, [
          h('span', { key: 'tk', className: 'pv-tick small' }, '✓'),
          h('span', { key: 'tx' }, b)
        ]);
      });
      var beneficios = el('section', 'pv-section', [
        h('div', { key: 'g', className: 'pv-split' }, [
          h('div', { key: 'txt' }, [
            el('p', 'pv-eyebrow', val(e, ['beneficios', 'eyebrow'])),
            h('h2', { key: 't', style: { fontSize: '2.2rem', margin: '6px 0 10px' } }, val(e, ['beneficios', 'titulo'])),
            el('p', 'pv-sub', val(e, ['beneficios', 'subtitulo'])),
            h('ul', { key: 'l', className: 'pv-checklist' }, benefItems)
          ]),
          benefImg ? h('img', { key: 'img', className: 'pv-media', src: benefImg, alt: '' }) : null
        ])
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
      var fotoEquipo = val(e, ['nosotros', 'foto']);
      var misionTxt = val(e, ['nosotros', 'mision']);
      var nosotrosIntro = h('div', { key: 'intro', className: 'pv-split', style: { marginBottom: '36px' } }, [
        fotoEquipo ? h('img', { key: 'img', className: 'pv-media', src: fotoEquipo, alt: '' }) : null,
        h('div', { key: 'txt' }, [
          el('p', 'pv-eyebrow', val(e, ['nosotros', 'eyebrow'])),
          h('h2', { key: 't', style: { fontSize: '2.2rem', margin: '6px 0 10px' } }, val(e, ['nosotros', 'titulo'])),
          el('p', 'pv-sub', val(e, ['nosotros', 'quienesSomos'])),
          misionTxt ? h('div', { key: 'm', className: 'pv-mision' }, [
            h('p', { key: 'l', className: 'pv-mision-label' }, val(e, ['nosotros', 'misionTitulo'])),
            h('p', { key: 'p' }, misionTxt)
          ]) : null
        ])
      ]);
      var nosotros = el('section', 'pv-section', [
        nosotrosIntro,
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

      // --- Encabezado de Clientes ---
      var clientesSec = el('section', 'pv-section', [
        h('header', { key: 'hd', className: 'pv-head center' }, [
          el('p', 'pv-eyebrow', val(e, ['clientes', 'eyebrow'])),
          h('h2', { key: 't' }, val(e, ['clientes', 'titulo'])),
          el('p', 'pv-sub', val(e, ['clientes', 'subtitulo']))
        ]),
        el('div', 'pv-note', 'Los logos de los clientes se editan en la sección «Clientes».')
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

      return el('div', 'pv', [hero, servicios, beneficios, nosotros, proceso, sectoresSec, clientesSec, contacto]);
    }
  });

  // ==========================================================
  //  SERVICIOS (tarjeta individual)
  // ==========================================================
  var ServicioPreview = createClass({
    render: function () {
      var e = this.props.entry;
      var img = val(e, ['image']);
      var puntos = items(e, ['bullets']).map(function (b, i) {
        return h('li', { key: i }, b);
      });
      return el('div', 'pv', [
        h('div', { key: 'nt', className: 'pv-section' }, [
          el('div', 'pv-note', 'Así se verá esta tarjeta en la sección «Servicios» del inicio:'),
          h('div', { key: 'c', className: 'pv-cards', style: { marginTop: '16px' } }, [
            el('article', 'pv-card', [
              img ? h('img', { key: 'i', className: 'pv-card-img', src: img, alt: '' }) : null,
              h('div', { key: 'body', className: 'pv-card-body' }, [
                h('h3', { key: 't' }, val(e, ['title'])),
                h('p', { key: 'd' }, val(e, ['description'])),
                puntos.length ? h('ul', { key: 'b', className: 'pv-bullets' }, puntos) : null
              ])
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
  //  CLIENTES (tarjeta individual)
  // ==========================================================
  var ClientePreview = createClass({
    render: function () {
      var e = this.props.entry;
      var image = val(e, ['image']);
      var desc = val(e, ['description']);
      return el('div', 'pv', [
        h('div', { key: 'wrap', className: 'pv-section' }, [
          el('div', 'pv-note', 'Así se verá esta tarjeta en la sección «Clientes» del inicio:'),
          h('div', { key: 'g', className: 'pv-clients', style: { marginTop: '16px' } }, [
            el('article', 'pv-client-card', [
              image ? h('img', { key: 'img', className: 'pv-client-logo', src: image, alt: '' }) : h('div', { key: 'ph', className: 'pv-client-logo' }),
              h('h3', { key: 'n' }, val(e, ['name'])),
              desc ? h('p', { key: 'd' }, desc) : null
            ])
          ])
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
              dato('Teléfono', ['phoneAltDisplay'], 'd5'),
              dato('Ciudad', ['city'], 'd6'),
              dato('Dirección', ['address'], 'd7')
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
  CMS.registerPreviewTemplate('clientes', ClientePreview);
  CMS.registerPreviewTemplate('empresa', EmpresaPreview);
})();
