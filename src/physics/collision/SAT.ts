import {vec2} from "gl-matrix";
import CircularBody from "../bodies/CircularBody";
import RectangularBody from "../bodies/RectangularBody";
import CollisionManifold from "./CollisionManifold";


// The SAT class provides static methods for collision tests between various types of shapes using
// the Separating Axis Theorem.
export default class SAT {
    public static testCollisionPolygonCircle(polygonBody :RectangularBody, circularBody :CircularBody) :CollisionManifold {
        return null;
    }
    public static testCollisionPolygonPolygon(polygonBody :RectangularBody, polygonBody2 :RectangularBody) :CollisionManifold {
        let axes :vec2[] = polygonBody.getWorldAxes().concat(polygonBody2.getWorldAxes());
        let min_overlap :number = Number.POSITIVE_INFINITY;
        let min_normal :vec2 = null;

        for(let axis of axes) {
            let proj1 : [number, number] = polygonBody.project(axis);
            let proj2 : [number, number] = polygonBody2.project(axis);

            // Check if there is no overlap.
            if (proj1[1] < proj2[0] || proj2[1] < proj1[0]) {
                return null;
            }

            let min1min2 : number = Math.abs(proj1[0] - proj2[0]);
            let min1max2 : number = Math.abs(proj1[0] - proj2[1]);
            let max1min2 : number = Math.abs(proj1[1] - proj2[0]);
            let max1max2 : number = Math.abs(proj1[1] - proj2[1]);

            // Overlap is the distance between the two closest points.
            let overlap :number = Math.min(min1min2, min1max2, max1min2, min1max2); 
            if(overlap < min_overlap) {
                min_overlap = overlap;
                min_normal = vec2.normalize(vec2.create(), axis);
            }
        }

        if (!min_normal) {
            return null;
        }

        let penetration_vector :vec2 = vec2.scale(vec2.create(), min_normal, min_overlap);
        
        // TODO(muxa): figure out contact point generation.
        // TODO(muxa): make sure normal points from A to B.
        let contact_point :vec2 = vec2.create();

        return new CollisionManifold(polygonBody, polygonBody2, penetration_vector, contact_point, min_normal);
    }
}