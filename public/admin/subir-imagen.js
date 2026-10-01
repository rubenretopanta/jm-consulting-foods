/* ============================================================
   Widget «subir-imagen» para Decap CMS.
   Un solo botón que abre el explorador de archivos de la
   computadora y sube la foto directo a Cloudinary, sin la ventana
   de la biblioteca ni inicio de sesión en Cloudinary.

   Usa el preset sin firma «jm_panel» (creado por API): solo acepta
   jpg/png/webp, guarda en la carpeta jm-panel/ y limita las fotos a
   2400 px. En el campo se guarda la URL https de Cloudinary, igual
   que hacía el widget «image», así que el sitio no cambia.
   ============================================================ */
(function () {
  var h = window.h;
  var createClass = window.createClass;
  var CMS = window.CMS;

  var CLOUD = 'aox8u9aa';
  var PRESET = 'jm_panel';
  var MAX_MB = 10; // límite por archivo del plan gratis de Cloudinary
  var TIPOS = ['image/jpeg', 'image/png', 'image/webp'];

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
      ev.target.value = ''; // permite volver a elegir el mismo archivo
      if (!file) return;

      if (TIPOS.indexOf(file.type) === -1) {
        self.setState({ error: 'Ese archivo no es una imagen válida. Usa una foto JPG, PNG o WEBP.' });
        return;
      }
      if (file.size > MAX_MB * 1024 * 1024) {
        self.setState({ error: 'La imagen pesa más de ' + MAX_MB + ' MB. Usa una versión más liviana.' });
        return;
      }

      var datos = new FormData();
      datos.append('file', file);
      datos.append('upload_preset', PRESET);
      self.setState({ subiendo: true, error: '' });

      fetch('https://api.cloudinary.com/v1_1/' + CLOUD + '/image/upload', { method: 'POST', body: datos })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (!res.secure_url) throw new Error(res.error && res.error.message);
          self.setState({ subiendo: false });
          self.props.onChange(res.secure_url);
        })
        .catch(function () {
          self.setState({
            subiendo: false,
            error: 'No se pudo subir la imagen. Revisa tu conexión a internet e inténtalo otra vez.'
          });
        });
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
          accept: 'image/jpeg,image/png,image/webp',
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
    '.si-error{margin:10px 0 0;color:#c0392b;font-size:14px;font-weight:600}'
  ].join('');

  CMS.registerWidget('subir-imagen', Control, Preview);
})();
