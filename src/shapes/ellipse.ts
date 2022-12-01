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


        let alpha, beta, gamma; //tに関する二次方程式の係数
        let D;
        const K = 1;
        let M = new THREE.Matrix4();
        let r0d = new THREE.Vector3();

        r0d = r0d.subVectors(e, this.position);
        M = M.scale(new THREE.Vector3(1 / (this.size.x * this.size.x), 1 / (this.size.y * this.size.y), 1 / (this.size.z * this.size.z)));
        alpha = v.dot(v.applyMatrix4(M));
        beta = v.dot(r0d.applyMatrix4(M));
        gamma = r0d.dot(r0d.applyMatrix4(M)) - K;
        D = beta * beta - alpha * gamma;

        if (D < 0) {
            return -1;
        }
        else {
            return (-beta - Math.sqrt(D)) / alpha;
        }
    }

    calcNorm(p: THREE.Vector3): THREE.Vector3 {
        const mscale = new THREE.Matrix4().scale(new THREE.Vector3(1 / (this.size.x * this.size.x), 1 / (this.size.y * this.size.y), 1 / (this.size.z * this.size.z)));
        const postop = p.sub(this.position);
        return postop.applyMatrix4(mscale).normalize();
    }

    calcShading(q: PointLight, p: THREE.Vector3, e: THREE.Vector3): THREE.Color {
        //拡散反射光・鏡面反射光の計算に共通な項を計算する -> (4)
        //交点から点光源への距離r
        const r = q.position.sub(p).length();
        //単位光源ベクトルL
        const L = q.position.sub(p).normalize();
        //単位法線ベクトルN
        const N = this.calcNorm(p);
        //id, is を共に0で初期化
        let id = 0;
        let is = 0;
        //環境光の強度iaを求める -> (1)
        let ia = this.ka;

        //光源からの光が交点に照射しているならば、
        if (L.dot(N) >= 0) {
            //交点は「陽」の部分にあるので、拡散反射光の強度idを求める -> (2)
            id = this.kd * Math.max(0, N.dot(L));
            //単位視線ベクトルV
            const V = e.sub(p).normalize();
            //単位正反射ベクトルR -> (3)
            const R = N.multiplyScalar(2 * N.dot(L)).sub(L);
            //鏡面反射光の強度isを求める -> (3)
            is = this.ks * Math.pow(Math.max(0, R.dot(V)), this.n);
        }
        //環境光、拡散反射光、鏡面反射光の強度を加算して、反射光の強度を求める
        const pR = this.color.r * ia + this.color.r * id + 255 * is;
        const pG = this.color.g * ia + this.color.g * id + 255 * is;
        const pB = this.color.b * ia + this.color.b * id + 255 * is;
        return new THREE.Color(pR, pG, pB);
    }

}
