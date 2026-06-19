(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var menu = document.querySelector("[data-menu]");

    if (menuButton && menu) {
      menuButton.addEventListener("click", function () {
        menu.classList.toggle("is-open");
      });
    }

    document.querySelectorAll("img[data-cover]").forEach(function (image) {
      image.addEventListener("error", function () {
        image.classList.add("image-missing");
      });
    });

    var slider = document.querySelector("[data-hero-slider]");

    if (slider) {
      var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
      var prev = slider.querySelector("[data-hero-prev]");
      var next = slider.querySelector("[data-hero-next]");
      var active = 0;
      var timer = null;

      function show(index) {
        active = (index + slides.length) % slides.length;
        slides.forEach(function (slide, idx) {
          slide.classList.toggle("is-active", idx === active);
        });
        dots.forEach(function (dot, idx) {
          dot.classList.toggle("is-active", idx === active);
        });
      }

      function play() {
        clearInterval(timer);
        timer = setInterval(function () {
          show(active + 1);
        }, 5200);
      }

      if (prev) {
        prev.addEventListener("click", function () {
          show(active - 1);
          play();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(active + 1);
          play();
        });
      }

      dots.forEach(function (dot, idx) {
        dot.addEventListener("click", function () {
          show(idx);
          play();
        });
      });

      if (slides.length > 1) {
        play();
      }
    }

    var input = document.querySelector("[data-search-input]");
    var regionSelect = document.querySelector("[data-filter-region]");
    var typeSelect = document.querySelector("[data-filter-type]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-search-card]"));

    function applyFilter() {
      var keyword = input ? input.value.trim().toLowerCase() : "";
      var region = regionSelect ? regionSelect.value.trim().toLowerCase() : "";
      var type = typeSelect ? typeSelect.value.trim().toLowerCase() : "";

      cards.forEach(function (card) {
        var title = (card.getAttribute("data-title") || "").toLowerCase();
        var terms = (card.getAttribute("data-terms") || "").toLowerCase();
        var text = title + " " + terms;
        var matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
        var matchedRegion = !region || terms.indexOf(region) !== -1;
        var matchedType = !type || terms.indexOf(type) !== -1;
        card.style.display = matchedKeyword && matchedRegion && matchedType ? "" : "none";
      });
    }

    [input, regionSelect, typeSelect].forEach(function (node) {
      if (node) {
        node.addEventListener("input", applyFilter);
        node.addEventListener("change", applyFilter);
      }
    });
  });
})();
