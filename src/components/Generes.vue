<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";
import type { QueryRes } from "../types/types";
import Media from "./Media.vue";

const props = defineProps<{
    url: string;
}>();

const genres = [
    "Action",
    "Adventure",
    "Comedy",
    "Drama",
    "Ecchi",
    "Fantasy",
    "Horror",
    "Mahou Shoujo",
    "Mecha",
    "Music",
    "Mystery",
    "Psychological",
    "Romance",
    "Sci-Fi",
    "Slice of Life",
    "Sports",
    "Supernatural",
    "Thriller",
];
const selectedGenres = ref<string[]>([]);
const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
};

const queryMedia = ref({
    operationName: "mediaQuery",
    query: `query mediaQuery($page: Int, $genres: [String]) {
        Page(page: $page, perPage: 30) {
                media(genre_in: $genres, startDate_greater: 20040101, sort: START_DATE_DESC) {
                title {
                    english
                    romaji
                }
                description
                coverImage {
                    medium
                }
            }
        }
    }`,
    variables: { page: 1, genres: selectedGenres.value },
});

async function response() {
    const response: QueryRes | void = await axios({
        url: props.url,
        method: "post",
        headers: headers,
        data: queryMedia.value,
    }).catch((err) => console.log(err));

    if (response) {
        console.log(response.data.data.Page, selectedGenres.value);
        return response;
    }
}

function handleGenreSelection(genre: string) {
    if (selectedGenres.value.includes(genre)) {
        selectedGenres.value = selectedGenres.value.filter((g) => g !== genre);
    } else {
        selectedGenres.value.push(genre);
    }
}
</script>

<template>
    <div>
        <div class="genres-grid">
            <div class="genres" v-for="(genre, index) in genres" :key="index">
                <div class="checkbox-wrapper-12">
                    <div class="cbx">
                        <input
                            @change="
                                () => {
                                    handleGenreSelection(genre);
                                }
                            "
                            :id="`cbx-` + index"
                            type="checkbox"
                        />
                        <label :for="`cbx-` + index"
                            ><span class="genre-name">{{ genre }}</span></label
                        >
                        <svg
                            width="15"
                            height="14"
                            viewbox="0 0 15 14"
                            fill="none"
                        >
                            <path d="M2 8.36364L6.23077 12L13 2"></path>
                        </svg>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1"></svg>
                </div>
            </div>
        </div>
        <button @click="response()">Wyszukaj</button>

        <Media :genres="selectedGenres" :url="url" />
    </div>
</template>

<style scoped>
.genres {
    display: flex;
    margin: 10px;
    align-items: center;
    padding: 10px;
}

.genres-grid {
    display: grid;
    height: 50vh;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 10px;
}

.genre-name {
    margin: 40px;
}

.checkbox-wrapper-12 {
    position: relative;
}
.checkbox-wrapper-12 > svg {
    position: absolute;
    top: -130%;
    left: -170%;
    width: 110px;
    pointer-events: none;
}
.checkbox-wrapper-12 * {
    box-sizing: border-box;
}
.checkbox-wrapper-12 input[type="checkbox"] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    -webkit-tap-highlight-color: transparent;
    cursor: pointer;
    margin: 0;
}
.checkbox-wrapper-12 input[type="checkbox"]:focus {
    outline: 0;
}
.checkbox-wrapper-12 .cbx {
    width: 24px;
    height: 24px;
    top: calc(50vh - 12px);
    left: calc(50vw - 12px);
}
.checkbox-wrapper-12 .cbx input {
    position: absolute;
    top: 0;
    left: 0;
    width: 24px;
    height: 24px;
    border: 2px solid #bfbfc0;
    border-radius: 50%;
}
.checkbox-wrapper-12 .cbx label {
    width: 24px;
    height: 24px;
    text-wrap: nowrap;
    background: none;
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 0;
    -webkit-filter: url("#goo-12");
    filter: url("#goo-12");
    transform: trasnlate3d(0, 0, 0);
    pointer-events: none;
}
.checkbox-wrapper-12 .cbx svg {
    position: absolute;
    top: 5px;
    left: 4px;
    z-index: 1;
    pointer-events: none;
}
.checkbox-wrapper-12 .cbx svg path {
    stroke: #fff;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 19;
    stroke-dashoffset: 19;
    transition: stroke-dashoffset 0.3s ease;
    transition-delay: 0.2s;
}
.checkbox-wrapper-12 .cbx input:checked + label {
    animation: splash-12 0.6s ease forwards;
}
.checkbox-wrapper-12 .cbx input:checked + label + svg path {
    stroke-dashoffset: 0;
}
@-moz-keyframes splash-12 {
    40% {
        background: #866efb;
        box-shadow: 0 -18px 0 -8px #866efb, 16px -8px 0 -8px #866efb,
            16px 8px 0 -8px #866efb, 0 18px 0 -8px #866efb,
            -16px 8px 0 -8px #866efb, -16px -8px 0 -8px #866efb;
    }
    100% {
        background: #866efb;
        box-shadow: 0 -36px 0 -10px transparent, 32px -16px 0 -10px transparent,
            32px 16px 0 -10px transparent, 0 36px 0 -10px transparent,
            -32px 16px 0 -10px transparent, -32px -16px 0 -10px transparent;
    }
}
@-webkit-keyframes splash-12 {
    40% {
        background: #866efb;
        box-shadow: 0 -18px 0 -8px #866efb, 16px -8px 0 -8px #866efb,
            16px 8px 0 -8px #866efb, 0 18px 0 -8px #866efb,
            -16px 8px 0 -8px #866efb, -16px -8px 0 -8px #866efb;
    }
    100% {
        background: #866efb;
        box-shadow: 0 -36px 0 -10px transparent, 32px -16px 0 -10px transparent,
            32px 16px 0 -10px transparent, 0 36px 0 -10px transparent,
            -32px 16px 0 -10px transparent, -32px -16px 0 -10px transparent;
    }
}
@-o-keyframes splash-12 {
    40% {
        background: #866efb;
        box-shadow: 0 -18px 0 -8px #866efb, 16px -8px 0 -8px #866efb,
            16px 8px 0 -8px #866efb, 0 18px 0 -8px #866efb,
            -16px 8px 0 -8px #866efb, -16px -8px 0 -8px #866efb;
    }
    100% {
        background: #866efb;
        box-shadow: 0 -36px 0 -10px transparent, 32px -16px 0 -10px transparent,
            32px 16px 0 -10px transparent, 0 36px 0 -10px transparent,
            -32px 16px 0 -10px transparent, -32px -16px 0 -10px transparent;
    }
}
@keyframes splash-12 {
    40% {
        background: #866efb;
        box-shadow: 0 -18px 0 -8px #866efb, 16px -8px 0 -8px #866efb,
            16px 8px 0 -8px #866efb, 0 18px 0 -8px #866efb,
            -16px 8px 0 -8px #866efb, -16px -8px 0 -8px #866efb;
    }
    100% {
        background: #866efb;
        box-shadow: 0 -36px 0 -10px transparent, 32px -16px 0 -10px transparent,
            32px 16px 0 -10px transparent, 0 36px 0 -10px transparent,
            -32px 16px 0 -10px transparent, -32px -16px 0 -10px transparent;
    }
}
</style>
