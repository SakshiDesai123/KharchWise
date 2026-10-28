
/* =========================================================
   KHARCHWISE — REGISTRATION PAGE JAVASCRIPT
   Purpose:
   1. Animate the page entrance in a specific sequence.
   2. Validate registration fields.
   3. Show password requirements as the user types.
   4. Preserve password visibility and button interactions.

   Important: This file does not create real user accounts.
   That requires a Flask backend.
   ========================================================= */

/* Add this class so the CSS knows to use entrance animations. */
document.documentElement.classList.add("kw-motion-ready");

/* ---------- Find the registration form elements ---------- */

const form = document.getElementById("register-form");
const nameInput = document.getElementById("full-name");
const emailInput = document.getElementById("register-email");
const passwordInput = document.getElementById("register-password");
const phoneInput = document.getElementById("register-phone");
const termsInput = document.getElementById("accept-terms");
const togglePassword = document.getElementById("toggle-password");
const message = document.getElementById("register-message");
const createButton = form?.querySelector(".create-button");

/* ---------- Error and status messages ---------- */

/* Display an error below the relevant input field. */
function showError(id, text) {
    const element = document.getElementById(id);

    if (!element) return;

    element.textContent = text;
    element.classList.toggle("visible", Boolean(text));
}

/* Display a message after validation or a button click. */
function showMessage(text, type = "success") {
    if (!message) return;

    message.textContent = text;
    message.classList.add("visible");
    message.classList.toggle("error", type === "error");
}

/* Remove an old message when the user starts correcting details. */
function clearMessage() {
    if (!message) return;

    message.textContent = "";
    message.classList.remove("visible", "error");
}

/* ---------- Password requirement indicators ---------- */

/*
   A valid password must contain:
   - At least 8 characters
   - At least one English letter
   - At least one number
*/
function updatePasswordRules() {
    if (!passwordInput) return false;

    const password = passwordInput.value;

    const rules = {
        length: password.length >= 8,
        letter: /[a-zA-Z]/.test(password),
        number: /\d/.test(password)
    };

    document.querySelectorAll(".rule").forEach((rule) => {
        const key = rule.dataset.rule;
        const valid = Boolean(rules[key]);

        rule.classList.toggle("valid", valid);

        const labels = {
            length: "At least 8 characters",
            letter: "At least one letter",
            number: "At least one number"
        };

        if (labels[key]) {
            rule.textContent =
                `${valid ? "✓" : "○"} ${labels[key]}`;
        }
    });

    return Object.values(rules).every(Boolean);
}

/* ---------- Show or hide the password ---------- */

togglePassword?.addEventListener("click", () => {
    if (!passwordInput) return;

    const show = passwordInput.type === "password";

    passwordInput.type = show ? "text" : "password";

    togglePassword.setAttribute(
        "aria-label",
        show ? "Hide password" : "Show password"
    );

    /* Update a text-based icon if your HTML uses one. */
    togglePassword.textContent = show ? "◉" : "◎";
});

/* ---------- Live field feedback ---------- */

/* Clear the name error when the user edits their name. */
nameInput?.addEventListener("input", () => {
    showError("name-error", "");
    clearMessage();
});

/* Clear the email error while the user corrects their email. */
emailInput?.addEventListener("input", () => {
    showError("email-error", "");
    clearMessage();
});

/* Recheck password requirements on every keystroke. */
passwordInput?.addEventListener("input", () => {
    updatePasswordRules();
    showError("password-error", "");
    clearMessage();
});

/* Allow digits only and limit the phone field to 10 digits. */
phoneInput?.addEventListener("input", () => {
    phoneInput.value = phoneInput.value
        .replace(/\D/g, "")
        .slice(0, 10);

    showError("phone-error", "");
    clearMessage();
});

/* Clear the terms error after the checkbox changes. */
termsInput?.addEventListener("change", () => {
    showError("terms-error", "");
    clearMessage();
});

/* ---------- Validate the complete form ---------- */

