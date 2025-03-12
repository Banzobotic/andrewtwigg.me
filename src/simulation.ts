export { Simulation };

import { Bodies, Body, Composite, Engine, Events, Mouse, MouseConstraint, Query, Render, Resolver, Runner, Vector } from "matter-js";

class Simulation {
    is_initialised: boolean;
    tiles: Array<Body>;
    dom_tiles: Array<HTMLElement>;
    walls: Array<Body>;
    engine: Engine;
    render?: Render;

    constructor() {
        this.tiles = [];
        this.is_initialised = false;
        this.dom_tiles = [];
        this.walls = [];
        this.engine = Engine.create({
            gravity: {
                scale: 0,
            },
            positionIterations: 100,
            velocityIterations: 100,
        });
        this.render = undefined;
    }

    init() {
        (Resolver as any)._restingThresh = 0;

        let debug_render_target = document.getElementById("debug-render-target");
        if (debug_render_target == null) {
            console.error("Debug render target not found");
            return;
        }
        this.render = Render.create({
            element: debug_render_target,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
            },
            engine: this.engine,
        });

        this.tiles = this.generate_tiles();
        Composite.add(this.engine.world, this.tiles);

        this.walls = this.generate_walls();
        Composite.add(this.engine.world, this.walls);

        let mouse = Mouse.create(this.render.canvas);
        let mouse_constraint = MouseConstraint.create(this.engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.02,
                damping: 0.05,
                render: {
                    visible: false,
                }
            }
        });

        Composite.add(this.engine.world, mouse_constraint);
        this.render.mouse = mouse;

        Render.run(this.render);

        let runner = Runner.create({
            delta: 1000 / 2000,
        });
        Runner.run(runner, this.engine);

        for (let i = 0; i < this.tiles.length; i++) {
            let element = document.getElementById(i.toString());
            if (element == null) {
                console.error("DOM Element not found");
                return;
            }
            this.dom_tiles.push(element);
        }

        let mouse_moved = false;
        let target = -1;
        let links = [
            null,
            "https://github.com/Banzobotic/dymaxilang",
            null,
            "https://github.com/Banzobotic/andrewtwigg.me",
            "https://old.andrewtwigg.me/games"
        ];

        Events.on(mouse_constraint, "mousedown", (e) => {
            mouse_moved = false;

            if (e.source.body != null) {
                target = e.source.body.id;
            }
        });

        Events.on(mouse_constraint, "mousemove", (e) => {
            mouse_moved = true;
        });

        Events.on(mouse_constraint, "mouseup", (e) => {
            if (!mouse_moved) {
                let link = links[target];
                if (link != null) {
                    window.location.href = link;
                }
            }
            target = -1;
        });

        Events.on(this.engine, "afterUpdate", (e) => {
            for (let i = 0; i < this.tiles.length; i++) {
                let position = this.tiles[i].position;
                let transform = `translate(${position.x}px, ${position.y}px)`;
                this.dom_tiles[i].style.transform = transform;
            }

            let tiles_under_cursor = Query.point(this.tiles, Vector.create(mouse.position.x, mouse.position.y));
            if (tiles_under_cursor.length > 0 && links[tiles_under_cursor[0].id] != null) {
                document.body.style.cursor = "pointer";
            } else {
                document.body.style.cursor = "default";
            }
        });

        window.onresize = this.reset_objects;
    }

    private generate_tiles(): Array<Body> {
        return [
            Bodies.rectangle(window.innerWidth / 2, window.innerHeight / 2, 500, 400, {
                id: 0,
                restitution: 0.85,
                inertia: Infinity,
                chamfer: {
                    radius: 120,
                },
            }),
            Bodies.rectangle(window.innerWidth / 5, window.innerHeight / 5, 400, 260, {
                id: 1,
                restitution: 0.85,
                inertia: Infinity,
                chamfer: {
                    radius: 100,
                },
            }),
            Bodies.rectangle(window.innerWidth / 5 * 4, window.innerHeight / 5, 400, 310, {
                id: 2,
                restitution: 0.85,
                inertia: Infinity,
                chamfer: {
                    radius: 100,
                },
            }),
            Bodies.rectangle(window.innerWidth / 5, window.innerHeight / 5 * 4, 400, 310, {
                id: 3,
                restitution: 0.85,
                inertia: Infinity,
                chamfer: {
                    radius: 100,
                },
            }),
            Bodies.rectangle(window.innerWidth / 5 * 4, window.innerHeight / 5 * 4, 400, 260, {
                id: 4,
                restitution: 0.85,
                inertia: Infinity,
                chamfer: {
                    radius: 100,
                },
            }),
        ];
    }

    private generate_walls(): Array<Body> {
        let wall_options = {
            isStatic: true,
            restitution: 0.9,
            render: {
                visible: false,
            },
        };

        return [
            Bodies.rectangle(-50, window.innerHeight / 2, 100, window.innerHeight + 200, wall_options),
            Bodies.rectangle(window.innerWidth + 50, window.innerHeight / 2, 100, window.innerHeight + 200, wall_options),
            Bodies.rectangle(window.innerWidth / 2, -50, window.innerWidth + 200, 100, wall_options),
            Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 50, window.innerWidth + 200, 100, wall_options),
        ];
    }

    reset_objects = (_e: Event) => {
        Composite.remove(this.engine.world, this.tiles);
        Composite.remove(this.engine.world, this.walls);
            
        this.tiles = this.generate_tiles();
        this.walls = this.generate_walls();
        Composite.add(this.engine.world, this.tiles);
        Composite.add(this.engine.world, this.walls);

        if (this.render !== undefined) {
            this.render.bounds.max.x = window.innerWidth;
            this.render.bounds.max.y = window.innerHeight;
            this.render.options.width = window.innerWidth;
            this.render.options.height = window.innerHeight;
            this.render.canvas.width = window.innerWidth;
            this.render.canvas.height = window.innerHeight;
        }
    }
}