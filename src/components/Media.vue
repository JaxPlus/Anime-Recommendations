<script setup lang="ts">
import axios from "axios";
import type { QueryPageIndex } from "../types/types";

const props = defineProps<{
    generes: string[];
    url: string;
}>();

async function findPage(generes: string[], url: string, pageIndex = 1) {
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
            console.log("znajzło pageIndex: " + pageIndex);
            return pageIndex;
        } else {
            console.log("nie znajzło");
        }

        pageIndex++;
        findPage(generes, url, pageIndex);
    }
}

async function handleClick(generes: string[], url: string) {
    const page = await findPage(generes, url);
}

// const pageNum = ref(await findPage(props.generes, props.url));

// console.log(pageNum.value);
</script>

<template>
    <div>
        <button @click="handleClick(props.generes, props.url)">Dawaj</button>
        <!-- <p>{{ pageNum ? pageNum : "Ni ma" }}</p> -->
    </div>
</template>
