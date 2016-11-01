import {vec2} from "gl-matrix";
import CircularBody from "../bodies/CircularBody";
import RectangularBody from "../bodies/RectangularBody";
import CollisionManifold from "./CollisionManifold";

export default class CollisionJumpTable {
    public static collideCircleCircle(bodyA :CircularBody, bodyB :CircularBody) :CollisionManifold {
        return new CollisionManifold(bodyA, bodyB, vec2.create(), vec2.create(), vec2.create());
    }

    public static collideCircleRectangle(bodyA :CircularBody, bodyB :RectangularBody) :CollisionManifold {
        return new CollisionManifold(bodyA, bodyB, vec2.create(), vec2.create(), vec2.create());
    }

    public static collideRectangleRectangle(bodyA :RectangularBody, bodyB :RectangularBody) :CollisionManifold {
        return new CollisionManifold(bodyA, bodyB, vec2.create(), vec2.create(), vec2.create());
    }
}