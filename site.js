// Sven A. Hartmann – kleine Helfer für die Website:
// Abschnitte aufklappen, Fotos vergrößern, Spiele öffnen.
(function () {

  // Umschalter hell/dunkel (die Wahl wird im Browser gemerkt)
  var themeButton = document.querySelector('.theme-toggle');
  if (themeButton) {
    themeButton.addEventListener('click', function () {
      var root = document.documentElement;
      var light = root.getAttribute('data-theme') !== 'light';
      if (light) root.setAttribute('data-theme', 'light'); else root.removeAttribute('data-theme');
      try { localStorage.setItem('theme', light ? 'light' : 'dark'); } catch (e) {}
    });
  }
  // Abstract / Presentations auf- und zuklappen (Research)
  document.querySelectorAll('button[aria-controls]').forEach(function (button) {
    button.addEventListener('click', function () {
      var panel = document.getElementById(button.getAttribute('aria-controls'));
      var isOpen = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!isOpen));
      panel.hidden = isOpen;
    });
  });

  // Erzeugt ein Fenster mit Titelzeile und Schließen-Knopf
  function makeDialog(id, content) {
    var dialog = document.createElement('dialog');
    dialog.id = id;
    dialog.innerHTML = '<div class="viewer-bar"><span></span>' +
      '<button type="button" class="viewer-close" aria-label="Close">✕</button></div>' + content;
    document.body.appendChild(dialog);
    dialog.querySelector('.viewer-close').addEventListener('click', function () { dialog.close(); });
    return dialog;
  }

  // Fotos vergrößern (Presentations, Fun)
  var photoDialog;
  document.querySelectorAll('.zoom-btn').forEach(function (button) {
    button.addEventListener('click', function () {
      if (!photoDialog) {
        photoDialog = makeDialog('photo-viewer', '<img src="" alt="">');
        photoDialog.addEventListener('click', function (event) {
          if (event.target === photoDialog || event.target.tagName === 'IMG') photoDialog.close();
        });
      }
      var small = button.querySelector('img');
      var caption = button.parentNode.querySelector('figcaption');
      var big = photoDialog.querySelector('img');
      big.src = small.src;
      big.alt = small.alt;
      photoDialog.querySelector('span').textContent = caption ? caption.textContent : '';
      photoDialog.showModal();
    });
  });

  // Spiele im Fenster öffnen (Fun)
  var gameDialog;
  document.querySelectorAll('.game-tile').forEach(function (button) {
    button.addEventListener('click', function () {
      if (!gameDialog) {
        gameDialog = makeDialog('game-viewer', '<iframe id="game-frame" title="Game"></iframe>');
        gameDialog.addEventListener('click', function (event) {
          if (event.target === gameDialog) gameDialog.close();
        });
        gameDialog.addEventListener('close', function () {
          gameDialog.querySelector('iframe').src = 'about:blank';
        });
      }
      var frame = gameDialog.querySelector('iframe');
      gameDialog.querySelector('span').textContent = button.dataset.title;
      frame.title = button.dataset.title;
      frame.src = button.dataset.src;
      frame.addEventListener('load', function () {
        try { frame.contentWindow.focus(); } catch (e) {}
      }, { once: true });
      gameDialog.showModal();
    });
  });
})();
