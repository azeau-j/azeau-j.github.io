import { MangadexApi } from "./api/mangadex.js";

export class TagsForm {
    constructor(containerElement, visibilityButton) {
        this.containerElement = containerElement;
        this.visibilityButton = visibilityButton;
        this.tags = [];
        
        this.setVisibility(true);

        this.visibilityButton.addEventListener("click", () => {
            this.setVisibility(!this.isHidden);
        });
    }

    setVisibility(isHidden) {
        this.isHidden = isHidden;

        this.containerElement.style.display = this.isHidden ? "none" : "flex";
        this.visibilityButton.innerText = this.isHidden ? "Show" : "Hide";
    }

    async loadTags() {
        const mangadexTags = await MangadexApi.GetTags();

        for (let i in mangadexTags) {
            let tag = new Tag(mangadexTags[i]);

            this.containerElement.appendChild(tag.getElement());

            this.tags.push(tag);
        }
    }

    getTagsState() {
        let tagsState = {
            includeTags: [],
            excludeTags: []
        };

        for (let i in this.tags) {
            let tag = this.tags[i];
            
            if (tag.getValue() == 1) {
                tagsState.includeTags.push(tag.tag.id);
            } else if (tag.getValue() == 2) {
                tagsState.excludeTags.push(tag.tag.id);
            }
        }

        return tagsState;
    }
}

export class Tag {
    constructor(tag) {
        this.tag = tag;
    }

    getElement() {
        let input = document.createElement('div');
        input.className = "tag";

        this.icon = document.createElement('i');
        this.icon.className = "fa fa-circle";
        this.icon.setAttribute("aria-hidden", true);

        this.button = document.createElement('button');
        this.button.value = 0;
        this.button.appendChild(this.icon);
        this.button.addEventListener("click", () => {
            this.onClick();
        });

        let label = document.createElement('p');
        label.innerText = this.tag.name;

        input.appendChild(this.button);
        input.appendChild(label);

        return input;
    }

    getValue() {
        return this.button.value;
    }

    onClick() {
        let {button, icon} = this; 
        button.value = (button.value + 1) % 3

        if (button.value == 0) {
            icon.className = "fa fa-circle";
            icon.style.color = "#FFFFFF";
        } else if (button.value == 1) {
            icon.className = "fa fa-check-circle";
            icon.style.color = "#00FF00";
        } else if (button.value == 2) {
            icon.className = "fa fa-check-circle";
            icon.style.color = "#FF0000";
        }
    }
}