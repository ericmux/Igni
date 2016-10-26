import {vec2} from "gl-matrix";

interface CollisionArea {

    position: vec2;
    center: () => vec2;
    contains: (point :vec2) => boolean;
}
export default CollisionArea;