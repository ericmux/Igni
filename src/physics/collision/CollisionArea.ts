import {vec2} from "gl-matrix";

interface CollisionArea {

    position: vec2;
    center: () => vec2;
    axes: () => vec2[];
    momentOfInertia: () => number;
    contains: (point :vec2) => boolean;
}
export default CollisionArea;