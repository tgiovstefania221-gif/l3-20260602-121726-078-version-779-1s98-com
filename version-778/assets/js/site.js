(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  ready(function () {
    var menuButton = document.querySelector('[data-mobile-menu-button]');
    var mobileMenu = document.querySelector('[data-mobile-menu]');

    if (menuButton && mobileMenu) {
      menuButton.addEventListener('click', function () {
        mobileMenu.classList.toggle('is-open');
      });
    }

    document.querySelectorAll('.site-search-form').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = form.querySelector('.site-search-input');
        var query = input ? input.value.trim() : '';
        var target = './search.html';

        if (query) {
          target += '?q=' + encodeURIComponent(query);
        }

        window.location.href = target;
      });
    });

    setupHero();
    setupSearchPage();
    setupLocalFilter();
  });

  function setupHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }

    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        showSlide(index + 1);
      }, 5600);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(index + 1);
        restart();
      });
    }

    showSlide(0);
    restart();
  }

  function setupSearchPage() {
    var page = document.querySelector('[data-search-page]');
    if (!page) {
      return;
    }

    var input = page.querySelector('#search-input');
    var category = page.querySelector('#category-filter');
    var year = page.querySelector('#year-filter');
    var count = page.querySelector('#search-count');
    var cards = Array.prototype.slice.call(page.querySelectorAll('[data-movie-card]'));
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';

    if (input && initialQuery) {
      input.value = initialQuery;
    }

    function apply() {
      var query = normalize(input ? input.value : '');
      var categoryValue = normalize(category ? category.value : '');
      var yearValue = normalize(year ? year.value : '');
      var visible = 0;

      cards.forEach(function (card) {
        var text = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-category'),
          card.getAttribute('data-year'),
          card.getAttribute('data-region'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-tags')
        ].join(' '));
        var matchesQuery = !query || text.indexOf(query) !== -1;
        var matchesCategory = !categoryValue || normalize(card.getAttribute('data-category')) === categoryValue;
        var matchesYear = !yearValue || normalize(card.getAttribute('data-year')) === yearValue;
        var isVisible = matchesQuery && matchesCategory && matchesYear;

        card.classList.toggle('is-hidden', !isVisible);
        if (isVisible) {
          visible += 1;
        }
      });

      if (count) {
        count.textContent = '筛选结果：' + visible + ' 部影片';
      }
    }

    [input, category, year].forEach(function (element) {
      if (element) {
        element.addEventListener('input', apply);
        element.addEventListener('change', apply);
      }
    });

    apply();
  }

  function setupLocalFilter() {
    document.querySelectorAll('[data-local-filter]').forEach(function (box) {
      var input = box.querySelector('input');
      var count = box.querySelector('[data-local-count]');
      var grid = document.querySelector('.searchable-grid');
      var cards = grid ? Array.prototype.slice.call(grid.querySelectorAll('[data-movie-card]')) : [];

      if (!input || !cards.length) {
        return;
      }

      function apply() {
        var query = normalize(input.value);
        var visible = 0;

        cards.forEach(function (card) {
          var text = normalize([
            card.getAttribute('data-title'),
            card.getAttribute('data-region'),
            card.getAttribute('data-genre'),
            card.getAttribute('data-tags')
          ].join(' '));
          var isVisible = !query || text.indexOf(query) !== -1;
          card.classList.toggle('is-hidden', !isVisible);
          if (isVisible) {
            visible += 1;
          }
        });

        if (count) {
          count.textContent = visible + ' 部';
        }
      }

      input.addEventListener('input', apply);
      apply();
    });
  }
})();
