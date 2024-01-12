<script setup lang="ts">
import { ErrorType } from "../types/types";

const props = defineProps<{
    error: ErrorType;
}>();

function closeError() {
    props.error.isErrorPresent = false;
    props.error.errorMessage = "";
}
</script>

<template>
    <div>
        <div class="errorBackground errorBackgroundCommon"></div>
        <div class="errorBackgroundCommon">
            <div class="errorBox">
                <h2>
                    Wystąpił błąd!
                    <button @click="closeError()">
                        <img src="../assets/x-icosvg.svg" alt="Zamknij" />
                    </button>
                </h2>
                <p>
                    <slot></slot>
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.errorBackgroundCommon {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0px;
    left: 0px;
    z-index: 5;
    width: 100vw;
    height: 100vh;
}
.errorBackground {
    background: #161616;
    opacity: 0.75;
}

.errorBox {
    background-color: #866efb;
    height: 30vh;
    width: 40vw;
    border-radius: 10px;
    position: fixed;
    z-index: 6;
}

.errorBox > * {
    padding: 10px;
}

.errorBox > h2 {
    color: #ae1131;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border-bottom: #ae1131 2px solid;
    width: calc(100% - 20px);
    background-color: #72091e;
}

img {
    width: 18px;
    height: 18px;
}

button {
    margin: 10px;
    background-color: transparent;
    border: none;
    cursor: pointer;
}

button:active > img {
    content: url("../assets/x-icodark.svg");
}
</style>
