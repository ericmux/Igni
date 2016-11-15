import {vec2} from "gl-matrix";

// In-place perpendicularization of a vector. (x,y) => (-y, x)
export function perpendicularize(vector :vec2) {
    let x :number = vector[0];
    vector[0] = -vector[1];
    vector[1] = x;
}

export function cross(w: vec2, v: vec2): number {
    return w[0] * v[1] - w[1] * v[0];
}