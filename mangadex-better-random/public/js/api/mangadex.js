export class MangadexApi {
    static PROXY_URL = "https://cors-anywhere.herokuapp.com/";
    static API_URL = "https://api.mangadex.org";

    static TAGS = [];

    static async GetTags() {
        if (this.TAGS.length != 0)
            return this.TAGS;

        let response = await fetch(`${this.PROXY_URL}${this.API_URL}/manga/tag`);
        let responseJson = await response.json();

        return responseJson.data.map((value) => {
            let tag = {
                id: value.id,
                name: value.attributes.name['en']
            };
            return tag;
        });
    }

    static async GetRandom(includeTags, excludeTags, contentRatings) {
        let randomParams = new URLSearchParams();
        randomParams.append("includes[]", "manga")
        randomParams.append("includes[]", "cover_art")
        randomParams.append("includes[]", "tag")

        for (let k in contentRatings) {
            randomParams.append("contentRating[]", contentRatings[k])
        }

        for (let k in includeTags) {
            randomParams.append("includedTags[]", includeTags[k].id);
        }

        for (let k in excludeTags) {
            randomParams.append("excludedTags[]", excludeTags[k].id);
        }

        let response = await fetch(`${this.PROXY_URL}${this.API_URL}/manga/random?${randomParams}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        });
        let responseJson = await response.json();
        return responseJson.data;
    }
}