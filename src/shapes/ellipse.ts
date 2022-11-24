import * as THREE from "three";
import { BaseShape } from "./baseshape";
import { PointLight } from "../pointlight";

export class Ellipse implements BaseShape {
    private mpositioin: THREE.Vector3;
    get position(): THREE.Vector3 {
        return this.mpositioin;
    }

    private msize: THREE.Vector3;
    get size(): THREE.Vector3 {
        return this.msize;
    }

    private mcolor: THREE.Color;
    get color(): THREE.Color {
        return this.mcolor;
    }

    private mka: number;
    get ka(): number {
        return this.mka;
    }

    private mkd: number;
    get kd(): number {
        return this.mkd;
    }

    private mks: number;
    get ks(): number {
        return this.mks;
    }

    private mn: number;
    get n(): number {
        return this.mn;
    }

    constructor(position: THREE.Vector3, size: THREE.Vector3, color: THREE.Color, ka: number, kd: number, ks: number, n: number) {
        this.mpositioin = new THREE.Vector3();
        this.mpositioin.copy(position);
        this.msize = new THREE.Vector3();
        this.msize.copy(size);
        this.mcolor = new THREE.Color;
        this.mcolor.copy(color);
        this.mka = ka;
        this.mkd = kd;
        this.mks = ks;
        this.mn = n;
    }

    calcT(e: THREE.Vector3, v: THREE.Vector3): number {
        return -1;
    }

    calcNorm(p: THREE.Vector3): THREE.Vector3 {
        const mscale = new THREE.Matrix4().scale(new THREE.Vector3(1 / (this.size.x * this.size.x), 1 / (this.size.y * this.size.y), 1 / (this.size.z * this.size.z)));
        const postop = p.sub(this.position);
        return postop.applyMatrix4(mscale).normalize();
    }

    calcShading(q: PointLight, p: THREE.Vector3, e: THREE.Vector3): THREE.Color {
        return this.color;
    }

}
