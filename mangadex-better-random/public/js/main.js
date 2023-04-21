import { TagsForm } from './tags.js'
import { MangadexApi } from "./api/mangadex.js";
 
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

    console.log(await MangadexApi.GetTags());
}