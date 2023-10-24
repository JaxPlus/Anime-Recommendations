<script setup lang="ts">
const query = {
    clientId: "14471",
};
</script>

<template>
    <a
        :href="`https://anilist.co/api/v2/oauth/authorize?client_id=${query.clientId}&response_type=token`"
        >Login with AniList</a
    >
</template>
