export { Simulation };

import { Tile } from "./tile.svelte";

class Simulation {
    max_x: number;
    max_y: number;
    tiles: Array<Tile>;
    is_initialised: boolean;

    constructor() {
        this.max_x = 0;
        this.max_y = 0;
        this.tiles = [];
        this.is_initialised = false;
    }

    init() {
        this.max_x = document.documentElement.clientWidth;
        this.max_y = document.documentElement.clientHeight;
        window.onresize = this.on_resize;
        this.tiles.push(new Tile(0, this.max_x * 0.2, this.max_y * 0.2, 100, 100));
        this.tiles.push(new Tile(1, this.max_x * 0.8, this.max_y * 0.4, 100, 100));
        this.tiles.push(new Tile(2, this.max_x * 0.4, this.max_y * 0.7, 100, 100));
        this.is_initialised = true;
    }

    private on_resize(e: Event) {
        this.max_x = document.documentElement.clientWidth;
        this.max_y = document.documentElement.clientHeight;
    }

    get_tile(i: number): Tile {
        return this.tiles[i];
    }
}