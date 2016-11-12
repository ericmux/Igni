import {vec2} from "gl-matrix";
import Body from "../bodies/Body";
import CircularBody from "../bodies/CircularBody";
import RectangularBody from "../bodies/RectangularBody";
import CollisionManifold from "./CollisionManifold";

// The SAT class provides static methods for collision tests between various types of shapes using
// the Separating Axis Theorem.
export default class SAT {
    public static testCollisionPolygonCircle(polygonBody :RectangularBody, circularBody :CircularBody) :CollisionManifold {
        let axes :vec2[] = polygonBody.getWorldAxes(); 
        
        // Extra axis from the vertex-based voronoi regions.
        let closest_point_to_circle :vec2 = polygonBody.extremeVertex(vec2.sub(vec2.create(), circularBody.position, polygonBody.position));
        let point_axis :vec2 = vec2.sub(vec2.create(), circularBody.position, closest_point_to_circle);
        vec2.normalize(point_axis, point_axis);

        axes.push(point_axis);

        let overlap_normal :[number, vec2] = this.testAxes(polygonBody, circularBody, axes);
        if(!overlap_normal) return null;
        
        let min_overlap :number = overlap_normal[0];
        let min_normal :vec2 = overlap_normal[1];

        let penetration_vector :vec2 = vec2.scale(vec2.create(), min_normal, min_overlap);
        let fromAtoB :vec2 = vec2.sub(vec2.create(), circularBody.position, polygonBody.position);
        if (vec2.dot(fromAtoB, penetration_vector) < 0) {
            vec2.negate(penetration_vector, penetration_vector);
            vec2.negate(min_normal, min_normal);
        }
        
        // Contact point generation.
        let extremeVertexInA :vec2 = polygonBody.extremeVertex(penetration_vector);
        let extremeVertexInB :vec2 = circularBody.extremeVertex(vec2.negate(vec2.create(), penetration_vector));
        let contact_point :vec2;

        let penetrating_points :vec2[] = [];
        if (polygonBody.contains(extremeVertexInB)) penetrating_points.push(extremeVertexInB);
        if (circularBody.contains(extremeVertexInA)) penetrating_points.push(extremeVertexInA);

        if(penetrating_points.length === 0) contact_point = extremeVertexInB;
        else if(penetrating_points.length === 1) contact_point = penetrating_points[0];
        else {
            contact_point = vec2.add(vec2.create(), penetrating_points[0], penetrating_points[1]);
            vec2.scale(contact_point, contact_point, 0.5);
        }

        return new CollisionManifold(polygonBody, circularBody, penetration_vector, contact_point, min_normal);
    }
    public static testCollisionPolygonPolygon(polygonBodyA :RectangularBody, polygonBodyB :RectangularBody) :CollisionManifold {
        let axes :vec2[] = polygonBodyA.getWorldAxes().concat(polygonBodyB.getWorldAxes());

        let overlap_normal :[number, vec2] = this.testAxes(polygonBodyA, polygonBodyB, axes);
        if(!overlap_normal) return null;

        let min_overlap :number = overlap_normal[0];
        let min_normal :vec2 = overlap_normal[1];

        let penetration_vector :vec2 = vec2.scale(vec2.create(), min_normal, min_overlap);
        let fromAtoB :vec2 = vec2.sub(vec2.create(), polygonBodyB.position, polygonBodyA.position);
        if (vec2.dot(fromAtoB, penetration_vector) < 0) {
            vec2.negate(penetration_vector, penetration_vector);
            vec2.negate(min_normal, min_normal);
        }
        
        // Contact point generation.
        let extremeVertexInA :vec2 = polygonBodyA.extremeVertex(penetration_vector);
        let extremeVertexInB :vec2 = polygonBodyB.extremeVertex(vec2.negate(vec2.create(), penetration_vector));
        let contact_point :vec2;

        let penetrating_points :vec2[] = [];
        if (polygonBodyA.contains(extremeVertexInB)) penetrating_points.push(extremeVertexInB);
        if (polygonBodyB.contains(extremeVertexInA)) penetrating_points.push(extremeVertexInA);

        if(penetrating_points.length === 0) contact_point = extremeVertexInB;
        else if(penetrating_points.length === 1) contact_point = penetrating_points[0];
        else {
            contact_point = vec2.add(vec2.create(), penetrating_points[0], penetrating_points[1]);
            vec2.scale(contact_point, contact_point, 0.5);
        }

        return new CollisionManifold(polygonBodyA, polygonBodyB, penetration_vector, contact_point, min_normal);
    }

    // return null or a pair with [minimum overlap, minimum normal].
    private static testAxes(bodyA :Body, bodyB :Body, axes :vec2[]) :[number, vec2]{
        let min_overlap :number = Number.POSITIVE_INFINITY;
        let min_normal :vec2 = null;

        for(let axis of axes) {
            let proj1 : [number, number] = bodyA.project(axis);
            let proj2 : [number, number] = bodyB.project(axis);

            // Check if there is no overlap.
            if (proj1[1] < proj2[0] || proj2[1] < proj1[0]) {
                return null;
            }

            // Overlap is the distance between the two closest points.
            let overlap :number;

            if((proj2[0] >= proj1[0] && proj2[0] <= proj1[1]) &&
               (proj2[1] >= proj1[0] && proj2[1] <= proj1[1])) {
                // Both endpoints are inside 1 (containment).
                overlap = proj2[1] - proj2[0] + Math.min(Math.abs(proj2[0] - proj1[0]), Math.abs(proj2[1] - proj1[1]));
            }
            else if (proj2[0] < proj1[0] && proj2[1] > proj1[1]) {
                // Both endpoints are outside 1, on opposite sides (containment).
                overlap = proj1[1] - proj1[0] + Math.min(Math.abs(proj2[0] - proj1[0]), Math.abs(proj2[1] - proj1[1]));
            }
            else {
                // Average case overlap.
                // 2's endpoint is inside 1.
                let min1max2: number = Math.abs(proj2[1] - proj1[0]);

                // 2's start point is inside 1.
                let max1min2: number = Math.abs(proj1[1] - proj2[0]);

                overlap = Math.min(min1max2, max1min2);
            }

            if(overlap < min_overlap) {
                min_overlap = overlap;
                min_normal = vec2.normalize(vec2.create(), axis);
            }
        }
        return [min_overlap, min_normal];
    }
}