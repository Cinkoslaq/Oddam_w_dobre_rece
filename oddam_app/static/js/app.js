document.addEventListener("DOMContentLoaded", function () {
    /**
     * HomePage - Help section
     */
    class Help {
        constructor($el) {
            this.$el = $el;
            this.$buttonsContainer = $el.querySelector(".help--buttons");
            this.$slidesContainers = $el.querySelectorAll(".help--slides");
            this.currentSlide = this.$buttonsContainer.querySelector(".active").parentElement.dataset.id;
            this.init();
        }

        init() {
            this.events();
        }

        events() {
            /**
             * Slide buttons
             */
            this.$buttonsContainer.addEventListener("click", e => {
                if (e.target.classList.contains("btn")) {
                    this.changeSlide(e);
                }
            });

            /**
             * Pagination buttons
             */
            this.$el.addEventListener("click", e => {
                if (e.target.classList.contains("btn") && e.target.parentElement.parentElement.classList.contains("help--slides-pagination")) {
                    this.changePage(e);
                }
            });
        }

        changeSlide(e) {
            e.preventDefault();
            const $btn = e.target;

            // Buttons Active class change
            [...this.$buttonsContainer.children].forEach(btn => btn.firstElementChild.classList.remove("active"));
            $btn.classList.add("active");

            // Current slide
            this.currentSlide = $btn.parentElement.dataset.id;

            // Slides active class change
            this.$slidesContainers.forEach(el => {
                el.classList.remove("active");

                if (el.dataset.id === this.currentSlide) {
                    el.classList.add("active");
                }
            });
        }

        /**
         * TODO: callback to page change event
         */
        changePage(e) {
            e.preventDefault();
            const page = e.target.dataset.page;

            console.log(page);
        }
    }

    const helpSection = document.querySelector(".help");
    if (helpSection !== null) {
        new Help(helpSection);
    }

    /**
     * Form Select
     */
    class FormSelect {
        constructor($el) {
            this.$el = $el;
            this.options = [...$el.children];
            this.init();
        }

        init() {
            this.createElements();
            this.addEvents();
            this.$el.parentElement.removeChild(this.$el);
        }

        createElements() {
            // Input for value
            this.valueInput = document.createElement("input");
            this.valueInput.type = "text";
            this.valueInput.name = this.$el.name;

            // Dropdown container
            this.dropdown = document.createElement("div");
            this.dropdown.classList.add("dropdown");

            // List container
            this.ul = document.createElement("ul");

            // All list options
            this.options.forEach((el, i) => {
                const li = document.createElement("li");
                li.dataset.value = el.value;
                li.innerText = el.innerText;

                if (i === 0) {
                    // First clickable option
                    this.current = document.createElement("div");
                    this.current.innerText = el.innerText;
                    this.dropdown.appendChild(this.current);
                    this.valueInput.value = el.value;
                    li.classList.add("selected");
                }

                this.ul.appendChild(li);
            });

            this.dropdown.appendChild(this.ul);
            this.dropdown.appendChild(this.valueInput);
            this.$el.parentElement.appendChild(this.dropdown);
        }

        addEvents() {
            this.dropdown.addEventListener("click", e => {
                const target = e.target;
                this.dropdown.classList.toggle("selecting");

                // Save new value only when clicked on li
                if (target.tagName === "LI") {
                    this.valueInput.value = target.dataset.value;
                    this.current.innerText = target.innerText;
                }
            });
        }
    }

    document.querySelectorAll(".form-group--dropdown select").forEach(el => {
        new FormSelect(el);
    });

    /**
     * Hide elements when clicked on document
     */
    document.addEventListener("click", function (e) {
        const target = e.target;
        const tagName = target.tagName;

        if (target.classList.contains("dropdown")) return false;

        if (tagName === "LI" && target.parentElement.parentElement.classList.contains("dropdown")) {
            return false;
        }

        if (tagName === "DIV" && target.parentElement.classList.contains("dropdown")) {
            return false;
        }

        document.querySelectorAll(".form-group--dropdown .dropdown").forEach(el => {
            el.classList.remove("selecting");
        });
    });

    /**
     * Switching between form steps
     */
    class FormSteps {
        constructor(form) {
            this.$form = form;
            this.$next = form.querySelectorAll(".next-step");
            this.$prev = form.querySelectorAll(".prev-step");
            this.$step = form.querySelector(".form--steps-counter span");
            this.currentStep = 1;

            this.$stepInstructions = form.querySelectorAll(".form--steps-instructions p");
            const $stepForms = form.querySelectorAll("form > div");
            this.slides = [...this.$stepInstructions, ...$stepForms];

            this.$categoryCheckboxes = form.querySelectorAll(".category-checkbox");
            this.$institutions = form.querySelectorAll(".institution");

            this.bags = form.querySelector("#bags");
            this.categories = form.querySelector("#categories");
            this.institutionType = form.querySelector("#institution-type");
            this.institutionName = form.querySelector("#institution-name");
            this.address = form.querySelector("#address");
            this.city = form.querySelector("#city");
            this.postcode = form.querySelector("#postcode");
            this.phone = form.querySelector("#phone");
            this.date = form.querySelector("#date");
            this.time = form.querySelector("#time");
            this.moreInfo = form.querySelector("#more-info");

            this.init();
        }

        /**
         * Init all methods
         */
        init() {
            this.events();
            this.updateForm();
        }

        /**
         * All events that are happening in form
         */
        events() {
            // Next step
            this.$next.forEach(btn => {
                btn.addEventListener("click", e => {
                    e.preventDefault();
                    if (this.formIsValid()) {
                        this.currentStep++;
                        this.updateForm();
                    }
                });
            });

            // Previous step
            this.$prev.forEach(btn => {
                btn.addEventListener("click", e => {
                    e.preventDefault();
                    this.currentStep--;
                    this.updateForm();
                });
            });

            this.$categoryCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('click', () => {
                    this.updateForm();
                });
            });

            // Form submit
            this.$form.querySelector("form").addEventListener("submit", e => this.submit(e));
        }

        /**
         * Update form front-end
         * Show next or previous section etc.
         */
        updateForm() {
            this.$step.innerText = this.currentStep;

            // TODO: Validation

            this.slides.forEach(slide => {
                slide.classList.remove("active");

                if (slide.dataset.step == this.currentStep) {
                    slide.classList.add("active");
                }
            });

            this.$stepInstructions[0].parentElement.parentElement.hidden = this.currentStep >= 6;
            this.$step.parentElement.hidden = this.currentStep >= 6;

            const selectedCategories = [];
            this.$categoryCheckboxes.forEach(checkbox => {
                if (checkbox.checked && !selectedCategories.includes(checkbox.value)) {
                    selectedCategories.push(checkbox.value);
                }
            });

            this.$institutions.forEach(institution => {
                const categoriesData = institution.getAttribute("data-categories");
                const categories = categoriesData.split(", ").map(category => category.trim());
                const allSelectedCategoriesExist = selectedCategories.every(category => categories.includes(category));
                if (!allSelectedCategoriesExist) {
                    institution.style.display = "none";
                } else {
                    institution.style.display = "block";
                }
            });

            const allInstitutionsHidden = [...this.$institutions].every(institution => institution.style.display === "none");

            if (allInstitutionsHidden) {
                const divElement = this.$form.querySelector('div[data-step="3"]');
                const h3Element = divElement.querySelector('h3');
                h3Element.innerText = "Niestety nie znaleźliśmy organizacji,\nktóra przyjmuje wszystkie te kategorie naraz.\n\n" +
                    "Spróbuj wybrać mniej kategorii, abyśmy mogli znaleźć\nodpowiednią organizację."
            } else {
                const divElement = this.$form.querySelector('div[data-step="3"]');
                const h3Element = divElement.querySelector('h3');
                h3Element.innerText = "Wybierz organizacje, której chcesz pomóc:"
            }

            // TODO: get data from inputs and show them in summary

            this.bags.innerText = parseInt(this.$form.querySelector('input[name="bags"]').value);

            const bagsContents = [];
            const contents = this.$form.querySelectorAll(".description-category");
            contents.forEach((content) => {
                if (content.parentElement.firstElementChild.checked) {
                    bagsContents.push(content.innerText.toLowerCase());
                }
            })
            this.categories.innerText = bagsContents.join(', ');

            const institutionsInfo = this.$form.querySelectorAll(".title[data-type]");
            institutionsInfo.forEach((institutionInfo) => {
                if (institutionInfo.parentElement.parentElement.firstElementChild.checked) {
                    const dataType = institutionInfo.getAttribute('data-type');
                    if (dataType === '0') {
                        this.institutionType.innerText = 'fundacji';
                    } else if (dataType === '1') {
                        this.institutionType.innerText = 'organizacji pozarządowej';
                    } else {
                        this.institutionType.innerText = 'zbiórki lokalnej';
                    }
                    this.institutionName.innerText = institutionInfo.innerText;
                }
            });

            this.address.innerText = this.$form.querySelector('input[name="address"]').value;
            this.city.innerText = this.$form.querySelector('input[name="city"]').value;
            this.postcode.innerText = this.$form.querySelector('input[name="postcode"]').value;
            this.phone.innerText = this.$form.querySelector('input[name="phone"]').value;
            this.date.innerText = this.$form.querySelector('input[name="data"]').value;
            this.time.innerText = this.$form.querySelector('input[name="time"]').value;
            this.moreInfo.innerText = this.$form.querySelector('[name="more_info"]').value;
            console.log(this.$form.querySelector('[name="more_info"]').value)
        }

        /**
         * Submit form
         *
         * TODO: validation, send data to server
         */
        formIsValid() {
            switch (this.currentStep) {
                case 1:
                    return Array.from(this.$categoryCheckboxes).some(checkbox => checkbox.checked);
                case 2:
                    const bagsInput = this.$form.querySelector('input[name="bags"]');
                    return (bagsInput && bagsInput.value > 0);
                case 3:
                    return document.querySelector('input[name="organization"]:checked');
                case 4:
                    const address = this.$form.querySelector('input[name="address"]').value;
                    const city = this.$form.querySelector('input[name="city"]').value;
                    const postcode = this.$form.querySelector('input[name="postcode"]').value;
                    const phone = this.$form.querySelector('input[name="phone"]').value;
                    const date = this.$form.querySelector('input[name="data"]').value;
                    const time = this.$form.querySelector('input[name="time"]').value;
                    return (address && city && postcode && phone && date && time)
            }
        }

        submit(e) {
            e.preventDefault();
            const addDonationForm = this.$form.querySelector("form");
            addDonationForm.submit();
        }
    }

    const form = document.querySelector(".form--steps");
    if (form !== null) {
        new FormSteps(form);
    }
});