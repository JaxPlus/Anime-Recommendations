<script setup lang="ts">
import axios from "axios";
import type { QueryPageIndex, QueryRes } from "../types/types";
import { ref } from "vue";
import ButtonCom from "./ButtonCom.vue";
import LoadingSpiner from "./LoadingSpiner.vue";

const props = defineProps<{
    genres: string[];
    url: string;
}>();
let data = ref<QueryRes>();
let isData = ref(false);
let loading = ref(false);
let pageStart = ref<number>(1);
const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
};

async function findPage(genres: string[], url: string, pageIndex = 1) {
    const query = {
        operationName: "PageQuery",
        query: `
            query PageQuery($page: Int, $genres: [String]) {
                Page(page: $page, perPage: 30) {
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
            pageStart.value = pageIndex;
        }

        pageIndex++;
        findPage(genres, url, pageIndex);
    }
}

async function handleClick(genres: string[], url: string) {
    loading.value = true;

    const query = {
        operationName: "mediaQuery",
        query: `
            query mediaQuery($page: Int, $genres: [String]) {
                Page(page: $page, perPage: 30) {
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
        variables: { page: pageStart.value, genres: genres },
    };

    const response: QueryRes | void = await axios({
        url: url,
        method: "post",
        headers: headers,
        data: query,
    })
        .catch((err) => console.log(err))
        .finally(() => {
            loading.value = false;
        });

    if (response) {
        isData.value = true;
        data.value = response;
        pageStart.value += 1;
    }
}

if (pageStart.value === 1) {
    findPage(props.genres, props.url);
}
</script>

<template>
    <div>
        <LoadingSpiner :loading="loading" />
        <div class="divBtnStars">
            <ButtonCom
                variant="wStars"
                class="btnStars"
                @click="handleClick(props.genres, props.url)"
                >Daj mi anime!</ButtonCom
            >
        </div>

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

    <div v-if="isData" class="divBtnStars">
        <ButtonCom
            variant="notStars"
            class="btnStars"
            @click="handleClick(props.genres, props.url)"
            >Przejdz do następnej strony</ButtonCom
        >
    </div>
</template>

<style scoped>
.divBtnStars {
    display: flex;
    justify-content: center;
    justify-items: center;
    margin: 30px;
}

#mediaGrid {
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: repeat(15, calc(30rem + 160px));
}
.mediaItem {
    margin: 5px;
    background-color: #161616;
    display: flex;
    border-radius: 20px;
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
