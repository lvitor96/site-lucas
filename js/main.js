/**
 * Navegação: menu mobile (hamburger) + dropdown "Loja".
 * Sem lógica de negócio aqui — só o esqueleto de navegação.
 */
(function () {
  var navToggle = document.querySelector('.nav-toggle');
  var mainNav = document.querySelector('.main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  var dropdownItems = document.querySelectorAll('.has-dropdown');

  dropdownItems.forEach(function (item) {
    var toggle = item.querySelector('.dropdown-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', function (event) {
      event.preventDefault();
      var isOpen = item.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));

      dropdownItems.forEach(function (other) {
        if (other !== item) {
          other.classList.remove('is-open');
          var otherToggle = other.querySelector('.dropdown-toggle');
          if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  });

  document.addEventListener('click', function (event) {
    dropdownItems.forEach(function (item) {
      if (!item.contains(event.target)) {
        item.classList.remove('is-open');
        var toggle = item.querySelector('.dropdown-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      dropdownItems.forEach(function (item) {
        item.classList.remove('is-open');
        var toggle = item.querySelector('.dropdown-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      });
      if (mainNav) mainNav.classList.remove('is-open');
      if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Acima do breakpoint de desktop, o menu mobile não deve ficar "preso" aberto.
  var desktopQuery = window.matchMedia('(min-width: 60rem)');
  function handleBreakpointChange(event) {
    if (event.matches && mainNav) {
      mainNav.classList.remove('is-open');
      if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    }
  }
  if (desktopQuery.addEventListener) {
    desktopQuery.addEventListener('change', handleBreakpointChange);
  }
})();
