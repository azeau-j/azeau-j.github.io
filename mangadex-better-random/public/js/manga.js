export class Manga {
    MANGA_LINK_ID = "manga-card";
    MANGA_TITLE_ID = "manga-title";
    MANGA_SYNOPSIS_ID = "manga-synopsis";
    MANGA_TAGS_ID = "manga-tags";
    MANGA_COVER_ID = "manga-cover";
    
    constructor() {
        this.mangaLinkElement = document.getElementById(this.MANGA_LINK_ID);
        this.mangaTitleELement = document.getElementById(this.MANGA_TITLE_ID);
        this.mangaSynopsisElement = document.getElementById(this.MANGA_SYNOPSIS_ID);
        this.mangaTagsElement = document.getElementById(this.MANGA_TAGS_ID);
        this.mangaCoverElement = document.getElementById(this.MANGA_COVER_ID);
    }

    reset() {
        this.mangaLinkElement.href = "#";
        this.mangaTitleELement.innerText = "";
        this.mangaSynopsisElement.innerText = "";

        this.mangaCoverElement.src = "./public/img/loading_page.jpg";
        this.mangaCoverElement.alt = "Loading page";

        while (this.mangaTagsElement.firstChild) {
            this.mangaTagsElement.removeChild(this.mangaTagsElement.lastChild);
        }
    }

    setManga(manga) {
        this.mangaLinkElement.href = `https://mangadex.org/title/${manga.id}`;

        this.mangaTitleELement.innerText = manga.attributes.title['en'];

        if (Object.keys(manga.attributes.description).length === 0 || !manga.attributes.description['en']) {
            this.mangaSynopsisElement.innerText = "There is no synopsis for this manga !";
        } else {
            this.mangaSynopsisElement.innerText = manga.attributes.description['en'];
        }

        this.getCover(manga).then(cover => {
            this.mangaCoverElement.src = URL.createObjectURL(cover);
        });

        this.mangaCoverElement.alt = `Cover of ${manga.attributes.title['en']}`;

        for (let i in manga.attributes.tags) {
            let tagElement = document.createElement('p');
            tagElement.className = "manga-tag";
            tagElement.innerText = manga.attributes.tags[i].attributes.name['en'];
            this.mangaTagsElement.appendChild(tagElement);
        }
    }

    getCoverUrl(manga) {
        let art = manga.relationships.find(relation => relation.type === "cover_art");

        if (!art)
            return "./public/img/loading_page.jpg";

        let coverFilename = art.attributes['fileName'];
        fetch(`https://cors-anywhere.herokuapp.com/https://uploads.mangadex.org/covers/${manga.id}/${coverFilename}`).then(res => console.log(res))
        return `https://cors-anywhere.herokuapp.com/https://uploads.mangadex.org/covers/${manga.id}/${coverFilename}`
    }

    async getCover(manga) {
        let art = manga.relationships.find(relation => relation.type === "cover_art");

        if (!art)
            return "./public/img/loading_page.jpg";

        let coverFilename = art.attributes['fileName'];
        let coverResponse = await fetch(`https://uploads.mangadex.org/covers/${manga.id}/${coverFilename}`);
        
        return coverResponse.blob();
     }
}