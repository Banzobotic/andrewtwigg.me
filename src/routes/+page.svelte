<script lang="ts">
    import Card from "./Card.svelte";
    import { Simulation } from "./simulation.svelte";
    import { browser } from "$app/environment";

    let simulation = new Simulation();

    if (browser) {
        simulation.init();
    }
</script>

{#if simulation.is_initialised}
<Card id=0 colour="red" tile={simulation.get_tile(0)}></Card>
<Card id=1 colour="green" tile={simulation.get_tile(1)}></Card>
<Card id=2 colour="blue" tile={simulation.get_tile(2)}></Card>
{/if}