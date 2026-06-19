(function () {
  const menuButton = document.querySelector(".mobile-menu-button");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", function () {
      mobileMenu.classList.toggle("is-open");
    });
  }

  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  const dots = Array.from(document.querySelectorAll(".hero-dot"));
  let current = 0;
  let timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("is-active", slideIndex === current);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("is-active", dotIndex === current);
    });
  }

  function startHero() {
    if (slides.length <= 1) {
      return;
    }

    timer = window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      if (timer) {
        window.clearInterval(timer);
      }
      showSlide(index);
      startHero();
    });
  });

  showSlide(0);
  startHero();

  const rootPrefix = document.documentElement.getAttribute("data-root") || ".";
  const cleanRoot = rootPrefix.endsWith("/") ? rootPrefix.slice(0, -1) : rootPrefix;

  function makeUrl(path) {
    return cleanRoot + "/" + path.replace(/^\.\//, "");
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function renderResults(form, items) {
    const box = form.querySelector(".search-results");
    if (!box) {
      return;
    }

    if (!items.length) {
      box.innerHTML = '<div class="search-result-item"><span>暂无匹配内容</span></div>';
      box.classList.add("is-open");
      return;
    }

    box.innerHTML = items.slice(0, 18).map(function (item) {
      return [
        '<a class="search-result-item" href="',
        makeUrl(item.href),
        '">',
        '<img src="',
        makeUrl(item.cover),
        '" alt="',
        item.title,
        '">',
        '<span><strong>',
        item.title,
        '</strong><span>',
        item.year,
        ' · ',
        item.category,
        ' · ',
        item.genre,
        '</span></span></a>'
      ].join("");
    }).join("");
    box.classList.add("is-open");
  }

  Array.from(document.querySelectorAll(".search-box")).forEach(function (form) {
    const input = form.querySelector('input[type="search"]');
    const results = form.querySelector(".search-results");

    function runSearch() {
      const query = normalize(input.value);
      if (!query) {
        if (results) {
          results.classList.remove("is-open");
          results.innerHTML = "";
        }
        return;
      }

      const data = Array.isArray(window.siteMovies) ? window.siteMovies : [];
      const matched = data.filter(function (item) {
        const haystack = normalize([
          item.title,
          item.year,
          item.category,
          item.genre,
          item.region,
          item.tags
        ].join(" "));
        return haystack.indexOf(query) !== -1;
      });
      renderResults(form, matched);
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      runSearch();
    });

    if (input) {
      input.addEventListener("input", runSearch);
      input.addEventListener("focus", runSearch);
    }

    document.addEventListener("click", function (event) {
      if (results && !form.contains(event.target)) {
        results.classList.remove("is-open");
      }
    });
  });
})();
