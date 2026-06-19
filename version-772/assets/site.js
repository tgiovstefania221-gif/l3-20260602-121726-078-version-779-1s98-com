(function () {
    function qs(selector, root) {
        return (root || document).querySelector(selector);
    }

    function qsa(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function initMenu() {
        var toggle = qs('[data-menu-toggle]');
        var nav = qs('[data-main-nav]');
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener('click', function () {
            nav.classList.toggle('open');
        });
    }

    function initHero() {
        var hero = qs('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = qsa('[data-hero-slide]', hero);
        var dots = qsa('[data-hero-dot]', hero);
        if (slides.length <= 1) {
            return;
        }
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
                start();
            });
        });

        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        start();
    }

    function initFilters() {
        var form = qs('[data-filter-form]');
        var cards = qsa('[data-title]');
        if (!form || !cards.length) {
            return;
        }
        var input = qs('[name="keyword"]', form);
        var year = qs('[name="year"]', form);
        var type = qs('[name="type"]', form);
        var count = qs('[data-result-count]');
        var empty = qs('[data-empty-result]');
        var params = new URLSearchParams(window.location.search);
        var q = params.get('q');
        if (q && input) {
            input.value = q;
        }

        function apply() {
            var keyword = normalize(input && input.value);
            var yearValue = normalize(year && year.value);
            var typeValue = normalize(type && type.value);
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-genre'),
                    card.getAttribute('data-tags'),
                    card.getAttribute('data-year')
                ].join(' '));
                var okKeyword = !keyword || haystack.indexOf(keyword) !== -1;
                var okYear = !yearValue || normalize(card.getAttribute('data-year')) === yearValue;
                var okType = !typeValue || normalize(card.querySelector('.poster-badge') && card.querySelector('.poster-badge').textContent) === typeValue;
                var show = okKeyword && okYear && okType;
                card.style.display = show ? '' : 'none';
                if (show) {
                    visible += 1;
                }
            });

            if (count) {
                count.textContent = '当前显示 ' + visible + ' 部影片';
            }
            if (empty) {
                empty.style.display = visible ? 'none' : 'block';
            }
        }

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            apply();
        });
        ['input', 'change'].forEach(function (eventName) {
            form.addEventListener(eventName, apply);
        });
        apply();
    }

    function initPlayers() {
        qsa('[data-player]').forEach(function (box) {
            var button = qs('.play-overlay', box);
            var video = qs('video', box);
            var source = box.getAttribute('data-video');
            if (!button || !video || !source) {
                return;
            }

            button.addEventListener('click', function () {
                button.style.display = 'none';
                if (window.Hls && window.Hls.isSupported()) {
                    var hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(source);
                    hls.attachMedia(video);
                    hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                        video.play().catch(function () {});
                    });
                } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = source;
                    video.addEventListener('loadedmetadata', function () {
                        video.play().catch(function () {});
                    }, { once: true });
                } else {
                    video.src = source;
                    video.play().catch(function () {});
                }
            });
        });
    }

    function initImageFallback() {
        qsa('img').forEach(function (img) {
            img.addEventListener('error', function () {
                img.style.opacity = '0';
            }, { once: true });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initMenu();
        initHero();
        initFilters();
        initPlayers();
        initImageFallback();
    });
})();
