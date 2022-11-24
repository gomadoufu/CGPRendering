import Scene from "../../@types/rayTraceScene";

const scene: Scene = {
    pointlight: { x: 200, y: 280, z: 100, ii: 100000 },
    bgcolor: { r: 60, g: 60, b: 60 },
    ellipses: [
        { x: 85, y: 0, z: 15, a: 40, b: 40, c: 40, material: { r: 255, g: 0, b: 0, ia: 0.1, id: 0.45, is: 0.45, n: 30 } },
        { x: 0, y: 0, z: 15, a: 40, b: 40, c: 40, material: { r: 0, g: 255, b: 0, ia: 0.1, id: 0.45, is: 0.45, n: 30 } },
        { x: -85, y: 0, z: 15, a: 40, b: 40, c: 40, material: { r: 0, g: 0, b: 255, ia: 0.1, id: 0.45, is: 0.45, n: 30 } },
    ],
    triangles: [
        { x0: 0, y0: -100, z0: 0, x1: 100, y1: -100, z1: 100, x2: 0, y2: -100, z2: 100, material: { r: 255, g: 0, b: 0, ia: 0.1, id: 0.45, is: 0.45, n: 30 } },
    ],
};

export default scene;
