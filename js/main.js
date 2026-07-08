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

  // Deterrente simples de proteção dos previews da Loja — não é proteção
  // real, só bloqueia clique direito e arrastar (ver .preview-protected em style.css).
  var protectedPreviews = document.querySelectorAll('.preview-protected');
  protectedPreviews.forEach(function (el) {
    el.addEventListener('contextmenu', function (event) {
      event.preventDefault();
    });
    el.addEventListener('dragstart', function (event) {
      event.preventDefault();
    });
  });

  // Players de áudio da Loja (partituras/kits/arranjos). Cada .audio-placeholder
  // vira um player funcional se o <audio> tiver data-audio-src preenchido;
  // enquanto vazio (hoje, em todos), fica desabilitado com "Áudio em breve".
  // Só um player toca por vez em toda a página.
  var audioPlayers = document.querySelectorAll('.audio-placeholder');

  function formatAudioTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) seconds = 0;
    var mins = Math.floor(seconds / 60);
    var secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
  }

  audioPlayers.forEach(function (player) {
    var audio = player.querySelector('audio');
    var button = player.querySelector('.audio-placeholder__icon');
    var icon = button ? button.querySelector('span') : null;
    var bar = player.querySelector('.audio-placeholder__bar');
    var timeLabel = player.querySelector('.audio-placeholder__time');

    if (!audio || !button || !icon || !bar || !timeLabel) return;

    var src = audio.getAttribute('data-audio-src');

    if (!src) {
      button.disabled = true;
      bar.disabled = true;
      timeLabel.textContent = 'Áudio em breve';
      return;
    }

    audio.src = src;
    button.disabled = false;
    bar.disabled = false;
    bar.value = 0;
    timeLabel.textContent = formatAudioTime(0) + ' / ' + formatAudioTime(0);

    button.addEventListener('click', function () {
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    });

    audio.addEventListener('play', function () {
      audioPlayers.forEach(function (other) {
        if (other === player) return;
        var otherAudio = other.querySelector('audio');
        if (otherAudio && !otherAudio.paused) {
          otherAudio.pause();
        }
      });
      icon.textContent = '⏸';
      button.setAttribute('aria-label', 'Pausar preview');
    });

    audio.addEventListener('pause', function () {
      icon.textContent = '▶';
      button.setAttribute('aria-label', 'Reproduzir preview');
    });

    audio.addEventListener('loadedmetadata', function () {
      bar.max = audio.duration;
      timeLabel.textContent = formatAudioTime(audio.currentTime) + ' / ' + formatAudioTime(audio.duration);
    });

    audio.addEventListener('timeupdate', function () {
      bar.value = audio.currentTime;
      timeLabel.textContent = formatAudioTime(audio.currentTime) + ' / ' + formatAudioTime(audio.duration);
    });

    bar.addEventListener('input', function () {
      audio.currentTime = bar.value;
    });

    audio.addEventListener('ended', function () {
      audio.currentTime = 0;
      bar.value = 0;
      icon.textContent = '▶';
      button.setAttribute('aria-label', 'Reproduzir preview');
    });
  });
})();
