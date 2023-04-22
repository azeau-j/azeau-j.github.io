import { TagsForm } from './tags.js'
import { MangadexApi } from "./api/mangadex.js";
import { ContentRatingsForm } from './contentRatings.js';
import { Manga } from './manga.js';
 
document.addEventListener('DOMContentLoaded', () => {
    main().then(() => {
        console.log("Page Loaded");
    }).catch(err => {
        console.error(err);
    });
});

async function main() {
    let tagsForm = new TagsForm(
        document.getElementById("tags-container"),
        document.getElementById("tags-button-visibility")
    );
    tagsForm.loadTags().then(() => {
        console.log("Tag loaded !");
    }).catch(err => {
        console.error(err);
    });

    let contentRatingsForm = new ContentRatingsForm(
        document.getElementById("content-ratings-container"),
        document.getElementById("content-ratings-button-visibility")
    );
    contentRatingsForm.loadContentRatings().then(() => {
        console.log("Content Ratings loaded !");
    }).catch(err => {
        console.error(err);
    });

    let mangaElement = new Manga();
    mangaElement.reset();

    let randomButton = document.getElementById("random-button")
    randomButton.addEventListener("click", () => {
        getNewRandomManga(mangaElement, tagsForm, contentRatingsForm);
    });
}

function getNewRandomManga(mangaElement, tagsForm, contentRatingsForm) {
    let tags = tagsForm.getTagsState();
    let contentRatings = contentRatingsForm.getContentRatingsState();

    if (contentRatings.includeContentRatings.length <= 0) {
        alert("You must choose at least one rating !");
        return;
    }

    mangaElement.reset();
    MangadexApi.GetRandom(tags.includeTags, tags.excludeTags, contentRatings.includeContentRatings).then(manga => {
        saveMangaInLocalStorage(manga);
        mangaElement.setManga(manga);
    });
}

function saveMangaInLocalStorage(manga) {
    if (window.localStorage.getItem("previous_random_manga") === null) {
        window.localStorage.setItem("previous_random_manga", JSON.stringify([{
            link: manga.id,
            name: manga.attributes.title['en']
        }]));
    } else {
        let storedManga = JSON.parse(window.localStorage.getItem("previous_random_manga"));
        window.localStorage.setItem("previous_random_manga", JSON.stringify([
            ...storedManga,
            {
                link: `https://mangadex.org/title/${manga.id}`,
                name: manga.attributes.title['en']
            }
        ]));
    }
}