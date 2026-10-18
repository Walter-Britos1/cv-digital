(function () {
  var d = document.documentElement;
  d.classList.add('js');
  var els = document.querySelectorAll('.tile,.block,.proj,.job');
  function count(b) {
    var t = b.textContent,
      n = parseInt(t, 10),
      s = t.replace(/[0-9]/g, ''),
      st = null;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    requestAnimationFrame(function f(ts) {
      st = st || ts;
      var p = Math.min((ts - st) / 1300, 1);
      b.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))) + s;
      if (p < 1) requestAnimationFrame(f);
    });
  }
  var io =
    'IntersectionObserver' in window
      ? new IntersectionObserver(
          function (es) {
            es.forEach(function (x) {
              if (x.isIntersecting) {
                x.target.classList.add('in');
                if (x.target.classList.contains('tile'))
                  count(x.target.querySelector('b'));
                io.unobserve(x.target);
              }
            });
          },
          { threshold: 0.12 },
        )
      : null;
  els.forEach(function (e, i) {
    e.classList.add('rv');
    e.style.setProperty('--d', (i % 4) * 0.09 + 's');
    if (io) io.observe(e);
    else e.classList.add('in');
  });
  var hero = document.querySelector('.hero'),
    tw = document.getElementById('tw');
  hero.addEventListener('pointermove', function (e) {
    var r = hero.getBoundingClientRect();
    hero.style.setProperty(
      '--mx',
      ((e.clientX - r.left) / r.width) * 100 + '%',
    );
    hero.style.setProperty(
      '--my',
      ((e.clientY - r.top) / r.height) * 100 + '%',
    );
  });
  var tb = document.getElementById('theme'),
    mq = window.matchMedia('(prefers-color-scheme: dark)');
  function cur() {
    return d.getAttribute('data-theme') || (mq.matches ? 'dark' : 'light');
  }
  function sync() {
    var dk = cur() === 'dark';
    tb.firstElementChild.textContent = dk ? '☀' : '☾';
    tb.setAttribute(
      'aria-label',
      dk ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro',
    );
  }
  try {
    var sv = localStorage.getItem('wb-theme');
    if (sv) d.setAttribute('data-theme', sv);
  } catch (e) {}
  tb.addEventListener('click', function () {
    var n = cur() === 'dark' ? 'light' : 'dark';
    d.setAttribute('data-theme', n);
    try {
      localStorage.setItem('wb-theme', n);
    } catch (e) {}
    sync();
  });
  sync();
  var ph = [
    'Plataformas de reservas y turnos',
    'Integraciones con WhatsApp y pagos',
    'Paneles administrativos a medida',
    'Sitios multilenguaje',
  ];
  if (tw && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var pi = 0,
      ci = 0,
      del = false;
    (function tick() {
      var w = ph[pi];
      ci += del ? -1 : 1;
      tw.textContent = w.slice(0, ci);
      var t = del ? 28 : 55;
      if (!del && ci === w.length) {
        del = true;
        t = 1600;
      } else if (del && ci === 0) {
        del = false;
        pi = (pi + 1) % ph.length;
        t = 350;
      }
      setTimeout(tick, t);
    })();
  }
})();
