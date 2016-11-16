import {vec2} from "gl-matrix";
import Body from "../bodies/Body";
import CollisionManifold from "./CollisionManifold";

interface CollisionArea {
    position: vec2;
    contains: (point :vec2) => boolean;
    collide: (out :CollisionManifold, body :Body) => boolean;
    getWorldAxes: () => vec2[];
    extremeVertex: (direction :vec2) => [vec2, number];
    extremeEdge: (direction :vec2) => [vec2, vec2];
    project: (direction :vec2) => [number, number];
    getWorldVertices: () => vec2[];
}
export default CollisionArea;