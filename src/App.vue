<script setup lang="ts">
import { computed, ref } from "vue";
import Recommendations from "./components/Recommendations.vue";
import Login from "./components/Login.vue";
// import RecommendationsAuthorized from "./components/RecommendationsAuthorized.vue";
import Generes from "./components/Generes.vue";

const routes: Record<string, any> = {
    "/": Login,
    "/media": Generes,
    "/recommendations": Recommendations,
};

const currentPath = ref(window.location.hash);

window.addEventListener("hashchange", () => {
    currentPath.value = window.location.hash;
});

console.log(currentPath.value.slice(1));

const currentView = computed(() => {
    return routes[currentPath.value.slice(1) || "/"] || Login;
});

const url = "https://graphql.anilist.co";

const urlFragment = window.location.hash.substring(1);
const urlParams = new URLSearchParams(urlFragment);
const accessToken = urlParams.get("access_token");
</script>

<template>
    <div>
        <a href="#/">Home</a> | <a href="#/media">Media</a> |
        <a href="#/recommendations">Recommendations</a>

        <Suspense>
            <component :is="currentView" :url="url" :token="accessToken" />
        </Suspense>

        <br />

        <!-- <Login />

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
        </Suspense> -->
    </div>
</template>
