import {vec2} from "gl-matrix";
import CircularBody from "../bodies/CircularBody";
import RectangularBody from "../bodies/RectangularBody";
import CollisionManifold from "./CollisionManifold";

export default class CollisionJumpTable {
    public static collideCircleCircle(bodyA :CircularBody, bodyB :CircularBody) :CollisionManifold {

            let max_distance : number = bodyA.radius + bodyB.radius;
            let posA : vec2 = vec2.clone(bodyA.position);
            let posB : vec2 = vec2.clone(bodyB.position);
            let distance : vec2 = vec2.sub(vec2.create(), posB, posA);

            if (vec2.sqrLen(distance) > max_distance*max_distance) {
                return null;
            }

            let normal :vec2 = vec2.normalize(vec2.create(), distance);
            let penetration_vector :vec2 = vec2.scale(vec2.create(), normal, max_distance - vec2.len(distance));

            let contact_point :vec2 = vec2.scale(vec2.create(), distance, bodyA.radius/(bodyA.radius + bodyB.radius));
            contact_point = vec2.add(vec2.create(), contact_point, posA);

            return new CollisionManifold(bodyA, bodyB, penetration_vector, contact_point, normal);
    }

    public static collideCircleRectangle(bodyA :CircularBody, bodyB :RectangularBody) :CollisionManifold {
        return null;
    }

    public static collideRectangleRectangle(bodyA :RectangularBody, bodyB :RectangularBody) :CollisionManifold {
        return null;
    }
}