"use strict";

class BookModal {
    constructor() {
        this.modal = document.getElementById("book-modal");

        if (!this.modal) return;

        this.buttons = document.querySelectorAll(
            ".card__button, .card__button--carrusel"
        );

        this.image = document.getElementById("modal-image");
        this.title = document.getElementById("modal-title");
        this.author = document.getElementById("modal-author");
        this.description = document.getElementById("modal-description");
        this.price = document.getElementById("modal-price");

        this.closeButton = this.modal.querySelector("[data-modal-close]");
        this.requestLink = this.modal.querySelector(".modal__button");

        this.init();
    }

    init() {
        this.buttons.forEach(button => {
            button.addEventListener("click", () => {
                this.open(button);
            });
        });

        this.closeButton?.addEventListener("click", () => {
            this.close();
        });

        this.requestLink?.addEventListener("click", () => {
            this.close();
        });

        this.modal.addEventListener("click", event => {
            if (event.target === this.modal) {
                this.close();
            }
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape" && !this.modal.hidden) {
                this.close();
            }
        });
    }

    open(button) {
        const card = button.closest(".card");

        if (!card) return;

        const image = card.querySelector(".card__image");
        const title = card.querySelector(".card__title");
        const author = card.querySelector(".card__author");
        const description = card.querySelector(".card__description");
        const price = card.querySelector(".card__price");

        if (image) {
            this.image.src = image.src;
            this.image.alt = image.alt;
        }

        if (title) {
            this.title.textContent = title.textContent.trim();
        }

        if (author) {
            this.author.textContent = author.textContent.trim();
        }

        if (description) {
            this.description.textContent = description.textContent.trim();
        }

        if (price) {
            this.price.textContent = price.textContent.trim();
        }

        this.modal.hidden = false;
        document.body.style.overflow = "hidden";
    }

    close() {
        this.modal.hidden = true;
        document.body.style.overflow = "";
    }
}


class Carousel {
    constructor() {
        this.root = document.querySelector("[data-carousel]");

        if (!this.root) return;

        this.track = this.root.querySelector("[data-carousel-track]");
        this.prevButton = this.root.querySelector("[data-carousel-prev]");
        this.nextButton = this.root.querySelector("[data-carousel-next]");
        this.dotsContainer = this.root.querySelector("[data-carousel-dots]");

        this.slides = [...this.track.children];
        this.index = 0;

        this.init();
    }

    init() {
        this.prevButton.addEventListener("click", () => {
            this.index--;
            this.update();
        });

        this.nextButton.addEventListener("click", () => {
            this.index++;
            this.update();
        });

        window.addEventListener("resize", () => {
            this.createDots();
            this.update();
        });

        this.createDots();
        this.update();
    }

    getVisibleCount() {
        if (window.matchMedia("(min-width: 960px)").matches) {
            return 3;
        }

        if (window.matchMedia("(min-width: 640px)").matches) {
            return 2;
        }

        return 1;
    }

    getMaxIndex() {
        return Math.max(
            0,
            this.slides.length - this.getVisibleCount()
        );
    }

    createDots() {
        this.dotsContainer.innerHTML = "";

        const total = this.getMaxIndex() + 1;

        for (let i = 0; i < total; i++) {
            const dot = document.createElement("button");

            dot.type = "button";
            dot.className = "carousel__dot";
            dot.setAttribute(
                "aria-label",
                `Ir al grupo ${i + 1}`
            );

            dot.addEventListener("click", () => {
                this.index = i;
                this.update();
            });

            this.dotsContainer.appendChild(dot);
        }
    }

    update() {
        const maxIndex = this.getMaxIndex();
        const visibleCount = this.getVisibleCount();

        this.index = Math.max(
            0,
            Math.min(this.index, maxIndex)
        );

        const percentage = 100 / visibleCount;

        this.track.style.transform =
            `translateX(-${this.index * percentage}%)`;

        const dots = this.dotsContainer.querySelectorAll(
            ".carousel__dot"
        );

        dots.forEach((dot, index) => {
            dot.classList.toggle(
                "is-active",
                index === this.index
            );
        });

        this.prevButton.disabled = this.index === 0;
        this.nextButton.disabled = this.index === maxIndex;
    }
}


class Faq {
    constructor() {
        this.questions = document.querySelectorAll(
            ".faq__question"
        );

        this.init();
    }

    init() {
        this.questions.forEach(question => {
            question.addEventListener("click", () => {
                this.toggle(question);
            });
        });
    }

    toggle(question) {
        const isExpanded =
            question.getAttribute("aria-expanded") === "true";

        this.closeAll();

        if (!isExpanded) {
            const answer = document.getElementById(
                question.getAttribute("aria-controls")
            );

            if (!answer) return;

            question.setAttribute("aria-expanded", "true");
            answer.hidden = false;
        }
    }

    closeAll() {
        this.questions.forEach(question => {
            question.setAttribute("aria-expanded", "false");

            const answer = document.getElementById(
                question.getAttribute("aria-controls")
            );

            if (answer) {
                answer.hidden = true;
            }
        });
    }
}


class FormValidator {
    constructor(formId, messages, successId) {
        this.form = document.getElementById(formId);
        this.success = document.getElementById(successId);
        this.messages = messages;

        if (!this.form) return;

        this.init();
    }

    init() {
        this.form.addEventListener("submit", event => {
            event.preventDefault();

            this.clearErrors();

            if (this.success) {
                this.success.hidden = true;
            }

            const valid = this.validate();

            if (!valid) return;

            this.form.reset();

            if (this.success) {
                this.success.hidden = false;
            }
        });
    }

    validate() {
        let valid = true;

        Object.entries(this.messages).forEach(
            ([name, message]) => {

                const field = this.form.elements[name];

                if (!field) return;

                const value = field.value.trim();

                if (!value) {
                    this.showError(
                        field,
                        message
                    );

                    valid = false;
                    return;
                }

                if (
                    field.type === "email" &&
                    !this.isValidEmail(value)
                ) {
                    this.showError(
                        field,
                        message
                    );

                    valid = false;
                }
            }
        );

        return valid;
    }

    isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    showError(field, message) {
        const error = this.form.querySelector(
            `[data-error-for="${field.id}"]`
        );

        field.classList.add("is-invalid");

        if (error) {
            error.hidden = false;
            error.textContent = message;
        }
    }

    clearErrors() {
        this.form
            .querySelectorAll(".is-invalid")
            .forEach(field => {
                field.classList.remove("is-invalid");
            });

        this.form
            .querySelectorAll(".form__error")
            .forEach(error => {
                error.hidden = true;
                error.textContent = "";
            });
    }
}


class App {
    constructor() {
        this.init();
    }

    init() {
        new BookModal();

        new Carousel();

        new Faq();

        new FormValidator(
            "contact-form",
            {
                name: "Escribe tu nombre.",
                email: "Introduce un correo válido.",
                message: "Escribe un mensaje."
            },
            "contact-success"
        );

        new FormValidator(
            "request-form",
            {
                title: "Indica el título del libro.",
                author: "Indica el autor."
            },
            "request-success"
        );
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new App();
});
