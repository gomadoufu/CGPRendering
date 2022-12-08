//20FI086 橋本慶紀

import * as THREE from "three";
import { BaseShape } from "./baseshape";
import { PointLight } from "../pointlight";

export class Triangle implements BaseShape {
    private mverticies: THREE.Vector3[];
    get verticies(): THREE.Vector3[] {
        return this.mverticies;
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

    private mnormal: THREE.Vector3;
    get normal(): THREE.Vector3 {
        return this.mnormal;
    }

    constructor(p0: THREE.Vector3, p1: THREE.Vector3, p2: THREE.Vector3, color: THREE.Color, ia: number, id: number, is: number, n: number) {
        this.mverticies = new Array();
        this.mverticies[0] = new THREE.Vector3().copy(p0);
        this.mverticies[1] = new THREE.Vector3().copy(p1);
        this.mverticies[2] = new THREE.Vector3().copy(p2);
        this.mcolor = new THREE.Color;
        this.mcolor.copy(color);
        this.mka = ia;
        this.mkd = id;
        this.mks = is;
        this.mn = n;

        //法線を計算，時計回りを表面とする
        const v1 = new THREE.Vector3().subVectors(this.verticies[2], this.verticies[0]);
        const v2 = new THREE.Vector3().subVectors(this.verticies[1], this.verticies[0]);
        this.mnormal = new THREE.Vector3().crossVectors(v1, v2).normalize();
    }

    private det(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3): number {
        return (a.x * b.y * c.z) + (a.y * b.z * c.x) + (a.z * b.x * c.y) - (a.x * b.z * c.y) - (a.y * b.x * c.z) - (a.z * b.y * c.x);
    }

    calcT(e: THREE.Vector3, v: THREE.Vector3): number {
        //(2)の分母を算出する
        const denominator = this.normal.dot(v);
        //(2)の分子を算出する
        const numerator = this.normal.dot(this.verticies[0].sub(e));
        //分母の絶対値が0の場合は交差しない
        if (Math.abs(denominator) < 0.0000001) {
            return -1;
        }
        //分子を分母で割って、tを求める
        const t = numerator / denominator;
        //(ここでreturn t; すると無限平面となる)
        //e0, e1, e2を求める
        const e0 = this.verticies[1].sub(this.verticies[0]);
        const e1 = this.verticies[2].sub(this.verticies[1]);
        const e2 = this.verticies[0].sub(this.verticies[2]);
        //tから交点pを求める
        const i = e.add(v.multiplyScalar(t));
        //iv0, iv1, iv2を求める
        const iv0 = i.sub(this.verticies[0]);
        const iv1 = i.sub(this.verticies[1]);
        const iv2 = i.sub(this.verticies[2]);
        //cross0, cross1, cross2を求める
        const cross0 = iv0.cross(e0);
        const cross1 = iv1.cross(e1);
        const cross2 = iv2.cross(e2);
        //ivとeベクトルの内積（iv0 * e0, iv1 * e1, iv2 * e2）により，dotiv0e0，dotiv1e1，dotiv2e2を算出する．
        const dotcross0n = cross0.dot(this.normal);
        const dotcross1n = cross1.dot(this.normal);
        const dotcross2n = cross2.dot(this.normal);
        //cross0 * n, cross1 * n, cross2 * nが全て正の場合，交点は三角形の内部にある
        if (dotcross0n > 0 && dotcross1n > 0 && dotcross2n > 0) {
            return t;
        }
        //でなければ、交点は三角形の外部にある
        return -1;
    }

    calcNorm(p: THREE.Vector3): THREE.Vector3 {
        return this.normal.clone();
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
