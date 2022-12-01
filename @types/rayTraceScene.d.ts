export default interface Scene {
    pointlight: {
        x: number,
        y: number,
        z: number,
        ii: number,
    },
    bgcolor: {
        r: number,
        g: number,
        b: number,
    },
    ellipses: {
        x: number,
        y: number,
        z: number,
        a: number,
        b: number,
        c: number,
        material: Material,
    }[],
    triangles: {
        x0: number,
        y0: number,
        z0: number,
        x1: number,
        y1: number,
        z1: number,
        x2: number,
        y2: number,
        z2: number,
        material: Material,
    }[],
}

interface Material {
    r: number,
    g: number,
    b: number,
    ia: number,
    id: number,
    is: number,
    n: number,
}
