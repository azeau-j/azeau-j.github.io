export class MangadexApi {
    static API_URL = "https://api.mangadex.org";

    static TAGS = [];

    static async GetTags() {
        if (this.TAGS.length != 0)
            return this.TAGS;

        console.log("Call API")
        let response = await fetch(`${this.API_URL}/manga/tag`);
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
        console.log(includeTags);
        console.log(excludeTags);
        console.log(contentRatings);

        let randomParams = new URLSearchParams();
        randomParams.append("includes[]", "manga")
        randomParams.append("includes[]", "cover_art")
        randomParams.append("includes[]", "tag")

        for (let k in contentRatings) {
            console.log(`Content Rating : ${contentRatings[k]}`)
            randomParams.append("contentRating[]", contentRatings[k])
        }

        for (let k in includeTags) {
            console.log(`Include : ${includeTags[k].name}`)
            randomParams.append("includedTags[]", includeTags[k].id);
        }

        for (let k in excludeTags) {
            console.log(`Exclude : ${excludeTags[k].name}`)
            randomParams.append("excludedTags[]", excludeTags[k].id);
        }

        console.log(`${this.API_URL}/manga/random?${randomParams}`)
        let response = await fetch(`${this.API_URL}/manga/random?${randomParams}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        });
        let responseJson = await response.json();
        return responseJson.data;
    }
}