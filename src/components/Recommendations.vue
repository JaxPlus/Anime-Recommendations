<script async setup lang="ts">
import axios from "axios";
import { ref } from "vue";
import { QueryAnimeName, QueryRecommendation, ErrorType } from "../types/types";
import ButtonCom from "./ButtonCom.vue";
import LoadingSpiner from "./LoadingSpiner.vue";
import Error from "./Error.vue";

const props = defineProps<{
    url: string;
}>();

const animeName = ref("");
const animeId = ref(0);
const page = ref(0);
const loading = ref(false);
const data = ref<QueryRecommendation>();
const error = ref<ErrorType>({
    isErrorPresent: false,
    errorMessage: "",
});

const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
};

function handleError(err: any) {
    error.value.isErrorPresent = true;

    switch (err.response.status) {
        case 404:
            error.value.errorMessage =
                "Nie znaleziono takiego anime. Proszę wpisać dokładną nazwę tego czego szukasz.";
            break;
        case 500:
            error.value.errorMessage =
                "Błąd po stronie serwera. Proszę spróbować za chwilę.";
            break;
        default:
            break;
    }
}

async function findId(e: Event) {
    e.preventDefault();

    if (animeName.value === "") {
        error.value.isErrorPresent = true;
        error.value.errorMessage = "Proszę wpisać nazwę szukanego anime.";
        return;
    }

    loading.value = true;

    const nameQuery = {
        operationName: "nameQuery",
        query: `
        query nameQuery($animeNameVar: String) {
            Media(search: $animeNameVar) {
                id
                title  {
                    english
                    romaji
                }
            }
        } `,
        variables: {
            animeNameVar: animeName.value,
        },
    };

    const response: QueryAnimeName | void = await axios({
        url: props.url,
        method: "post",
        headers: headers,
        data: nameQuery,
    }).catch((err) => {
        handleError(err);
    });

    if (response && !error.value.isErrorPresent) {
        animeId.value = response.data.data.Media.id;
        await requestRec(animeId.value, props.url);
    } else {
        loading.value = false;
    }
}

async function requestRec(mediaId: number, url: string, pageIndex = 1) {
    const query = {
        operationName: "PageQuery",
        query: `
            query PageQuery($page: Int, $mediaId: Int) {
                Page(page: $page, perPage: 30) {
                    recommendations(mediaId: $mediaId) {
                        mediaRecommendation {
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
                }
            }
        `,
        variables: { page: pageIndex, mediaId: mediaId },
    };

    const response: QueryRecommendation | void = await axios({
        url: url,
        method: "post",
        headers: headers,
        data: query,
    }).catch((err) => handleError(err));

    loading.value = false;

    if (response) {
        if (response.data.data.Page.recommendations.length !== 0) {
            data.value = response;
        } else {
            error.value.isErrorPresent = true;
            error.value.errorMessage =
                "Nie znaleziono żadnych anime z takim tytułem, proszę wpisać inny bądź bajdziej dokładny tytuł.";
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

        <form @submit="(e) => findId(e)">
            <input
                type="search"
                class="input"
                v-model="animeName"
                name="animeName"
                placeholder="Nazwa anime..."
            />
            <ButtonCom variant="wStars" type="submit"
                >Wyszukaj mi rekomendacje!</ButtonCom
            >
        </form>

        <div v-if="data" id="cards">
            <div
                v-for="recommendation in data.data.data.Page.recommendations"
                class="recommendation"
            >
                <div class="imgTitle">
                    <img
                        :src="
                            recommendation.mediaRecommendation.coverImage.medium
                        "
                        :alt="animeName"
                    />
                    <h3>
                        {{
                            recommendation.mediaRecommendation.title.english !=
                            ""
                                ? recommendation.mediaRecommendation.title
                                      .romaji
                                : recommendation.mediaRecommendation.title
                                      .english
                        }}
                    </h3>
                </div>
                <p v-html="recommendation.mediaRecommendation.description"></p>
            </div>
        </div>

        <div id="btnContainer">
            <ButtonCom
                v-if="data"
                variant="notStars"
                @click="
                    () => {
                        page++;
                        requestRec(animeId, props.url, page);
                    }
                "
                >Przejdź do następnej strony</ButtonCom
            >
        </div>
    </div>
</template>

<style scoped>
.input {
    --color: #866efb;
    --color-shadow: #715dd4;
    max-width: 450px;
    background-color: #f5f5f533;
    padding: 0.15rem 0.5rem;
    min-height: 40px;
    border-radius: 4px;
    outline: none;
    border: none;
    line-height: 1.15;
    box-shadow: 0px 10px 20px -18px var(--color-shadow);
}

input:focus {
    border-bottom: 2px solid var(--color);
    border-radius: 4px 4px 2px 2px;
}

input:hover {
    outline: 1px solid lightgrey;
}

#cards {
    display: grid;
    grid-template-columns: auto auto;
    margin: 5px;
}

.recommendation {
    margin: 10px;
    background-color: #161616;
    border-radius: 20px;
}

.recommendation > * {
    margin: 15px;
}

.imgTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

h3 {
    text-align: right;
}

form {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px;
}

button {
    margin-top: 20px;
}

#btnContainer {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
