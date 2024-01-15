<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";
import type { QueryRes, ErrorType } from "../types/types";
import ButtonCom from "./ButtonCom.vue";
import LoadingSpiner from "./LoadingSpiner.vue";
import Error from "./Error.vue";

const props = defineProps<{
    genres: string[];
    url: string;
}>();

const data = ref<QueryRes>();
const isData = ref(false);
const loading = ref(false);
const pageStart = ref(1);
const error = ref<ErrorType>({
    isErrorPresent: false,
    errorMessage: "",
});

const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
};

async function handleClick(genres: string[], url: string) {
    if (genres.length === 0) {
        error.value.isErrorPresent = true;
        error.value.errorMessage =
            "Proszę wybrać przynajmniej jedną kategorię anime.";
        return;
    }

    loading.value = true;

    const date = new Date();

    date.setDate(date.getDate() + 90);

    const monthWithZero =
        date.getMonth() <= 9 ? "0" + date.getMonth() : date.getMonth();
    const dayOfMonthWithZero =
        date.getDate() <= 9 ? "0" + date.getDate() : date.getDate();

    const dateString =
        date.getFullYear().toLocaleString() +
        monthWithZero +
        dayOfMonthWithZero;

    const query = {
        operationName: "mediaQuery",
        query: `
            query mediaQuery($page: Int, $genres: [String]) {
                Page(page: $page, perPage: 30) {
                    media(genre_in: $genres, startDate_lesser: ${dateString}, sort: START_DATE_DESC, type: ANIME, countryOfOrigin: JP) {
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
        .catch((err) => {
            error.value.isErrorPresent = true;

            switch (err.response.status) {
                case 500:
                    error.value.errorMessage =
                        "Błąd po stronie serwera. Proszę spróbować za chwilę.";
                    break;
                default:
                    break;
            }
        })
        .finally(() => {
            loading.value = false;
        });

    if (response) {
        if (response.data.data.Page.media.length !== 0) {
            isData.value = true;
            data.value = response;
        } else {
            error.value.isErrorPresent = true;
            error.value.errorMessage =
                "Nie znaleziono następnych anime z takimi gatunkami.";
        }
    }
}
</script>

<template>
    <div>
        <LoadingSpiner :loading="loading" />
        <Error v-if="error.isErrorPresent" :error="error">{{
            error.errorMessage
        }}</Error>

        <div class="divBtnStars">
            <ButtonCom
                v-if="!isData"
                variant="wStars"
                class="btnStars"
                @click="handleClick(props.genres, props.url)"
            >
                Daj mi anime!
            </ButtonCom>
            <ButtonCom
                v-else
                variant="wStars"
                class="btnStars"
                @click="
                    () => {
                        pageStart++;
                        handleClick(props.genres, props.url);
                    }
                "
            >
                Przejdź do następnej strony
            </ButtonCom>
        </div>

        <div v-if="data" id="mediaGrid">
            <div class="mediaItem" v-for="media in data.data.data.Page.media">
                <div class="imgTitle">
                    <img :src="media.coverImage.medium" alt="Anime Poster" />
                    <h3>
                        {{
                            media.title.english != ""
                                ? media.title.romaji
                                : media.title.english
                        }}
                    </h3>
                </div>
                <p v-html="media.description"></p>
            </div>
        </div>
    </div>

    <div v-if="isData" class="divBtnStars">
        <ButtonCom
            variant="notStars"
            class="btnStars"
            @click="
                () => {
                    if (pageStart > 1) {
                        pageStart--;
                        handleClick(props.genres, props.url);
                    }
                }
            "
            >Przejdz do poprzedniej strony</ButtonCom
        >

        <ButtonCom
            variant="notStars"
            class="btnStars"
            @click="
                () => {
                    pageStart++;
                    handleClick(props.genres, props.url);
                }
            "
            >Przejdź do następnej strony</ButtonCom
        >
    </div>
</template>

<style scoped>
.divBtnStars {
    display: flex;
    justify-content: space-around;
    justify-items: center;
    margin: 30px;
}

#mediaGrid {
    display: grid;
    margin: 5px;
    grid-template-columns: auto auto;
}
.mediaItem {
    margin: 10px;
    background-color: #161616;
    border-radius: 20px;
}

.imgTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.mediaItem > * {
    margin: 15px;
}
</style>
