import * as THREE from "three";

export class PointLight {
    private mposition: THREE.Vector3;
    get position(): THREE.Vector3 {
        return this.mposition;
    }

    private mii: number;
    get ii(): number {
        return this.mii;
    }

    constructor(position: THREE.Vector3, ii: number) {
        this.mposition = new THREE.Vector3();
        this.mposition.copy(position);
        this.mii = ii;
    }
}
