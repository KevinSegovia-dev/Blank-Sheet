(function () {

    "use strict";

    document.addEventListener("DOMContentLoaded", function () {

        initCatalogButtons();

        initCarousel();

        initFaq();

        initForm("contact-form", {
            name: "Escribe tu nombre.",
            email: "Introduce un correo válido.",
            message: "Escribe un mensaje."
        }, "contact-success");

        initForm("request-form", {
            title: "Indica el título del libro.",
            author: "Indica el autor."
        }, "request-success");
    });

    function initCatalogButtons() {

        var buttons = document.querySelectorAll(".card__button, .card__button--carrusel");
        var modal = document.getElementById("book-modal");
        var modalImage = document.getElementById("modal-image");
        var modalTitle = document.getElementById("modal-title");
        var modalAuthor = document.getElementById("modal-author");
        var modalDescription = document.getElementById("modal-description");
        var modalPrice = document.getElementById("modal-price");
        var closeButton = modal ? modal.querySelector("[data-modal-close]") : null;
        var requestLink = modal ? modal.querySelector(".modal__button") : null;


        if (!modal) {
            return;
        }

        function closeModal() {
            modal.hidden = true;
            document.body.style.overflow = "";
        }

        buttons.forEach(function (button) {

            button.addEventListener("click", function () {

                var card = button.closest(".card");

                if (!card) {
                    return;
                }

                var image = card.querySelector(".card__image");
                var title = card.querySelector(".card__title");
                var author = card.querySelector(".card__author");
                var description = card.querySelector(".card__description");
                var price = card.querySelector(".card__price");

                if (modalImage && image) {
                    modalImage.src = image.src;
                    modalImage.alt = image.alt;
                }

                if (modalTitle && title) {
                    modalTitle.textContent = title.textContent.trim();
                }

                if (modalAuthor && author) {
                    modalAuthor.textContent = author.textContent.trim();
                }

                if (modalDescription && description) {
                    modalDescription.textContent = description.textContent.trim();
                }

                if (modalPrice && price) {
                    modalPrice.textContent = price.textContent.trim();
                }

                modal.hidden = false;
                document.body.style.overflow = "hidden";
            });
        });

        if (closeButton) {
            closeButton.addEventListener("click", closeModal);
        }
        if (requestLink) {
            requestLink.addEventListener("click", closeModal);
        }

        modal.addEventListener("click", function (event) {

            if (event.target === modal) {
                closeModal();
            }
        });

        document.addEventListener("keydown", function (event) {

            if (event.key === "Escape" && !modal.hidden) {
                closeModal();
            }
        });
    }

    function visibleCount() {

        if (window.matchMedia("(min-width: 960px)").matches) {
            return 3;
        }

        if (window.matchMedia("(min-width: 640px)").matches) {
            return 2;
        }

        return 1;
    }

    function initCarousel() {

        var root = document.querySelector("[data-carousel]");

        if (!root) {
            return;
        }

        var track = root.querySelector("[data-carousel-track]");
        var prev = root.querySelector("[data-carousel-prev]");
        var next = root.querySelector("[data-carousel-next]");
        var dotsRoot = root.querySelector("[data-carousel-dots]");
        var slides = Array.prototype.slice.call(track.children);
        var index = 0;

        function maxIndex() {
            return Math.max(0, slides.length - visibleCount());
        }

        function renderDots() {

            dotsRoot.innerHTML = "";

            var total = maxIndex() + 1;

            for (var i = 0; i < total; i += 1) {

                var dot = document.createElement("button");

                dot.type = "button";
                dot.className = "carousel__dot";
                dot.setAttribute("aria-label", "Ir al grupo " + (i + 1));

                dot.addEventListener("click", function (page) {

                    return function () {
                        index = page;
                        update();
                    };

                }(i));

                dotsRoot.appendChild(dot);
            }
        }

        function update() {

            var max = maxIndex();

            if (index > max) {
                index = max;
            }

            if (index < 0) {
                index = 0;
            }

            var percent = 100 / visibleCount();

            track.style.transform = "translateX(-" + index * percent + "%)";

            var dots = dotsRoot.querySelectorAll(".carousel__dot");

            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === index);
            });

            prev.disabled = index === 0;
            next.disabled = index === max;
        }

        prev.addEventListener("click", function () {
            index -= 1;
            update();
        });

        next.addEventListener("click", function () {
            index += 1;
            update();
        });

        window.addEventListener("resize", function () {
            renderDots();
            update();
        });

        renderDots();
        update();
    }

    function initFaq() {

        var questions = document.querySelectorAll(".faq__question");

        questions.forEach(function (button) {

            button.addEventListener("click", function () {

                var expanded = button.getAttribute("aria-expanded") === "true";

                var answer = document.getElementById(
                    button.getAttribute("aria-controls")
                );

                questions.forEach(function (other) {

                    other.setAttribute("aria-expanded", "false");

                    var otherAnswer = document.getElementById(
                        other.getAttribute("aria-controls")
                    );

                    if (otherAnswer) {
                        otherAnswer.hidden = true;
                    }
                });

                if (!expanded && answer) {

                    button.setAttribute("aria-expanded", "true");

                    answer.hidden = false;
                }
            });
        });
    }

    function isValidEmail(value) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function showError(form, name, message) {

        var field = form.elements[name];

        var error = form.querySelector(
            '[data-error-for="' + field.id + '"]'
        );

        field.classList.add("is-invalid");

        if (error) {

            error.hidden = false;

            error.textContent = message;
        }
    }

    function clearErrors(form) {

        Array.prototype.forEach.call(
            form.elements,
            function (field) {

                if (field.classList) {

                    field.classList.remove("is-invalid");
                }
            }
        );

        form.querySelectorAll(".form__error").forEach(
            function (error) {

                error.hidden = true;

                error.textContent = "";
            }
        );
    }

    function initForm(formId, messages, successId) {

        var form = document.getElementById(formId);

        var success = document.getElementById(successId);

        if (!form) {
            return;
        }

        form.addEventListener("submit", function (event) {

            event.preventDefault();

            clearErrors(form);

            if (success) {
                success.hidden = true;
            }

            var valid = true;

            Object.keys(messages).forEach(function (name) {

                var field = form.elements[name];

                if (!field) {
                    return;
                }

                var value = field.value.trim();

                if (!value) {

                    showError(
                        form,
                        name,
                        messages[name]
                    );

                    valid = false;

                    return;
                }

                if (
                    field.type === "email" &&
                    !isValidEmail(value)
                ) {

                    showError(
                        form,
                        name,
                        messages[name]
                    );

                    valid = false;
                }
            });

            if (!valid) {
                return;
            }

            form.reset();

            if (success) {
                success.hidden = false;
            }
        });
    }

})();