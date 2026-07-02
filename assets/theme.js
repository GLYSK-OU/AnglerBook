(function () {
  var KEY = 'ab-theme';
  var MODES = ['system', 'light', 'dark'];
  var LABELS = { system: 'Auto', light: 'Light', dark: 'Dark' };
  var ICON = {
    system: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>',
    light:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    dark:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>'
  };
  var META = { light: '#16543C', dark: '#0E1712' };
  var mq = window.matchMedia('(prefers-color-scheme: dark)');

  function getMode() { try { return localStorage.getItem(KEY) || 'system'; } catch (e) { return 'system'; } }
  function setMode(m) { try { localStorage.setItem(KEY, m); } catch (e) {} }
  function resolve(m) { return (m === 'dark' || (m === 'system' && mq.matches)) ? 'dark' : 'light'; }
  function apply(m) {
    var r = resolve(m);
    document.documentElement.setAttribute('data-theme', r);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', META[r]);
  }

  apply(getMode()); // runs during <head> parse: sets the theme before first paint

  function render(btn, m) {
    btn.innerHTML = ICON[m] + '<span>' + LABELS[m] + '</span>';
    var next = MODES[(MODES.indexOf(m) + 1) % MODES.length];
    btn.setAttribute('aria-label', 'Theme: ' + LABELS[m] + '. Activate for ' + LABELS[next] + '.');
    btn.title = 'Theme: ' + LABELS[m];
  }
  function init() {
    if (document.querySelector('.theme-toggle')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-toggle';
    render(btn, getMode());
    btn.addEventListener('click', function () {
      var m = MODES[(MODES.indexOf(getMode()) + 1) % MODES.length];
      setMode(m); apply(m); render(btn, m);
    });
    document.body.appendChild(btn);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  var onSys = function () { if (getMode() === 'system') apply('system'); };
  if (mq.addEventListener) mq.addEventListener('change', onSys);
  else if (mq.addListener) mq.addListener(onSys);
})();
