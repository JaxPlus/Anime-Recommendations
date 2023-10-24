<script async setup lang="ts">
import axios from "axios";

const props = defineProps<{
    url: string;
}>();

const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
};
const query = {
    operationName: "Recommendations",
    query: `
        query Recommendations {
            Page {
                recommendations {
                    media {
                        coverImage {
                            medium
                        }
                        title {
                            english
                            romaji
                        }
                        genres
                        description
                    }
                    mediaRecommendation {
                        coverImage {
                            medium
                        }
                        title {
                            english
                            romaji
                        }
                        genres
                        description
                    }
                }
            }
        }`,
    variables: {},
};

type QueryRes = {
    data: {
        data: {
            Page: {
                recommendations: Array<{
                    media: {
                        coverImage: {
                            medium: string;
                        };
                        genres: Array<string>;
                        title: {
                            english: string;
                            romaji: string;
                        };
                        description: string;
                    };
                    mediaRecommendation: {
                        genres: Array<string>;
                        coverImage: {
                            medium: string;
                        };
                        title: {
                            english: string;
                            romaji: string;
                        };
                        description: string;
                    };
                }>;
            };
        };
    };
};

async function response() {
    const response: QueryRes | void = await axios({
        url: props.url,
        method: "post",
        headers: headers,
        data: query,
    }).catch((err) => console.log(err));

    if (response) {
        return response;
    }
}

const data = await response();
</script>

<template>
    <div>
        <h1>To będzie rekomendacja anime czy cuś</h1>

        <div id="cards">
            <div
                class="twoItems"
                v-for="item in data?.data.data.Page.recommendations"
            >
                <div class="item">
                    <img
                        :src="item.media.coverImage.medium"
                        :alt="item.media.title.english"
                    />
                    <h2>{{ item.media.title.english }}</h2>
                    <div>
                        <p v-for="genres in item.media.genres">
                            {{ genres + ", " }}
                        </p>
                    </div>
                </div>

                <div class="item">
                    <img
                        :src="item.mediaRecommendation.coverImage.medium"
                        :alt="item.mediaRecommendation.title.english"
                    />
                    <h2>{{ item.mediaRecommendation.title.english }}</h2>
                    <div>
                        <p v-for="genres in item.mediaRecommendation.genres">
                            {{ genres + ", " }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
#cards {
    margin: auto;
    width: 90vw;
    display: grid;
    grid-template-columns: auto auto;
}

.twoItems {
    border: 1px green solid;
    margin: 5px;
}

.item {
    display: grid;
    grid-template-areas:
        "coverImage title title"
        "coverImage description description"
        "coverImage generes generes";
    grid-template-columns: 140px auto;
}

.item > img {
    grid-area: coverImage;
}

.item > h2 {
    grid-area: title;
    text-align: center;
}

.item > p {
    grid-area: generes;
}

img {
    margin: 15px;
}
</style>
