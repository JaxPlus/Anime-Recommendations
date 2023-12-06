<script setup lang="ts">
import axios from "axios";
import type { QueryPageIndex, QueryRes } from "../types/types";
import { ref } from "vue";

const props = defineProps<{
    genres: string[];
    url: string;
}>();
let data = ref<QueryRes>();
const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
};

async function findPage(genres: string[], url: string, pageIndex = 1) {
    const query = {
        operationName: "PageQuery",
        query: `
            query PageQuery($page: Int, $genres: [String]) {
                Page(page: $page) {
                    media(genre_in: $genres, startDate_lesser: 20231231, sort: START_DATE_DESC, type: ANIME) {
                        seasonYear
                    }
                }
            }
        `,
        variables: { page: pageIndex, genres: genres },
    };

    const response: QueryPageIndex | void = await axios({
        url: url,
        method: "post",
        headers: headers,
        data: query,
    }).catch((err) => console.log(err));

    let foundValidSeasonYear = false;

    if (response) {
        response.data.data.Page.media.forEach((media) => {
            if (
                !(
                    typeof media.seasonYear === "undefined" ||
                    media.seasonYear === null
                )
            ) {
                foundValidSeasonYear = true;
                return;
            }
        });

        if (foundValidSeasonYear) {
            return pageIndex;
        }

        pageIndex++;
        findPage(genres, url, pageIndex);
    }
}

async function handleClick(genres: string[], url: string) {
    const pageIndex = await findPage(genres, url);

    const query = {
        operationName: "mediaQuery",
        query: `
            query mediaQuery($page: Int, $genres: [String]) {
                Page(page: $page) {
                    media(genre_in: $genres, startDate_lesser: 20231231, sort: START_DATE_DESC, type: ANIME) {
                        title {
                            english
                            romaji
                        }
                        description
                        coverImage {
                            medium
                        }
                        genres
                    }
                }
            }`,
        variables: { page: pageIndex, genres: genres },
    };

    const response: QueryRes | void = await axios({
        url: url,
        method: "post",
        headers: headers,
        data: query,
    }).catch((err) => console.log(err));

    if (response) {
        data.value = response;
    }
}
</script>

<template>
    <div>
        <button @click="handleClick(props.genres, props.url)">Dawaj</button>

        <div v-if="data" id="mediaGrid">
            <div class="mediaItem" v-for="media in data.data.data.Page.media">
                <h3>
                    {{
                        media.title.english != ""
                            ? media.title.romaji
                            : media.title.english
                    }}
                </h3>
                <p v-html="media.description"></p>
                <div>
                    <img :src="media.coverImage.medium" alt="Anime Poster" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
#mediaGrid {
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: repeat(25, calc(30rem + 160px));
}
.mediaItem {
    margin: 5px;
    background-color: #161616;
    display: flex;
    flex-direction: column;
    position: relative;
}

.mediaItem h3,
p {
    padding: 10px;
}

.mediaItem img {
    position: absolute;
    width: fit-content;
    height: fit-content;
    right: 0px;
    bottom: 0px;
    margin: 10px;
}
</style>