function validateForm() {
    let valid = true;

    const fullName = nameInput?.value.trim() ?? "";
    const email = emailInput?.value.trim() ?? "";
    const password = passwordInput?.value ?? "";
    const phone = phoneInput?.value.trim() ?? "";

    /* Correct email pattern: text@domain.extension */
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    /* Clear errors from the previous attempt. */
    [
        "name-error",
        "email-error",
        "password-error",
        "phone-error",
        "terms-error"
    ].forEach((id) => showError(id, ""));

    if (fullName.length < 2) {
        showError("name-error", "Please enter your full name.");
        valid = false;
    }

    if (!emailPattern.test(email)) {
        showError("email-error", "Please enter a valid email address.");
        valid = false;
    }

    if (!updatePasswordRules()) {
        showError(
            "password-error",
            "Please meet all three password requirements."
        );
        valid = false;
    }

    if (!/^\d{10}$/.test(phone)) {
        showError(
            "phone-error",
            "Enter a valid 10-digit Indian mobile number."
        );
        valid = false;
    }

    if (!termsInput?.checked) {
        showError("terms-error", "Please accept the terms to continue.");
        valid = false;
    }

    return valid;
}

/* ---------- Handle Create Account ---------- */

form?.addEventListener("submit", (event) => {
    /* Prevent a page reload while frontend validation runs. */
    event.preventDefault();

    clearMessage();

    if (!validateForm()) {
        showMessage(
            "Please check the highlighted fields and try again.",
            "error"
        );

        /*
           We deliberately do not use scrollIntoView().
           This avoids unexpected automatic page scrolling.
        */
        return;
    }

    /*
       Frontend-only response.
       Replace this with a fetch request to Flask when the backend
       registration route is ready.
    */
    showMessage(
        "Your details are valid. Account creation and verification will work after the Flask backend is connected."
    );
});

/* ---------- Google and Apple buttons ---------- */

/* These show a message until OAuth is configured. */
document.getElementById("google-register")?.addEventListener("click", () => {
    showMessage(
        "Google sign-in is not connected yet. Please use the registration form for now.",
        "error"
    );
});

document.getElementById("apple-register")?.addEventListener("click", () => {
    showMessage(
        "Apple sign-in is not connected yet. Please use the registration form for now.",
        "error"
    );
});

/* ---------- Terms of Service and Privacy Policy ---------- */

/* These links display a placeholder until their pages exist. */
document.querySelectorAll("[data-policy]").forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();

        const policy = link.dataset.policy === "terms"
            ? "Terms of Service"
            : "Privacy Policy";

        showMessage(
            `${policy} page has not been created yet.`,
            "error"
        );
    });
});

/* ---------- Cinematic entrance animation ---------- */

function startEntranceAnimation() {
    const page = document.querySelector(".register-page");

    if (!page) return;

    /* Respect the visitor's operating-system motion preference. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.documentElement.classList.remove("kw-motion-ready");
        return;
    }

    /*
       Support both heading class names.
       This lets the animation work with either version of your HTML.
    */
    const heading = document.querySelector(
        ".visual-title, .visual-content h1"
    );

    /*
       Split heading text into individual spans.
       This creates the slow letter-by-letter writing effect.
       Existing nested spans, such as the green text, are preserved.
    */
    if (heading && !heading.dataset.lettersAnimated) {
        heading.dataset.lettersAnimated = "true";

        const walker = document.createTreeWalker(
            heading,
            NodeFilter.SHOW_TEXT
        );

        const textNodes = [];

        while (walker.nextNode()) {
            textNodes.push(walker.currentNode);
        }

        textNodes.forEach((node) => {
            const fragment = document.createDocumentFragment();

            for (const character of node.textContent) {
                if (character === "\n" || character === "\r") {
                    fragment.appendChild(
                        document.createTextNode(character)
                    );
                    continue;
                }

                const letter = document.createElement("span");
                letter.className = "kw-letter";

                /* Preserve spaces so words do not run together. */
                letter.textContent =
                    character === " " ? "\u00A0" : character;

                fragment.appendChild(letter);
            }

            node.replaceWith(fragment);
        });

        /*
           Reveal letters in order.
           The delay is capped so longer headings don't take forever.
        */
        const letters = heading.querySelectorAll(".kw-letter");

        letters.forEach((letter, index) => {
            letter.style.animationDelay =
                `${1.15 + Math.min(index * 0.035, 2.8)}s`;
        });
    }

    /*
       CSS controls the visual sequence:
       logo → heading → photos → quote → registration card.
       The class is added only once, so the entrance doesn't restart
       every time the user types into a field.
    */
    document.documentElement.classList.add("kw-motion-ready");
}

/*
   This script uses defer in the HTML, so the document is parsed
   before this code executes. The ready-state check supports both
   normal page loading and scripts loaded after DOMContentLoaded.
*/
if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        startEntranceAnimation,
        { once: true }
    );
} else {
    startEntranceAnimation();
}

/* Set the correct initial password requirement indicators. */
updatePasswordRules();
