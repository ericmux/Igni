import {vec2} from "gl-matrix";
import Body from "../bodies/Body";
import CollisionManifold from "./CollisionManifold";

interface CollisionArea {
    position: vec2;
    center: () => vec2;
    contains: (point :vec2) => boolean;
    collide: (body :Body) => CollisionManifold;
}
export default CollisionArea;