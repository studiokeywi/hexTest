'use strict';

var _sK = Object.assign(window._sK || {}, {});

_sK.hex = Object.assign(_sK.hex || {}, {});

_sK.hex.tests = Object.assign(
    _sK.hex.tests || {},
    (() => {
        let equal = (name, a, b) => {
            let res = { status: 'FAILED' };
            if (typeof a === 'number' && typeof b === 'number') {
                if (a !== b) {
                    res.info = `\n\tUnequal integers: ${a} and ${b}`;
                } else {
                    res.status = 'PASSED';
                }
            } else if (a === void 0 || b === void 0) {
                res.info = `\n\tUndefined value: ${a ? 'b' : 'a'}`;
            } else if (a.name !== b.name) {
                res.info = `\n\tIncompatible objects: ${a} and ${b}`;
            } else if (!a.equal(b)) {
                res.info = `\n\tUnequal objects: ${a} and ${b}`;
            } else {
                res.status = 'PASSED';
            }
            output(name, res);
        };
        let equalHex = (name, a, b) => {
            equal(name, a, b);
        };
        let equalOffsetCoord = (name, a, b) => {
            equal(name, a, b);
        };
        let equalDoubledCoord = (name, a, b) => {
            equal(name, a, b);
        };
        let equalInt = (name, a, b) => {
            let Hexagon = _sK.hex.geometry.Hexagon;
            equal(name, new Hexagon(a, -a, 0), new Hexagon(b, -b, 0));
        };
        let equalHexArray = (name, a, b) => {
            equalInt(name, a.length, b.length);
            for (let i = 0; i < a.length; i++) {
                equalHex(`\t${name} - ${i}`, a[i], b[i]);
            }
        };
        let testHexArithmetic = () => {
            let Hexagon = _sK.hex.geometry.Hexagon;
            equalHex(
                'Addition',
                new Hexagon(4, -10, 6),
                new Hexagon(1, -3, 2).add(new Hexagon(3, -7, 4))
            );
            equalHex(
                'Subtraction',
                new Hexagon(-2, 4, -2),
                new Hexagon(1, -3, 2).subtract(new Hexagon(3, -7, 4))
            );
        };
        let testHexDirection = () => {
            let Hexagon = _sK.hex.geometry.Hexagon;
            equalHex(
                'Direction',
                new Hexagon(0, -1, 1),
                Hexagon.direction('upLeft')
            );
        };
        let testHexNeighbor = () => {
            let Hexagon = _sK.hex.geometry.Hexagon;
            equalHex(
                'Neighbor',
                new Hexagon(1, -3, 2),
                new Hexagon(1, -2, 1).getNeighbor('upLeft')
            );
        };
        let testHexDiagonal = () => {
            let Hexagon = _sK.hex.geometry.Hexagon;
            equalHex(
                'Diagonal',
                new Hexagon(-1, -1, 2),
                new Hexagon(1, -2, 1).getDiagonalNeighbor('downLeft')
            );
        };
        let testHexDistance = () => {
            let Hexagon = _sK.hex.geometry.Hexagon;
            equalInt(
                'Distance',
                7,
                new Hexagon(3, -7, 4).getDistanceBetween(new Hexagon(0, 0, 0))
            );
        };
        let testHexRotateRight = () => {
            let Hexagon = _sK.hex.geometry.Hexagon;
            equalHex(
                'Rotate Right',
                new Hexagon(1, -3, 2).rotate('right'),
                new Hexagon(3, -2, -1)
            );
        };
        let testHexRotateLeft = () => {
            let Hexagon = _sK.hex.geometry.Hexagon;
            equalHex(
                'Rotate Left',
                new Hexagon(1, -3, 2).rotate('left'),
                new Hexagon(-2, -1, 3)
            );
        };
        let testHexRound = () => {
            let Hexagon = _sK.hex.geometry.Hexagon;
            let a = new Hexagon(0, 0, 0);
            let b = new Hexagon(1, -1, 0);
            let c = new Hexagon(0, -1, 1);
            equalHex(
                'Rounding 1',
                new Hexagon(5, -10, 5),
                new Hexagon(0, 0, 0).lerp(new Hexagon(10, -20, 10), 0.5).round()
            );
            equalHex('Rounding 2', a.round(), a.lerp(b, 0.499).round());
            equalHex('Rounding 3', b.round(), a.lerp(b, 0.501).round());
            equalHex(
                'Rounding 4',
                a.round(),
                new Hexagon(
                    a.q * 0.4 + b.q * 0.3 + c.q * 0.3,
                    a.r * 0.4 + b.r * 0.3 + c.r * 0.3,
                    a.s * 0.4 + b.s * 0.3 + c.s * 0.3
                ).round()
            );
            equalHex(
                'Rounding 5',
                c.round(),
                new Hexagon(
                    a.q * 0.3 + b.q * 0.3 + c.q * 0.4,
                    a.r * 0.3 + b.r * 0.3 + c.r * 0.4,
                    a.s * 0.3 + b.s * 0.3 + c.s * 0.4
                ).round()
            );
        };
        let testHexLine = () => {
            let Hexagon = _sK.hex.geometry.Hexagon;
            equalHexArray(
                'Line Draw, Panel',
                [
                    new Hexagon(0, 0, 0),
                    new Hexagon(0, -1, 1),
                    new Hexagon(0, -2, 2),
                    new Hexagon(1, -3, 2),
                    new Hexagon(1, -4, 3),
                    new Hexagon(1, -5, 4)
                ],
                new Hexagon(0, 0, 0).drawLineTo(new Hexagon(1, -5, 4))
            );
        };
        let testLayout = () => {
            let Hexagon = _sK.hex.geometry.Hexagon;
            let Layout = _sK.hex.geometry.Layout;
            let Orientation = _sK.hex.geometry.Orientation;
            let Point = _sK.hex.geometry.Point;
            let hex = new Hexagon(3, 4, -7);
            let flat = new Layout(
                Orientation.flat,
                new Point(10, 15),
                new Point(35, 71)
            );
            equalHex(
                'Flat Layout',
                hex,
                flat.pixelToHex(flat.hexToPixel(hex)).round()
            );
            let pointy = new Layout(
                Orientation.pointy,
                new Point(10, 15),
                new Point(35, 71)
            );
            equalHex(
                'Pointy Layout',
                hex,
                pointy.pixelToHex(pointy.hexToPixel(hex)).round()
            );
        };
        let testOffsetRoundtrip = () => {
            let Hexagon = _sK.hex.geometry.Hexagon;
            let OffsetCoord = _sK.hex.geometry.OffsetCoord;
            let a = new Hexagon(3, 4, -7);
            let b = new OffsetCoord(1, -3);
            equalHex(
                'Conversion Roundtrip Even-Q A',
                a,
                OffsetCoord.qOffToCube(
                    OffsetCoord.EVEN,
                    OffsetCoord.qOffFromCube(OffsetCoord.EVEN, a)
                )
            );
            equalHex(
                'Conversion Roundtrip Even-Q B',
                b,
                OffsetCoord.qOffFromCube(
                    OffsetCoord.EVEN,
                    OffsetCoord.qOffToCube(OffsetCoord.EVEN, b)
                )
            );
            equalHex(
                'Conversion Roundtrip Odd-Q A',
                a,
                OffsetCoord.qOffToCube(
                    OffsetCoord.ODD,
                    OffsetCoord.qOffFromCube(OffsetCoord.ODD, a)
                )
            );
            equalHex(
                'Conversion Roundtrip Odd-Q B',
                b,
                OffsetCoord.qOffFromCube(
                    OffsetCoord.ODD,
                    OffsetCoord.qOffToCube(OffsetCoord.ODD, b)
                )
            );
            equalHex(
                'Conversion Roundtrip Even-R A',
                a,
                OffsetCoord.rOffToCube(
                    OffsetCoord.EVEN,
                    OffsetCoord.rOffFromCube(OffsetCoord.EVEN, a)
                )
            );
            equalHex(
                'Conversion Roundtrip Even-R B',
                b,
                OffsetCoord.rOffFromCube(
                    OffsetCoord.EVEN,
                    OffsetCoord.rOffToCube(OffsetCoord.EVEN, b)
                )
            );
            equalHex(
                'Conversion Roundtrip Odd-R A',
                a,
                OffsetCoord.rOffToCube(
                    OffsetCoord.ODD,
                    OffsetCoord.rOffFromCube(OffsetCoord.ODD, a)
                )
            );
            equalHex(
                'Conversion Roundtrip Odd-R B',
                b,
                OffsetCoord.rOffFromCube(
                    OffsetCoord.ODD,
                    OffsetCoord.rOffToCube(OffsetCoord.ODD, b)
                )
            );
        };
        let testOffsetFromCube = () => {
            let Hexagon = _sK.hex.geometry.Hexagon;
            let OffsetCoord = _sK.hex.geometry.OffsetCoord;
            equalOffsetCoord(
                'Offset from Cube Even-Q',
                new OffsetCoord(1, 3),
                OffsetCoord.qOffFromCube(
                    OffsetCoord.EVEN,
                    new Hexagon(1, 2, -3)
                )
            );
            equalOffsetCoord(
                'Offset from Cube Odd-Q',
                new OffsetCoord(1, 2),
                OffsetCoord.qOffFromCube(OffsetCoord.ODD, new Hexagon(1, 2, -3))
            );
        };
        let testOffsetToCube = () => {
            let Hexagon = _sK.hex.geometry.Hexagon;
            let OffsetCoord = _sK.hex.geometry.OffsetCoord;
            equalOffsetCoord(
                'Offset to Cube Even-Q',
                new Hexagon(1, 2, -3),
                OffsetCoord.qOffToCube(OffsetCoord.EVEN, new OffsetCoord(1, 3))
            );
            equalOffsetCoord(
                'Offset to Cube Odd-Q',
                new Hexagon(1, 2, -3),
                OffsetCoord.qOffToCube(OffsetCoord.ODD, new OffsetCoord(1, 2))
            );
        };
        let testDoubledRoundtrip = () => {
            let Hexagon = _sK.hex.geometry.Hexagon;
            let DoubledCoord = _sK.hex.geometry.DoubledCoord;
            let a = new Hexagon(3, 4, -7);
            let b = new DoubledCoord(1, -3);
            equalHex(
                'Conversion Roundtrip Doubled-Q A',
                a,
                DoubledCoord.qDoubFromCube(a).qDoubToCube()
            );
            equalDoubledCoord(
                'Conversion Roundtrip Doubled-Q B',
                b,
                DoubledCoord.qDoubFromCube(b.qDoubToCube())
            );
            equalHex(
                'Conversion Roundtrip Doubled-R A',
                a,
                DoubledCoord.rDoubFromCube(a).rDoubToCube()
            );
            equalDoubledCoord(
                'Conversion Roundtrip Doubled-R B',
                b,
                DoubledCoord.rDoubFromCube(b.rDoubToCube())
            );
        };
        let testDoubledFromCube = () => {
            let Hexagon = _sK.hex.geometry.Hexagon;
            let DoubledCoord = _sK.hex.geometry.DoubledCoord;
            equalDoubledCoord(
                'Doubled from Cube Q',
                new DoubledCoord(1, 5),
                DoubledCoord.qDoubFromCube(new Hexagon(1, 2, -3))
            );
            equalDoubledCoord(
                'Doubled from Cube R',
                new DoubledCoord(4, 2),
                DoubledCoord.rDoubFromCube(new Hexagon(1, 2, -3))
            );
        };
        let testDoubledToCube = () => {
            let Hexagon = _sK.hex.geometry.Hexagon;
            let DoubledCoord = _sK.hex.geometry.DoubledCoord;
            equalDoubledCoord(
                'Doubled to Cube Q',
                new Hexagon(1, 2, -3),
                new DoubledCoord(1, 5).qDoubToCube()
            );
            equalDoubledCoord(
                'Doubled to Cube R',
                new Hexagon(1, 2, -3),
                new DoubledCoord(4, 2).rDoubToCube()
            );
        };
        let testAll = () => {
            testHexArithmetic();
            testHexDirection();
            testHexNeighbor();
            testHexDiagonal();
            testHexDistance();
            testHexRotateRight();
            testHexRotateLeft();
            testHexRound();
            testHexLine();
            testLayout();
            testOffsetRoundtrip();
            testOffsetFromCube();
            testOffsetToCube();
            testDoubledRoundtrip();
            testDoubledFromCube();
            testDoubledToCube();
        };
        let output = (name, result) => {
            let str = `${name}: ${
                result.status.toUpperCase() + result.info ? result.info : ''
            }`;
            if (result.status.toLowerCase() === 'failed') {
                console.warn(str);
            } else {
                console.log(str);
            }
        };
        return {
            // equal,
            // equalhex,
            // equalOffsetCoord,
            // equalDoubledCoord,
            // equalInt,
            // equalHexArray,
            testHexArithmetic,
            testHexDirection,
            testHexNeighbor,
            testHexDiagonal,
            testHexDistance,
            testHexRotateRight,
            testHexRotateLeft,
            testHexRound,
            testHexLine,
            testLayout,
            testOffsetRoundtrip,
            testOffsetFromCube,
            testOffsetToCube,
            testDoubledRoundtrip,
            testDoubledFromCube,
            testDoubledToCube,
            testAll
        };
    })()
);

Object.freeze(_sK.hex.tests);
