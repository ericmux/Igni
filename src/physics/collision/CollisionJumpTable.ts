import {vec2} from "gl-matrix";
import CircularBody from "../bodies/CircularBody";
import RectangularBody from "../bodies/RectangularBody";
import CollisionManifold from "./CollisionManifold";
import SAT from "./SAT";

export default class CollisionJumpTable {
    public static collideCircleCircle(out :CollisionManifold, bodyA :CircularBody, bodyB :CircularBody) :boolean {
            let max_distance : number = bodyA.radius + bodyB.radius;
            let posA : vec2 = vec2.clone(bodyA.position);
            let posB : vec2 = vec2.clone(bodyB.position);
            let distance : vec2 = vec2.sub(vec2.create(), posB, posA);

            if (vec2.sqrLen(distance) > max_distance*max_distance) {
                return false;
            }

            let normal :vec2 = vec2.normalize(vec2.create(), distance);
            let penetration_vector :vec2 = vec2.scale(vec2.create(), normal, max_distance - vec2.len(distance));

            let contact_point :vec2 = vec2.scale(vec2.create(), distance, bodyA.radius/(bodyA.radius + bodyB.radius));
            contact_point = vec2.add(vec2.create(), contact_point, posA);

            out.bodyA = bodyA;
            out.bodyB = bodyB;
            out.mtv = penetration_vector;
            out.point = contact_point;
            out.normal = normal;

            return true;
    }

    public static collideCircleRectangle(out :CollisionManifold, bodyA :CircularBody, bodyB :RectangularBody) :boolean {
        return SAT.testCollisionPolygonCircle(out, bodyB, bodyA);
    }

    public static collideRectangleRectangle(out :CollisionManifold, bodyA :RectangularBody, bodyB :RectangularBody) :boolean {
        return SAT.testCollisionPolygonPolygon(out, bodyA, bodyB);
    }
}