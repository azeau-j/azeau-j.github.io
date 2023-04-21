export class ContentRatingsForm {
    constructor(containerElement, visibilityButton) {
        this.containerElement = containerElement;
        this.visibilityButton = visibilityButton;
        this.contentRatings = [];

        this.setVisibility(false);

        this.visibilityButton.addEventListener("click", () => {
            this.setVisibility(!this.isHidden);
        });
    }

    setVisibility(isHidden) {
        this.isHidden = isHidden;

        this.containerElement.style.display = this.isHidden ? "none" : "flex";
        this.visibilityButton.innerText = this.isHidden ? "Show" : "Hide";
    }

    async loadContentRatings() {
        const mangadexContentRatings = [
            "safe",
            "suggestive",
            "erotica",
            "pornographic"
        ];

        for (let i in mangadexContentRatings) {
            let contentRating = new ContentRating(
                mangadexContentRatings[i],
                mangadexContentRatings[i] === "safe" ? 1 : 0
            );

            this.containerElement.appendChild(contentRating.getElement());

            this.contentRatings.push(contentRating);
        }
    }

    getContentRatingsState() {
        let contentRatingsState = {
            includeContentRatings: []
        };

        for (let i in this.contentRatings) {
            let contentRating = this.contentRatings[i];
            
            if (contentRating.getValue() == 1) {
                contentRatingsState.includeContentRatings.push(contentRating.contentRating);
            }
        }

        return contentRatingsState;
    }
}

export class ContentRating {
    constructor(contentRating, defaultValue = 0) {
        this.contentRating = contentRating;
        this.defaultValue = defaultValue;
    }

    getElement() {
        let input = document.createElement('div');
        input.className = "tag";

        this.icon = document.createElement('i');
        this.icon.className = "fa fa-circle";
        this.icon.setAttribute("aria-hidden", true);

        this.button = document.createElement('button');
        this.button.value = this.defaultValue;
        this.button.appendChild(this.icon);
        this.button.addEventListener("click", () => {
            this.onClick();
        });

        this.setIcon(this.defaultValue);

        let label = document.createElement('p');
        label.innerText = this.contentRating;

        input.appendChild(this.button);
        input.appendChild(label);

        return input;
    }

    getValue() {
        return this.button.value;
    }

    onClick() {
        let {button, icon} = this;
        button.value = (parseInt(button.value) + 1) % 2

        this.setIcon(button.value);
    }

    setIcon(value) {
        let {icon} = this;

        if (value == 0) {
            icon.className = "fa fa-circle";
            icon.style.color = "#FFFFFF";
        } else if (value == 1) {
            icon.className = "fa fa-check-circle";
            icon.style.color = "#00FF00";
        }
    }
}