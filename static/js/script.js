
/* KharchWise — Entrance animations and existing interactions */

document.addEventListener("DOMContentLoaded", () => {
    const cards = Array.from(document.querySelectorAll(".carousel-card"));
    const carousel = document.querySelector(".carousel");

    let currentIndex = 0;
    let rotationTimer = null;
    let entranceTimer = null;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    function updateCarousel() {
        const total = cards.length;
        if (!total) return;

        cards.forEach((card, index) => {
            card.classList.remove(
                "position-left",
                "position-center",
                "position-right",
                "position-hidden"
            );

            const position = (index - currentIndex + total) % total;

            if (position === 0) {
                card.classList.add("position-center");
            } else if (position === 1) {
                card.classList.add("position-right");
            } else if (position === total - 1) {
                card.classList.add("position-left");
            } else {
                card.classList.add("position-hidden");
            }
        });
    }

    function stopRotation() {
        if (rotationTimer !== null) {
            clearInterval(rotationTimer);
            rotationTimer = null;
        }
    }

    function startRotation() {
        stopRotation();

        if (cards.length < 2) return;

        rotationTimer = setInterval(() => {
            currentIndex = (currentIndex + 1) % cards.length;
            updateCarousel();
        }, 2400);
    }

    // Prepare carousel before starting the entrance sequence.
    updateCarousel();
    stopRotation();

    // Start entrance animations when the page loads.
    function startEntrance() {
        document.body.classList.add("kw-entrance-active");

        if (reducedMotion) {
            document.body.classList.add("kw-entrance-complete");
            startRotation();
            return;
        }

        // Logo -> photos -> login card -> login content.
        entranceTimer = setTimeout(() => {
            document.body.classList.add("kw-entrance-complete");
            startRotation();
        }, 4200);
    }

    startEntrance();

    carousel?.addEventListener("mouseenter", stopRotation);
    carousel?.addEventListener("mouseleave", startRotation);

    // Password visibility.
    const passwordInput = document.getElementById("password");
    const passwordToggle = document.getElementById("password-toggle");

    passwordToggle?.addEventListener("click", () => {
        if (!passwordInput) return;

        const shouldShow = passwordInput.type === "password";
        passwordInput.type = shouldShow ? "text" : "password";

        passwordToggle.setAttribute(
            "aria-label",
            shouldShow ? "Hide password" : "Show password"
        );
    });

    // Sign-in and create-account modes.
    const signinTab = document.getElementById("signin-tab");
    const signupTab = document.getElementById("signup-tab");
    const submitLabel = document.getElementById("submit-label");
    const switchText = document.getElementById("account-switch-text");
    const switchButton = document.getElementById("account-switch-button");
    const formMessage = document.getElementById("form-message");
    const authForm = document.getElementById("auth-form");

    let authMode = "signin";

    function setAuthMode(mode) {
        authMode = mode;
        const signingIn = mode === "signin";

        signinTab?.classList.toggle("active", signingIn);
        signupTab?.classList.toggle("active", !signingIn);

        if (submitLabel) {
            submitLabel.textContent = signingIn
                ? "Sign In"
                : "Create Account";
        }

        if (switchText) {
            switchText.textContent = signingIn
                ? "New to KharchWise?"
                : "Already have an account?";
        }

        if (switchButton) {
            switchButton.textContent = signingIn
                ? "Create an account"
                : "Sign in";
        }

        if (passwordInput) {
            passwordInput.autocomplete = signingIn
                ? "current-password"
                : "new-password";
        }

        if (formMessage) formMessage.textContent = "";
    }

    signinTab?.addEventListener("click", () => setAuthMode("signin"));
    signupTab?.addEventListener("click", () => {
    window.location.href = "/register";
});

    switchButton?.addEventListener("click", () => {
        window.location.href = "/register";
    });

    authForm?.addEventListener("submit", (event) => {
        event.preventDefault();

        if (formMessage) {
            formMessage.textContent = authMode === "signin"
                ? "Login backend is not connected yet."
                : "Registration backend is not connected yet.";
        }
    });

    document.getElementById("google-button")?.addEventListener("click", () => {
        if (formMessage) {
            formMessage.textContent =
                "Google sign-in has not been connected yet.";
        }
    });

    document.getElementById("apple-button")?.addEventListener("click", () => {
        if (formMessage) {
            formMessage.textContent =
                "Apple sign-in has not been connected yet.";
        }
    });

    document.getElementById("forgot-password")?.addEventListener(
        "click",
        (event) => {
            event.preventDefault();

            if (formMessage) {
                formMessage.textContent =
                    "Password recovery has not been connected yet.";
            }
        }
    );

    // Avoid unused timer handles if the page is refreshed.
    window.addEventListener("pagehide", () => {
        stopRotation();
        if (entranceTimer !== null) clearTimeout(entranceTimer);
    });
});
