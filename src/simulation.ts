export { Simulation };

import { Bodies, Body, Composite, Engine, Events, Mouse, MouseConstraint, Query, Render, Resolver, Runner, Vector } from "matter-js";

class Simulation {
    is_initialised: boolean;
    tiles: Array<Body>;
    dom_tiles: Array<HTMLElement>;

    constructor() {
        this.tiles = [];
        this.is_initialised = false;
        this.dom_tiles = [];
    }

    init() {
        let engine = Engine.create({
            gravity: {
                scale: 0,
            },
            positionIterations: 100,
            velocityIterations: 100,
        });

        (Resolver as any)._restingThresh = 0;

        let debug_render_target = document.getElementById("debug-render-target");
        if (debug_render_target == null) {
            console.error("Debug render target not found");
            return;
        }
        let render = Render.create({
            element: debug_render_target,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
            },
            engine: engine,
        });

        this.tiles = [
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
        ]

        Composite.add(engine.world, this.tiles);

        let wall_options = {
            isStatic: true,
            restitution: 0.9,
            render: {
                visible: false,
            },
        };
        let left_wall = Bodies.rectangle(-50, window.innerHeight / 2, 100, window.innerHeight + 200, wall_options);
        let right_wall = Bodies.rectangle(window.innerWidth + 50, window.innerHeight / 2, 100, window.innerHeight + 200, wall_options);
        let top_wall = Bodies.rectangle(window.innerWidth / 2, -50, window.innerWidth + 200, 100, wall_options);
        let bottom_wall = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 50, window.innerWidth + 200, 100, wall_options);
        Composite.add(engine.world, [left_wall, right_wall, top_wall, bottom_wall]);

        let mouse = Mouse.create(render.canvas);
        let mouse_constraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.02,
                damping: 0.05,
                render: {
                    visible: false,
                }
            }
        });

        Composite.add(engine.world, mouse_constraint);
        render.mouse = mouse;

        Render.run(render);

        let runner = Runner.create({
            delta: 1000 / 2000,
        });
        Runner.run(runner, engine);

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
            target = e.source.body.id;
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

        Events.on(engine, "afterUpdate", (e) => {
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

        window.onresize = this.on_resize;
    }

    private on_resize(_e: Event) {
    }
}