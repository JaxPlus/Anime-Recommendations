<script setup lang="ts">
import axios from "axios";
import type { QueryPageIndex } from "../types/types";

const props = defineProps<{
    generes: string[];
    url: string;
}>();

async function findPage(generes: string[], url: string) {
    let pageIndex = 1;
    const query = {
        operationName: "PageQuery",
        query: `
            query PageQuery($page: Int, $genres: [String]) {
                Page(page: $page) {
                    media(genre_in: $genres, startDate_lesser: 20231231, sort: START_DATE_DESC) {
                        seasonYear
                    }
                }
            }
        `,
        variables: { page: pageIndex, genres: generes },
    };

    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
    };

    const response: QueryPageIndex | void = await axios({
        url: url,
        method: "post",
        headers: headers,
        data: query,
    }).catch((err) => console.log(err));

    if (response) {
        response.data.data.Page.media.forEach((media) => {
            console.log(pageIndex);
            if (media.seasonYear != null) {
                pageIndex++;
            }
        });
    }

    return pageIndex;
}
</script>

<template>
    <div>
        <button @click="findPage(props.generes, props.url)">Dawaj</button>
    </div>
</template>
