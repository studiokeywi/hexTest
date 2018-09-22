'use strict';

var _sK = Object.assign(window.top._sK || {}, {});

_sK.hex = Object.assign(_sK.hex || {}, {});

_sK.hex.geometry = Object.assign(
    _sK.hex.geometry || {},
    (() => {
        class Point {
            constructor(...dim) {
                dim = dim.filter(n => !isNaN(parseFloat(n)));
                if (dim.length < 2 || dim.length > 4) {
                    console.log(dim);
                    throw 'Points must be either 2D, 3D, or 4D';
                }
                this.length = dim.length;
                this.coords = dim;
            }
            get x() {
                return this.coords[0];
            }
            get y() {
                return this.coords[1];
            }
            get z() {
                return this.coords[2];
            }
            get w() {
                return this.coords[3];
            }

            multiplyScalar(n) {
                return new Point(...this.coords.map(c => c * n));
            }
            addScalar(n) {
                return new Point(...this.coords.map(c => c + n));
            }
            add(p) {
                return new Point(...this.coords.map((c, i) => c + p.coords[i]));
            }
            subtractScalar(n) {
                return new Point(...this.coords.map(c => c - n));
            }
            subtract(p) {
                return new Point(...this.coords.map((c, i) => c - p.coords[i]));
            }

            equal(point) {
                return (
                    point instanceof Point &&
                    p.x === this.x &&
                    p.y === this.y &&
                    p.z === this.z &&
                    p.w === this.w
                );
            }
            toString() {
                return (
                    '(' +
                    (this.x !== void 0
                        ? this.x +
                          (this.y !== void 0
                              ? ', ' +
                                this.y +
                                (this.z !== void 0
                                    ? ', ' +
                                      this.z +
                                      (this.q !== void 0 ? ', ' + this.q : '')
                                    : '')
                              : '')
                        : '') +
                    ')'
                );
            }
        }

        class Hexagon {
            constructor(q, r, s) {
                if (q instanceof Point) {
                    s = q.z;
                    r = q.y;
                    q = q.x;
                }
                if ([q, r, s].some(n => isNaN(parseFloat(n)))) {
                    console.warn(q, ',', r, ',', s);
                    throw 'One or more coordinates are invalid';
                }
                if (Math.round(q + r + s) !== 0) {
                    console.warn(q, ',', r, ',', s);
                    throw 'Coordinates do not meet q + r + s = 0 constraint.';
                }
                this.coords = new Point(q, r, s);
            }

            get q() {
                return this.coords.x;
            }
            get r() {
                return this.coords.y;
            }
            get s() {
                return this.coords.z;
            }

            add(hex) {
                return hex instanceof Hexagon
                    ? new Hexagon(this.coords.add(hex.coords))
                    : this;
            }
            subtract(hex) {
                return hex instanceof Hexagon
                    ? new Hexagon(this.coords.subtract(hex.coords))
                    : this;
            }
            multiply(hex) {
                return hex instanceof Hexagon
                    ? new Hexagon(this.coords.multiply(hex.coords))
                    : this;
            }
            multiplyScalar(n) {
                return typeof n === 'number'
                    ? new Hexagon(this.coords.multiplyScalar(n))
                    : this;
            }
            rotate(dir) {
                return dir.toLowerCase() === 'left'
                    ? new Hexagon(-this.s, -this.q, -this.r)
                    : new Hexagon(-this.r, -this.s, -this.q);
            }
            neighbor(dir) {
                return this.add(Hexagon.directions[dir]);
            }
            neighbors() {
                return Object.keys(Hexagon.directions).map(dir =>
                    this.neighbor(dir)
                );
            }
            diagonal(dir) {
                return this.add(Hexagon.diagonals[dir]);
            }
            diagonals() {
                return Object.keys(Hexagon.diagonals).map(dir =>
                    this.diagonal(dir)
                );
            }
            len() {
                return (
                    (Math.abs(this.q) + Math.abs(this.r) + Math.abs(this.s)) / 2
                );
            }
            distanceBetween(hex) {
                return this.subtract(hex).len();
            }
            round() {
                let qi = Math.round(this.q);
                let ri = Math.round(this.r);
                let si = Math.round(this.s);
                let qDelta = Math.abs(qi - this.q);
                let rDelta = Math.abs(ri - this.r);
                let sDelta = Math.abs(si - this.s);
                if (qDelta > rDelta && qDelta > sDelta) {
                    qi = -ri - si;
                } else if (rDelta > sDelta) {
                    ri = -qi - si;
                } else {
                    si = -qi - ri;
                }
                return new Hexagon(qi, ri, si);
            }
            lerp(hex, delta) {
                let qLerp = this.q * (1 - delta) + hex.q * delta;
                let rLerp = this.r * (1 - delta) + hex.r * delta;
                let sLerp = this.s * (1 - delta) + hex.s * delta;
                return new Hexagon(qLerp, rLerp, sLerp);
            }
            drawLineTo(hex) {
                let dist = this.getDistanceBetween(hex);
                let aNudge = new Hexagon(
                    this.q + 0.000001,
                    this.r + 0.000001,
                    this.s - 0.000002
                );
                let bNudge = new Hexagon(
                    hex.q + 0.000001,
                    hex.r + 0.000001,
                    hex.s - 0.000002
                );
                let results = [];
                let step = 1 / Math.max(dist, 1);
                for (let i = 0; i <= dist; i++) {
                    results.push(aNudge.lerp(bNudge, step * i).round());
                }
                return results;
            }
            equal(hex) {
                return (
                    hex instanceof Hexagon &&
                    hex.q === this.q &&
                    hex.r === this.r &&
                    hex.s === this.s
                );
            }
            toString() {
                return `Hexagon ${this.coords}`;
            }
        }
        Hexagon.directions = {
            right: new Hexagon(1, 0, -1),
            upRight: new Hexagon(1, -1, 0),
            upLeft: new Hexagon(0, -1, 1),
            left: new Hexagon(-1, 0, 1),
            downLeft: new Hexagon(-1, 1, 0),
            downRight: new Hexagon(0, 1, -1)
        };
        Hexagon.diagonals = {
            upRight: new Hexagon(2, -1, -1),
            up: new Hexagon(1, -2, 1),
            upLeft: new Hexagon(-1, -1, 2),
            downLeft: new Hexagon(-2, 1, 1),
            down: new Hexagon(-1, 2, -1),
            downRight: new Hexagon(1, 1, -2)
        };

        class OffsetCoord {
            constructor(col, row) {
                this.col = col;
                this.row = row;
            }
            static qOffFromCube(offset, hex) {
                let col = hex.q;
                let row = hex.r + (col + offset * (col & 1)) / 2;
                return new OffsetCoord(col, row);
            }
            static qOffToCube(offset, hex) {
                let q = hex.col;
                let r = hex.row - (q + offset * (q & 1)) / 2;
                let s = -q - r;
                return new Hexagon(q, r, s);
            }
            static rOffFromCube(offset, hex) {
                let row = hex.r;
                let col = hex.q + (row + offset * (row & 1)) / 2;
                return new OffsetCoord(col, row);
            }
            static rOffToCube(offset, hex) {
                let r = hex.row;
                let q = hex.col - (r + offset * (r & 1)) / 2;
                let s = -q - r;
                return new Hexagon(q, r, s);
            }
            equal(off) {
                return off.col == this.col && off.row === this.row;
            }
        }
        OffsetCoord.EVEN = 1;
        OffsetCoord.ODD = -1;

        class DoubledCoord {
            constructor(col, row) {
                this.col = col;
                this.row = row;
            }
            static qDoubFromCube(hex) {
                let col = hex.q;
                let row = 2 * hex.r + col;
                return new DoubledCoord(col, row);
            }
            qDoubToCube() {
                let q = this.col;
                let r = (this.row - q) / 2;
                let s = -q - r;
                return new Hexagon(q, r, s);
            }
            static rDoubFromCube(hex) {
                let row = hex.r;
                let col = 2 * hex.q + row;
                return new DoubledCoord(col, row);
            }
            rDoubToCube() {
                let r = this.row;
                let q = (this.col - r) / 2;
                let s = -q - r;
                return new Hexagon(q, r, s);
            }

            equal(doub) {
                return doub.col === this.col && doub.row === this.row;
            }
        }

        class Orientation {
            constructor(f, b, init) {
                this.f0 = f[0];
                this.f1 = f[1];
                this.f2 = f[2];
                this.f3 = f[3];
                this.b0 = b[0];
                this.b1 = b[1];
                this.b2 = b[2];
                this.b3 = b[3];
                this.initAngle = init;
            }
        }
        Orientation.pointy = new Orientation(
            [Math.sqrt(3), Math.sqrt(3) / 2, 0, 3 / 2],
            [Math.sqrt(3) / 3, -1 / 3, 0, 2 / 3],
            1 / 2
        );
        Orientation.flat = new Orientation(
            [3 / 2, 0, Math.sqrt(3) / 2, Math.sqrt(3)],
            [2 / 3, 0, -1 / 3, Math.sqrt(3) / 3],
            0
        );
        class Layout {
            constructor(orientation, size, origin) {
                this.orientation = orientation;
                this.size = size;
                this.origin = origin;
            }
            hexToPixel(hex) {
                let ori = this.orientation;
                let x = (ori.f0 * hex.q + ori.f1 * hex.r) * this.size.x;
                let y = (ori.f2 * hex.q + ori.f3 * hex.r) * this.size.y;
                return new Point(x + this.origin.x, y + this.origin.y);
            }
            pixelToHex(pix) {
                let ori = this.orientation;
                let pt = new Point(
                    (pix.x - this.origin.x) / this.size.x,
                    (pix.y - this.origin.y) / this.size.y
                );
                let q = ori.b0 * pt.x + ori.b1 * pt.y;
                let r = ori.b2 * pt.x + ori.b3 * pt.y;
                return new Hexagon(q, r, -q - r);
            }
            hexCornerOffset(corner) {
                let ori = this.orientation;
                let angle = (2 * Math.PI * (ori.initAngle - corner)) / 6;
                return new Point(
                    this.size.x * Math.cos(angle),
                    this.size.y * Math.sin(angle)
                );
            }
            polygonCorners(hex) {
                let corners = [];
                let center = this.hexToPixel(hex);
                for (let i = 0; i < 6; i++) {
                    let offset = this.hexCornerOffset(i);
                    corners.push(center.add(offset));
                }
                return corners;
            }
            centerOf(hex) {
                let corners = this.polygonCorners(hex);
                let pnt = new Point(
                    corners[2].x,
                    (corners[2].y + corners[5].y) / 2
                );
                return pnt;
            }
        }
        return {
            Point,
            Hexagon,
            OffsetCoord,
            DoubledCoord,
            Orientation,
            Layout
        };
    })()
);

Object.freeze(_sK.hex.geometry);
