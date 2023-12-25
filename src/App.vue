<script setup lang="ts">
import { computed, ref } from "vue";
import Recommendations from "./components/Recommendations.vue";
import Home from "./components/Home.vue";
import Generes from "./components/Generes.vue";

const routes: Record<string, any> = {
    "/": Home,
    "/media": Generes,
    "/recommendations": Recommendations,
};

const currentPath = ref(window.location.hash);

window.addEventListener("hashchange", () => {
    currentPath.value = window.location.hash;
});

const currentView = computed(() => {
    return routes[currentPath.value.slice(1) || "/"] || Home;
});

const url = "https://graphql.anilist.co";

const urlFragment = window.location.hash.substring(1);
const urlParams = new URLSearchParams(urlFragment);
const accessToken = urlParams.get("access_token");
</script>

<template>
    <div>
        <div id="menu">
            <a href="#/">Home</a> | <a href="#/media">Media</a> |
            <a href="#/recommendations">Recommendations</a>
        </div>

        <component :is="currentView" :url="url" :token="accessToken" />
    </div>
</template>

<style scoped>
#menu {
    --color: #715dd4;
    position: absolute;
    top: 0px;
    left: 0px;
    width: calc(100% - 40px);
    text-align: center;
    padding: 20px;
    background-color: var(--color);
}

div:nth-child(2) {
    margin-top: calc(44px + 2rem);
}

#menu a {
    display: inline-block;
    width: 25%;
}
</style>
