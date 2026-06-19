const state = {
    hls: null
};

document.addEventListener("DOMContentLoaded", () => {
    initMobileNavigation();
    initHeroCarousel();
    initCardsFilter();
    initPlayerCards();
});

function initMobileNavigation() {
    const toggle = document.querySelector("[data-nav-toggle]");
    const menu = document.querySelector("[data-mobile-nav]");
    if (!toggle || !menu) {
        return;
    }
    toggle.addEventListener("click", () => {
        menu.classList.toggle("is-open");
    });
}

function initHeroCarousel() {
    const root = document.querySelector("[data-hero]");
    if (!root) {
        return;
    }
    const slides = Array.from(root.querySelectorAll("[data-hero-slide]"));
    const dots = Array.from(root.querySelectorAll("[data-hero-dot]"));
    const prev = root.querySelector("[data-hero-prev]");
    const next = root.querySelector("[data-hero-next]");
    if (!slides.length) {
        return;
    }
    let index = 0;
    let timer = null;

    const show = (nextIndex) => {
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle("is-active", slideIndex === index);
        });
        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle("is-active", dotIndex === index);
        });
    };

    const play = () => {
        window.clearInterval(timer);
        timer = window.setInterval(() => show(index + 1), 5500);
    };

    dots.forEach((dot, dotIndex) => {
        dot.addEventListener("click", () => {
            show(dotIndex);
            play();
        });
    });

    if (prev) {
        prev.addEventListener("click", () => {
            show(index - 1);
            play();
        });
    }

    if (next) {
        next.addEventListener("click", () => {
            show(index + 1);
            play();
        });
    }

    show(0);
    play();
}

function initCardsFilter() {
    const list = document.querySelector("[data-card-list]");
    if (!list) {
        return;
    }
    const cards = Array.from(list.querySelectorAll("[data-card]"));
    const input = document.querySelector("[data-filter-input]");
    const category = document.querySelector("[data-category-filter]");
    const sort = document.querySelector("[data-sort-select]");
    const result = document.querySelector("[data-result-count]");
    const url = new URL(window.location.href);
    const initialQuery = url.searchParams.get("q");

    if (input && initialQuery) {
        input.value = initialQuery;
    }

    const apply = () => {
        const keyword = input ? input.value.trim().toLowerCase() : "";
        const categoryValue = category ? category.value : "";
        let visible = 0;

        cards.forEach((card) => {
            const text = (card.dataset.searchText || "").toLowerCase();
            const sameCategory = !categoryValue || card.dataset.category === categoryValue;
            const sameKeyword = !keyword || text.includes(keyword);
            const showCard = sameCategory && sameKeyword;
            card.classList.toggle("is-hidden-card", !showCard);
            if (showCard) {
                visible += 1;
            }
        });

        if (result) {
            result.textContent = `匹配 ${visible} 部`;
        }
    };

    const reorder = () => {
        if (!sort) {
            apply();
            return;
        }
        const value = sort.value;
        const ordered = cards.slice().sort((a, b) => {
            if (value === "year-asc") {
                return Number(a.dataset.year) - Number(b.dataset.year);
            }
            if (value === "title") {
                const at = a.querySelector("h3")?.textContent || "";
                const bt = b.querySelector("h3")?.textContent || "";
                return at.localeCompare(bt, "zh-Hans-CN");
            }
            if (value === "rank") {
                return cards.indexOf(a) - cards.indexOf(b);
            }
            return Number(b.dataset.year) - Number(a.dataset.year);
        });
        ordered.forEach((card) => list.appendChild(card));
        apply();
    };

    if (input) {
        input.addEventListener("input", apply);
    }
    if (category) {
        category.addEventListener("change", apply);
    }
    if (sort) {
        sort.addEventListener("change", reorder);
    }
    reorder();
}

function initPlayerCards() {
    const players = document.querySelectorAll("[data-player]");
    players.forEach((player) => {
        const video = player.querySelector("video");
        const button = player.querySelector("[data-play-button]");
        const source = player.dataset.source;
        let loaded = false;

        if (!video || !source) {
            return;
        }

        const hide = () => {
            if (button) {
                button.classList.add("is-hidden");
            }
        };

        const loadAndPlay = async () => {
            hide();
            if (!loaded) {
                loaded = true;
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = source;
                } else {
                    try {
                        const Hls = await getHls();
                        if (Hls && Hls.isSupported()) {
                            const hls = new Hls({
                                enableWorker: true,
                                lowLatencyMode: true
                            });
                            hls.loadSource(source);
                            hls.attachMedia(video);
                            player.hlsController = hls;
                        } else {
                            video.src = source;
                        }
                    } catch (error) {
                        video.src = source;
                    }
                }
            }
            video.play().catch(() => {});
        };

        if (button) {
            button.addEventListener("click", loadAndPlay);
        }

        video.addEventListener("play", hide);
        video.addEventListener("click", () => {
            if (video.paused) {
                loadAndPlay();
            }
        });
    });
}

async function getHls() {
    if (state.hls) {
        return state.hls;
    }
    const mod = await import("./hls-vendor-dru42stk.js");
    state.hls = mod.H;
    return state.hls;
}
