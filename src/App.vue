<script setup lang="ts">
// import { computed, ref } from "vue";
import Recommendations from "./components/Recommendations.vue";
import Login from "./components/Login.vue";
import RecommendationsAuthorized from "./components/RecommendationsAuthorized.vue";
import Generes from "./components/Generes.vue";

const url = "https://graphql.anilist.co";

const urlFragment = window.location.hash.substring(1);
const urlParams = new URLSearchParams(urlFragment);
const accessToken = urlParams.get("access_token");
</script>

<template>
    <div>
        <!-- <Suspense> <a href="#/">Home</a> </Suspense> |
        <a href="#/login">Login</a>

        <component :is="currentView" /> -->
        <Login />

        <Suspense>
            <Generes :url="url" />
        </Suspense>

        <Suspense v-if="accessToken">
            <RecommendationsAuthorized
                v-if="accessToken"
                :url="url"
                :token="accessToken"
            />
        </Suspense>

        <Suspense v-else>
            <Recommendations :url="url" />
        </Suspense>
    </div>
</template>
