'use strict';

var _sK = Object.assign(window.top._sK || {}, {});

_sK.hex = Object.assign(_sK.hex || {}, {});

_sK.hex.game = Object.assign(
    _sK.hex.game | {},
    (() => {
        // Helper handles
        let Hexagon = _sK.hex.geometry.Hexagon;
        let Point = _sK.hex.geometry.Point;
        let Layout = _sK.hex.geometry.Layout;
        let Orientation = _sK.hex.geometry.Orientation;
        // Game settings variables
        let canvHeight = 0;
        let canvWidth = 0;
        let hexSize = 0;
        let unitSize = 0;
        let gameLayout = {};
        // Game data
        let gameGrid = [];
        let gameUnits = [];
        let player = {};
        // /////////////////
        // Helper classes //
        // /////////////////
        class Cell {
            constructor(hex = new Hexagon(0, 0, 0), color = 255) {
                this.setHex(hex);
                this.setColor(color);
            }
            setHex(h) {
                if (!(h instanceof Hexagon)) {
                    console.warn(h);
                    throw 'A non-hexagon was attempted to make this cell';
                }
                this.hex = h;
            }
            setColor(c) {
                if (typeof c === 'number') {
                    c = [c, c, c];
                }
                if (
                    c === void 0 ||
                    c[0] === void 0 ||
                    c[1] === void 0 ||
                    c[2] === void 0
                ) {
                    console.warn(color);
                    throw 'An invalid rgb object was used to create this cell.';
                }
                this.color = c;
            }
            neighbor(dir) {
                return this.hex.neighbor(dir);
            }
            neighbors() {
                return this.hex.neighbors();
            }
            diagonal(dir) {
                return this.hex.diagonal(dir);
            }
            diagonals() {
                return this.hex.diagonals();
            }
            distance(cell) {
                return this.hex.distanceBetween(cell.hex);
            }

            equal(cell) {
                return (
                    cell instanceof Cell &&
                    cell.hex.equal(this.hex) &&
                    cell.color == this.color
                );
            }
            toString() {
                return `Cell ${this.hex.coords}`;
            }
        }
        class Unit {
            constructor(position, color) {
                this.setPosition(position);
                this.setColor(color);
            }
            setPosition(position) {
                if (!(position instanceof Cell)) {
                    if (!(position instanceof Hexagon)) {
                        if (
                            !(position instanceof Point) ||
                            position.coord.length !== 3 ||
                            position.x + position.y + position.z != 0
                        ) {
                            console.warn(position);
                            throw 'Could not coerce position into a Cell';
                        }
                        position = new Hexagon(position);
                    }
                    position = new Cell(position);
                }
                if (!gameGrid.onGrid(position.hex)) {
                    console.warn(position.hex);
                    throw 'Hexagon is not on grid';
                }
                this.position = position;
            }
            setColor(c) {
                if (typeof c === 'number') {
                    c = [c, c, c];
                }
                if (
                    c === void 0 ||
                    c[0] === void 0 ||
                    c[1] === void 0 ||
                    c[2] === void 0
                ) {
                    console.warn(color);
                    throw 'An invalid rgb object was used to create this cell.';
                }
                this.color = c;
            }
            move(dir) {
                try {
                    this.setPosition(this.position.neighbor(dir));
                } catch (err) {
                    console.warn(err);
                }
            }
        }
        // ////////////////////
        // Updating routines //
        // ////////////////////
        function update() {
            // Update cell colors based on distance from player
            gameGrid.forEach(cell => {
                let dist = player.position.distance(cell);
                cell.setColor(
                    player.range[
                        dist < player.range.length - 1
                            ? dist
                            : player.range.length - 1
                    ]
                );
            });
        }
        // //////////////////////////
        // Initialization Routines //
        // //////////////////////////
        function initializeSettings() {
            // Initialize game values/settings
            canvWidth = 800;
            canvHeight = 600;
            hexSize = (canvWidth < canvHeight ? canvWidth : canvHeight) / 24;
            unitSize = hexSize * 1.05;
            gameLayout = new Layout(
                Orientation.pointy,
                new Point(hexSize, hexSize),
                new Point(0, 0)
            );
        }
        function generateGameGrid(opt) {
            // Grid layouts
            switch (parseInt(opt)) {
                case 0:
                    simple();
                    break;
                case 1:
                    testGrid();
                    break;
                default:
                    single();
                    break;
            }
            // Assign grid helpers
            gameGrid.corners = () =>
                gameGrid.map(cell => gameLayout.polygonCorners(cell.hex));
            gameGrid.onGrid = hex => gameGrid.some(h => h.hex.equal(hex));
        }
        function single() {
            gameGrid = [new Cell()];
        }
        function simple() {
            gameGrid = [new Cell()];
            gameGrid.forEach(cell => {
                cell.diagonals().forEach(neighbor =>
                    gameGrid.push(new Cell(neighbor))
                );
                cell.neighbors().forEach(neighbor =>
                    gameGrid.push(new Cell(neighbor))
                );
            });
        }
        function testGrid() {
            // Origin -- may not be needed in future layouting
            gameGrid = [new Cell()];
            // "remotes"
            gameGrid[0]
                .neighbors()
                .forEach(neighbor =>
                    gameGrid.push(new Cell(neighbor.multiplyScalar(4), 200))
                );
            // push all neighbors/diagonals for origin + remotes
            gameGrid.forEach(cell => {
                cell.neighbors().forEach(neighbor =>
                    gameGrid.push(new Cell(neighbor))
                );
                cell.diagonals().forEach(neighbor =>
                    gameGrid.push(new Cell(neighbor))
                );
            });
        }
        function generatePlayer() {
            player = new Unit(gameGrid[0], [0, 125, 0]);
            player.range = generateRange(12);
            gameUnits = [player];
        }

        function generateRange(n) {
            if (typeof n !== 'number') {
                console.warn(n);
                throw 'Cannot generate range steps';
            }
            let range = Array(n + 1)
                .fill(0)
                .map((a, i) => Math.floor(255 - (255 * i) / n));
            return range;
        }

        function assignP5Functions() {
            window.setup = () => {
                createCanvas(canvWidth, canvHeight);
                stroke(0);
            };
            window.draw = Object.assign(
                // Primary draw function
                () => {
                    background(...[50, 75, 175]);
                    translate(canvWidth / 2, canvHeight / 2);
                    draw.grid();
                    draw.units();
                    update();
                },
                // Secondary drawing routines
                {
                    cell: (corners, color) => {
                        fill(...[color]);
                        beginShape();
                        corners.forEach(corner => {
                            vertex(corner.x, corner.y);
                        });
                        endShape(CLOSE);
                    },
                    circle: (center, color) => {
                        ellipseMode(CENTER);
                        fill(...[color]);
                        ellipse(center.x, center.y, unitSize, unitSize);
                    },
                    grid: () => {
                        strokeWeight(2);
                        gameGrid.forEach((cell, i) =>
                            draw.cell(gameGrid.corners()[i], cell.color)
                        );
                    },
                    units: () => {
                        strokeWeight(0);
                        gameUnits.forEach(unit =>
                            draw.circle(
                                gameLayout.centerOf(unit.position.hex),
                                unit.color
                            )
                        );
                    }
                }
            );
            window.keyTyped = () => {
                let dir = '';
                switch (key) {
                    case 'd':
                        dir = 'right';
                        break;
                    case 'e':
                        dir = 'upRight';
                        break;
                    case 'w':
                        dir = 'upLeft';
                        break;
                    case 'a':
                        dir = 'left';
                        break;
                    case 'z':
                        dir = 'downLeft';
                        break;
                    case 'x':
                        dir = 'downRight';
                        break;
                    default:
                        break;
                }
                player.move(dir);
            };
        }
        return {
            init: (opt = void 0) => {
                // ↓↓↓ DEBUG BLOCK ↓↓↓
                if (opt === void 0) {
                    opt = prompt('layout number:');
                }
                // ↑↑↑ DEBUG BLOCK ↑↑↑
                initializeSettings();
                generateGameGrid(opt);
                generatePlayer();
                assignP5Functions();
            }
        };
    })()
);
