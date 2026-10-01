/* ============================================================
   Subida de imágenes del panel, sin la ventana de Cloudinary.

   1) Widget «subir-imagen»: un botón que abre el explorador de
      archivos y sube la foto directo a Cloudinary. Lo usan todos los
      campos de foto del config.yml.
   2) Biblioteca «subir-directo»: reemplaza a la de Cloudinary en el
      resto del panel (imágenes dentro del texto del blog y de los
      servicios). Al pedir una imagen se abre también el explorador.

   Ambos usan el preset sin firma «jm_panel» (creado por API): solo
   acepta jpg/png/webp, guarda en la carpeta jm-panel/ y limita las
   fotos a 2400 px. Se guarda la URL https de Cloudinary, igual que
   antes, así que el sitio no cambia.
   ============================================================ */
(function () {
  var h = window.h;
  var createClass = window.createClass;
  var CMS = window.CMS;

  var CLOUD = 'aox8u9aa';
  var PRESET = 'jm_panel';
  var MAX_MB = 10; // límite por archivo del plan gratis de Cloudinary
  var TIPOS = ['image/jpeg', 'image/png', 'image/webp'];

  // --- Lo común: validar y subir. Devuelve una promesa con la URL o
  //     rechaza con un mensaje listo para mostrar al cliente. ---
  function subir(file) {
    if (TIPOS.indexOf(file.type) === -1) {
      return Promise.reject('Ese archivo no es una imagen válida. Usa una foto JPG, PNG o WEBP.');
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      return Promise.reject('La imagen pesa más de ' + MAX_MB + ' MB. Usa una versión más liviana.');
    }
    var datos = new FormData();
    datos.append('file', file);
    datos.append('upload_preset', PRESET);
    return fetch('https://api.cloudinary.com/v1_1/' + CLOUD + '/image/upload', { method: 'POST', body: datos })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (!res.secure_url) throw new Error();
        return res.secure_url;
      })
      .catch(function () {
        throw 'No se pudo subir la imagen. Revisa tu conexión a internet e inténtalo otra vez.';
      });
  }

  function crearInput(onFile) {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = TIPOS.join(',');
    input.style.display = 'none';
    input.addEventListener('change', function () {
      var file = input.files && input.files[0];
      input.value = ''; // permite volver a elegir el mismo archivo
      if (file) onFile(file);
    });
    document.body.appendChild(input);
    return input;
  }

  // ==========================================================
  //  1) WIDGET «subir-imagen»
  // ==========================================================
  var Control = createClass({
    getInitialState: function () {
      return { subiendo: false, error: '' };
    },

    // Decap no deja publicar mientras la foto sigue subiendo.
    isValid: function () {
      if (this.state.subiendo) {
        return { error: { message: 'Espera a que termine de subir la imagen.' } };
      }
      return true;
    },

    abrir: function () {
      if (this.input) this.input.click();
    },

    elegido: function (ev) {
      var self = this;
      var file = ev.target.files && ev.target.files[0];
      ev.target.value = '';
      if (!file) return;
      self.setState({ subiendo: true, error: '' });
      subir(file).then(
        function (url) { self.setState({ subiendo: false }); self.props.onChange(url); },
        function (msg) { self.setState({ subiendo: false, error: msg }); }
      );
    },

    render: function () {
      var self = this;
      var url = this.props.value || '';
      var s = this.state;

      var boton = h('button', {
        key: 'btn',
        type: 'button',
        className: 'si-btn',
        disabled: s.subiendo,
        onClick: this.abrir
      }, s.subiendo ? 'Subiendo imagen…' : (url ? 'Cambiar imagen' : 'Subir imagen'));

      var quitar = url && !s.subiendo
        ? h('button', { key: 'del', type: 'button', className: 'si-quitar', onClick: function () { self.props.onChange(''); } }, 'Quitar imagen')
        : null;

      return h('div', { id: this.props.forID, className: (this.props.classNameWrapper || '') + ' si' }, [
        h('style', { key: 'css' }, CSS),
        url
          ? h('img', { key: 'img', className: 'si-foto', src: url, alt: '' })
          : h('div', { key: 'vacio', className: 'si-vacio', onClick: this.abrir }, 'Todavía no hay imagen'),
        h('div', { key: 'acciones', className: 'si-acciones' }, [boton, quitar]),
        s.error ? h('p', { key: 'err', className: 'si-error' }, s.error) : null,
        h('input', {
          key: 'file',
          type: 'file',
          accept: TIPOS.join(','),
          style: { display: 'none' },
          ref: function (el) { self.input = el; },
          onChange: this.elegido
        })
      ]);
    }
  });

  var Preview = createClass({
    render: function () {
      return this.props.value ? h('img', { src: this.props.value, style: { maxWidth: '100%' } }) : null;
    }
  });

  var CSS = [
    '.si-foto{display:block;max-width:260px;max-height:260px;border-radius:8px;border:1px solid #dfe3e8;background:#f7f8f7}',
    '.si-vacio{display:grid;place-items:center;width:260px;height:150px;border:2px dashed #cfd6d2;border-radius:8px;color:#8a959c;font-size:14px;cursor:pointer}',
    '.si-acciones{display:flex;align-items:center;gap:16px;margin-top:14px}',
    '.si-btn{padding:11px 22px;border:0;border-radius:999px;background:#217619;color:#fff;font-size:15px;font-weight:600;cursor:pointer}',
    '.si-btn:hover{background:#1A5D14}',
    '.si-btn:disabled{background:#8a959c;cursor:wait}',
    '.si-quitar{padding:0;border:0;background:none;color:#c0392b;font-size:14px;text-decoration:underline;cursor:pointer}',
    '.si-error{margin:10px 0 0;color:#c0392b;font-size:14px;font-weight:600}',
    // Aviso flotante de la biblioteca mientras sube una imagen del texto.
    '.si-aviso{position:fixed;left:50%;bottom:28px;transform:translateX(-50%);z-index:99999;padding:12px 22px;border-radius:999px;background:#12181C;color:#fff;font:600 15px/1.3 system-ui,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.25)}'
  ].join('');

  CMS.registerWidget('subir-imagen', Control, Preview);

  // ==========================================================
  //  2) BIBLIOTECA «subir-directo»
  //  Decap llama a show() cuando el cliente pide una imagen (por
  //  ejemplo, el bloque «Imagen» del texto del blog). En vez de la
  //  ventana de Cloudinary, se abre el explorador de archivos.
  // ==========================================================
  CMS.registerMediaLibrary({
    name: 'subir-directo',
    init: function (opts) {
      var handleInsert = opts.handleInsert;
      var aviso = null;

      function avisar(texto) {
        if (!aviso) {
          var css = document.createElement('style');
          css.textContent = CSS;
          document.head.appendChild(css);
          aviso = document.createElement('div');
          aviso.className = 'si-aviso';
          document.body.appendChild(aviso);
        }
        aviso.textContent = texto;
        aviso.style.display = texto ? 'block' : 'none';
      }

      var input = crearInput(function (file) {
        avisar('Subiendo imagen…');
        subir(file).then(
          function (url) { avisar(''); handleInsert(url); },
          function (msg) { avisar(''); window.alert(msg); }
        );
      });

      return Promise.resolve({
        show: function () { input.click(); },
        hide: function () {},
        enableStandalone: function () { return false; }
      });
    }
  });
})();
