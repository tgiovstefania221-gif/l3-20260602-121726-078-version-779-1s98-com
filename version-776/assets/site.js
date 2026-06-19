(function () {
  var menuButton = document.querySelector("[data-menu-button]");
  var mobilePanel = document.querySelector("[data-mobile-panel]");

  if (menuButton && mobilePanel) {
    menuButton.addEventListener("click", function () {
      mobilePanel.classList.toggle("is-open");
    });
  }

  var hero = document.querySelector("[data-hero]");
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var current = 0;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  var filterInput = document.querySelector("[data-page-filter]");
  var yearFilter = document.querySelector("[data-year-filter]");
  var typeFilter = document.querySelector("[data-type-filter]");
  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));

  function applyFilters() {
    var keyword = filterInput ? filterInput.value.trim().toLowerCase() : "";
    var year = yearFilter ? yearFilter.value : "";
    var type = typeFilter ? typeFilter.value : "";

    cards.forEach(function (card) {
      var text = (card.getAttribute("data-text") || "").toLowerCase();
      var cardYear = card.getAttribute("data-year") || "";
      var cardType = card.getAttribute("data-type") || "";
      var matched = true;

      if (keyword && text.indexOf(keyword) === -1) {
        matched = false;
      }
      if (year && cardYear !== year) {
        matched = false;
      }
      if (type && cardType !== type) {
        matched = false;
      }

      card.style.display = matched ? "" : "none";
    });
  }

  [filterInput, yearFilter, typeFilter].forEach(function (element) {
    if (element) {
      element.addEventListener("input", applyFilters);
      element.addEventListener("change", applyFilters);
    }
  });
})();
