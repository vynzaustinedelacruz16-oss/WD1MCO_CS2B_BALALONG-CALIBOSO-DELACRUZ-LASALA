document.addEventListener("DOMContentLoaded", function () {

    // NAVBAR SCROLL EFFECT
    const navbar = document.querySelector(".island-navbar");

    if (navbar) {

        function updateNavbar() {
            if (window.scrollY > 50) {
                navbar.style.background = "rgba(25, 7, 48, 0.99)";
            } else {
                navbar.style.background = "rgba(35, 10, 67, 0.96)";
            }
        }

        updateNavbar();

        window.addEventListener("scroll", updateNavbar, {
            passive: true
        });
    }

    // CLOSE MOBILE NAVBAR AFTER CLICKING A LINK
    const navLinks = document.querySelectorAll(
        ".navbar-collapse .nav-link"
    );

    const navMenu = document.querySelector(".navbar-collapse");

    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            if (
                navMenu &&
                navMenu.classList.contains("show") &&
                window.bootstrap &&
                window.bootstrap.Collapse
            ) {
                window.bootstrap.Collapse
                    .getOrCreateInstance(navMenu)
                    .hide();
            }

        });

    });

    // SMOOTH PAGE TRANSITIONS
    let navigationStarted = false;

    document.addEventListener("click", function (event) {

        const target = event.target;

        const link = target instanceof Element
            ? target.closest("a[href]")
            : null;

        if (!link || navigationStarted) return;

        if (event.defaultPrevented || event.button !== 0) return;

        if (
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey ||
            event.metaKey
        ) return;

        if (link.target && link.target !== "_self") return;

        if (link.hasAttribute("download")) return;

        let destination;

        try {
            destination = new URL(link.href, window.location.href);
        } catch (error) {
            return;
        }

        // Only transition to the characters and products pages
        const page = destination.pathname
            .split("/")
            .pop()
            .toLowerCase();

        const isTargetPage =
            page === "characters.html" ||
            page === "products.html";

        if (!isTargetPage) return;

        if (destination.origin !== window.location.origin) return;

        if (destination.pathname === window.location.pathname) return;

        // Respect reduced-motion preferences
        if (
            window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            window.location.href = destination.href;
            return;
        }

        navigationStarted = true;

        event.preventDefault();

        document.body.classList.add("page-leaving");

        window.setTimeout(function () {

            window.location.href = destination.href;

        }, 250);

    });

});