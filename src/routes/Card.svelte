<script lang="ts">
    import { browser } from "$app/environment";
    import { Tile } from "./tile.svelte";

    let { id, colour, tile }: { id: string, colour: string, tile: Tile } = $props();

    function mousedown(e: MouseEvent) {
        tile.mousedown(e);
    }
</script>

<div id={id} style:background-color={colour} onmousedown={mousedown}></div>

<style>
    div {
        width: 100px;
        height: 100px;
        position: absolute;
    }
</style>