export { Tile };

import { Position } from "./position.ts";

class Tile {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    being_dragged: boolean;
    private mouse_positions: Array<Position> = [];

    constructor(id: number, x: number, y: number, width: number, height: number) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.being_dragged = false;

        this.update_position();
        let tile = document.getElementById(`${this.id}`);
        if (tile == null) {
            console.error("Tile didn't exist");
            return
        }
        tile.onmousedown = this.mousedown;
    }

    update_position() {
        let tile = document.getElementById(`${this.id}`);
        if (tile == null) {
            console.error("Tile didn't exist");
            return
        }
        tile.style.left = this.x.toString() + "px";
        tile.style.top = this.y.toString() + "px";
    }

    mousedown = (e: MouseEvent) => {
        console.log(e);
        this.being_dragged = true;
        document.onmousemove = this.mousemove;
        document.onmouseup = this.mouseup;
        this.mouse_positions = [new Position(this.x, this.y)]
    }

    private calculate_drag_velocity(x: number, y: number) {
        if (this.mouse_positions.length == 5) {
            this.mouse_positions.pop();
        }
        this.mouse_positions.unshift(new Position(x, y))
    }

    mousemove = (e: MouseEvent) => {
        this.calculate_drag_velocity(e.clientX, e.clientY);
        this.x += e.clientX - this.mouse_positions[1].x;
        this.y += e.clientY - this.mouse_positions[1].y;
        this.update_position();
    }

    mouseup = (e: MouseEvent) => {
        this.being_dragged = false;
        document.onmousemove = null;
        document.onmouseup = null;
    }
}