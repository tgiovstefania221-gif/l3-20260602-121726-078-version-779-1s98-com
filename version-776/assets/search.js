(function () {
  var form = document.querySelector("[data-search-form]");
  var input = document.querySelector("[data-search-input]");
  var type = document.querySelector("[data-search-type]");
  var results = document.querySelector("[data-search-results]");
  var params = new URLSearchParams(window.location.search);
  var initial = params.get("q") || "";

  if (input) {
    input.value = initial;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function render(items) {
    if (!results) {
      return;
    }

    if (!items.length) {
      results.innerHTML = '<div class="result-empty">没有找到匹配内容，可以换一个片名、地区或标签继续搜索。</div>';
      return;
    }

    results.innerHTML = items.slice(0, 120).map(function (movie) {
      return [
        '<article class="movie-card">',
        '  <a class="poster-link" href="movies/' + movie.file + '">',
        '    <img src="./' + movie.cover + '.jpg" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
        '    <span class="poster-play">播放</span>',
        '  </a>',
        '  <div class="card-body">',
        '    <div class="card-meta"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.type) + '</span></div>',
        '    <h3><a href="movies/' + movie.file + '">' + escapeHtml(movie.title) + '</a></h3>',
        '    <p>' + escapeHtml(movie.oneLine) + '</p>',
        '    <div class="tag-row"><span>' + escapeHtml(movie.category) + '</span><span>' + escapeHtml(movie.genre) + '</span></div>',
        '  </div>',
        '</article>'
      ].join("");
    }).join("");
  }

  function search() {
    var keyword = input ? input.value.trim().toLowerCase() : "";
    var selectedType = type ? type.value : "";
    var source = window.SEARCH_MOVIES || [];
    var items = source.filter(function (movie) {
      var text = [movie.title, movie.oneLine, movie.genre, movie.region, movie.type, movie.tags, movie.category].join(" ").toLowerCase();
      if (keyword && text.indexOf(keyword) === -1) {
        return false;
      }
      if (selectedType && movie.type !== selectedType) {
        return false;
      }
      return true;
    });
    render(items);
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      search();
    });
  }

  if (input) {
    input.addEventListener("input", search);
  }

  if (type) {
    type.addEventListener("change", search);
  }

  search();
})();
