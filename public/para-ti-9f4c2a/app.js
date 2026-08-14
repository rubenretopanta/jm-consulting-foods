/* =========================================================
   Regalo de aniversario — lógica
   Todo el contenido editable vive en datos.js
   ========================================================= */
(function () {
  "use strict";

  var D = window.DATOS || {};
  var $ = function (id) { return document.getElementById(id); };
  var menosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     Textos
  --------------------------------------------------------- */
  function texto(id, valor) {
    var el = $(id);
    if (el && valor) el.textContent = valor;
  }

  texto("sobrePara", D.textoSobre);
  texto("heroKicker", D.kicker);
  texto("heroNombre", D.nombre);
  texto("contadorTitulo", D.contadorTitulo);
  texto("contadorPie", D.contadorPie);
  texto("galeriaTitulo", D.galeriaTitulo);
  texto("galeriaSub", D.galeriaSub);
  texto("pieTexto", D.pie);
  document.title = D.textoSobre || "Para ti";

  var carta = D.carta || {};
  texto("cartaTitulo", carta.titulo);
  texto("cartaFirma", carta.firma);
  if (carta.parrafos && carta.parrafos.length) {
    var cuerpo = $("cartaCuerpo");
    carta.parrafos.forEach(function (p) {
      var el = document.createElement("p");
      el.textContent = p;
      cuerpo.appendChild(el);
    });
  } else {
    $("secCarta").hidden = true;
  }

  /* ---------------------------------------------------------
     Corazones de fondo
  --------------------------------------------------------- */
  function corazones() {
    if (menosMovimiento) return;
    var caja = $("corazones");
    var total = window.innerWidth < 600 ? 14 : 22;
    for (var i = 0; i < total; i++) {
      var h = document.createElement("i");
      h.textContent = Math.random() > .35 ? "♥" : "❤";
      h.style.left = (Math.random() * 100) + "vw";
      h.style.fontSize = (10 + Math.random() * 16) + "px";
      h.style.animationDuration = (11 + Math.random() * 14) + "s";
      h.style.animationDelay = (-Math.random() * 20) + "s";
      h.style.setProperty("--deriva", (Math.random() * 16 - 8) + "vw");
      caja.appendChild(h);
    }
  }

  /* ---------------------------------------------------------
     Contador en vivo
  --------------------------------------------------------- */
  function iniciarContador() {
    var inicio = new Date(D.fechaInicio);
    if (isNaN(inicio.getTime())) { $("secContador").hidden = true; return; }

    var campos = {};
    ["anios", "meses", "dias", "horas", "minutos", "segundos"].forEach(function (k) {
      campos[k] = document.querySelector('[data-c="' + k + '"]');
    });

    function pintar() {
      var ahora = new Date();
      if (ahora < inicio) return;

      var anios  = ahora.getFullYear() - inicio.getFullYear();
      var meses  = ahora.getMonth() - inicio.getMonth();
      var dias   = ahora.getDate() - inicio.getDate();
      var horas  = ahora.getHours() - inicio.getHours();
      var mins   = ahora.getMinutes() - inicio.getMinutes();
      var segs   = ahora.getSeconds() - inicio.getSeconds();

      if (segs < 0) { segs += 60; mins--; }
      if (mins < 0) { mins += 60; horas--; }
      if (horas < 0) { horas += 24; dias--; }
      if (dias < 0) {
        // días del mes anterior al actual
        meses--;
        dias += new Date(ahora.getFullYear(), ahora.getMonth(), 0).getDate();
      }
      if (meses < 0) { meses += 12; anios--; }

      var v = { anios: anios, meses: meses, dias: dias, horas: horas, minutos: mins, segundos: segs };
      for (var k in campos) {
        if (campos[k] && campos[k].textContent !== String(v[k])) campos[k].textContent = v[k];
      }
    }

    pintar();
    setInterval(pintar, 1000);
  }

  /* ---------------------------------------------------------
     Frase que se escribe sola (portada)
  --------------------------------------------------------- */
  function escribirHero() {
    var el = $("heroFrase");
    var txt = D.fraseHero || "";
    if (!txt) return;
    if (menosMovimiento) { el.textContent = txt; return; }

    var i = 0;
    var cursor = document.createElement("span");
    cursor.className = "cursor";
    cursor.textContent = "|";
    el.appendChild(cursor);

    (function paso() {
      if (i < txt.length) {
        cursor.insertAdjacentText("beforebegin", txt.charAt(i));
        i++;
        setTimeout(paso, 55);
      } else {
        setTimeout(function () { cursor.remove(); }, 1800);
      }
    })();
  }

  /* ---------------------------------------------------------
     Frases rotativas
  --------------------------------------------------------- */
  function iniciarFrases() {
    var lista = D.frases || [];
    if (!lista.length) { $("secFrases").hidden = true; return; }

    var el = $("frase");
    var cajaPuntos = $("puntos");
    var actual = 0;
    var reloj;

    lista.forEach(function (_, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Frase " + (i + 1));
      b.addEventListener("click", function () { ir(i); reiniciar(); });
      cajaPuntos.appendChild(b);
    });
    var puntos = cajaPuntos.children;

    function ir(i) {
      actual = (i + lista.length) % lista.length;
      el.classList.add("oculta");
      setTimeout(function () {
        el.textContent = lista[actual];
        el.classList.remove("oculta");
        for (var p = 0; p < puntos.length; p++) {
          puntos[p].classList.toggle("on", p === actual);
        }
      }, menosMovimiento ? 0 : 500);
    }

    function reiniciar() {
      clearInterval(reloj);
      reloj = setInterval(function () { ir(actual + 1); }, 6500);
    }

    el.textContent = lista[0];
    puntos[0].classList.add("on");
    reiniciar();
  }

  /* ---------------------------------------------------------
     Galería + visor
  --------------------------------------------------------- */
  function iniciarGaleria() {
    var fotos = (D.fotos || []).filter(function (f) { return f && f.archivo; });
    var caja = $("galeria");

    if (!fotos.length) {
      caja.innerHTML = '<p class="galeria-vacia">Aquí van nuestras fotos ♥</p>';
      return;
    }

    fotos.forEach(function (f, i) {
      var b = document.createElement("button");
      b.type = "button";
      var img = document.createElement("img");
      img.src = f.archivo;
      img.alt = f.texto || "Foto " + (i + 1);
      img.loading = "lazy";
      img.decoding = "async";
      // si una foto no existe, quitamos su cuadrito en vez de mostrar roto
      img.addEventListener("error", function () { b.remove(); });
      b.appendChild(img);
      b.addEventListener("click", function () { abrir(i); });
      caja.appendChild(b);
    });

    var visor   = $("visor");
    var vImg    = $("visorImg");
    var vPie    = $("visorPie");
    var indice  = 0;

    function abrir(i) {
      indice = (i + fotos.length) % fotos.length;
      vImg.src = fotos[indice].archivo;
      vImg.alt = fotos[indice].texto || "";
      vPie.textContent = fotos[indice].texto || "";
      visor.hidden = false;
      document.body.classList.add("sin-scroll");
    }
    function cerrar() {
      visor.hidden = true;
      document.body.classList.remove("sin-scroll");
    }

    $("visorCerrar").addEventListener("click", cerrar);
    $("visorPrev").addEventListener("click", function () { abrir(indice - 1); });
    $("visorSig").addEventListener("click", function () { abrir(indice + 1); });
    visor.addEventListener("click", function (e) { if (e.target === visor) cerrar(); });

    document.addEventListener("keydown", function (e) {
      if (visor.hidden) return;
      if (e.key === "Escape")     cerrar();
      if (e.key === "ArrowLeft")  abrir(indice - 1);
      if (e.key === "ArrowRight") abrir(indice + 1);
    });

    // deslizar con el dedo
    var x0 = null;
    visor.addEventListener("touchstart", function (e) { x0 = e.changedTouches[0].clientX; }, { passive: true });
    visor.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) abrir(indice + (dx < 0 ? 1 : -1));
      x0 = null;
    }, { passive: true });
  }

  /* ---------------------------------------------------------
     Aparición al hacer scroll
  --------------------------------------------------------- */
  function iniciarRevelado() {
    var items = document.querySelectorAll(".revelar");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("visible"); });
      return;
    }
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { obs.observe(el); });
  }

  /* ---------------------------------------------------------
     Música
  --------------------------------------------------------- */
  var audio = $("audio");
  var musicaLista = false;

  function prepararMusica() {
    if (!D.musica) return;
    audio.src = D.musica;
    var btn = $("musicaBtn");
    var icono = $("musicaIcono");
    btn.hidden = false;
    musicaLista = true;

    btn.addEventListener("click", function () {
      if (audio.paused) { audio.play().catch(function () {}); }
      else { audio.pause(); }
    });
    audio.addEventListener("play", function () {
      btn.classList.add("sonando");
      icono.textContent = "❚❚";
    });
    audio.addEventListener("pause", function () {
      btn.classList.remove("sonando");
      icono.textContent = "♪";
    });
  }

  /* ---------------------------------------------------------
     Abrir el sobre
  --------------------------------------------------------- */
  function iniciarSobre() {
    var pantalla = $("sobrePantalla");
    var boton    = $("sobreBtn");
    var abierto  = false;

    boton.addEventListener("click", function () {
      if (abierto) return;
      abierto = true;
      boton.classList.add("abierto");

      // la música necesita este toque del usuario para poder sonar
      if (musicaLista) { audio.volume = 0.55; audio.play().catch(function () {}); }

      setTimeout(function () {
        pantalla.classList.add("fuera");
        $("pagina").hidden = false;
        escribirHero();
        iniciarRevelado();
        setTimeout(function () { pantalla.remove(); }, 1000);
      }, menosMovimiento ? 100 : 1300);
    });
  }

  /* ---------------------------------------------------------
     Arranque
  --------------------------------------------------------- */
  corazones();
  iniciarContador();
  iniciarFrases();
  iniciarGaleria();
  prepararMusica();
  iniciarSobre();
})();
