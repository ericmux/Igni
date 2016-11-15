import {vec2} from "gl-matrix";
import {perpendicularize} from "../utils/utils";
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
        let closest_point_to_circle :vec2 = polygonBody.extremeVertex(vec2.sub(vec2.create(), circularBody.position, polygonBody.position))[0];
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
        let extremeVertexInA :[vec2,number] = polygonBody.extremeVertex(penetration_vector);
        let extremeVertexInB :[vec2,number] = circularBody.extremeVertex(vec2.negate(vec2.create(), penetration_vector));
        let contact_point :vec2;

        let penetrating_points :vec2[] = [];
        if (polygonBody.contains(extremeVertexInB[0])) penetrating_points.push(extremeVertexInB[0]);
        if (circularBody.contains(extremeVertexInA[0])) penetrating_points.push(extremeVertexInA[0]);

        if(penetrating_points.length === 0) contact_point = extremeVertexInB[0];
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
        
        // Contact point generation through edge clipping.
        // See: http://www.dyn4j.org/2011/11/contact-points-using-clipping/.
        let extremeEdgeInA :[vec2, vec2] = polygonBodyA.extremeEdge(min_normal);
        let extremeEdgeInB :[vec2, vec2] = polygonBodyB.extremeEdge(vec2.negate(vec2.create(), min_normal));

        // let edgeDirectionA :vec2 = vec2.sub(vec2.create(), extremeEdgeInA[1], extremeEdgeInA[0]);
        // vec2.normalize(edgeDirectionA, edgeDirectionA);
        // let edgeDirectionB :vec2 = vec2.sub(vec2.create(), extremeEdgeInB[1], extremeEdgeInB[0]);
        // vec2.normalize(edgeDirectionB, edgeDirectionB);

        // // The reference edge is the one most perpendicular to the contact normal and the other one is the incident edge.
        // let reference_edge :[vec2, vec2];
        // let incident_edge :[vec2, vec2];

        // let reference_direction :vec2;

        // let flipped :boolean;
        // if (Math.abs(vec2.dot(min_normal, edgeDirectionA)) <=
        //     Math.abs(vec2.dot(min_normal, edgeDirectionB))) {
        //     reference_edge = extremeEdgeInA;
        //     reference_direction = edgeDirectionA;
        //     incident_edge = extremeEdgeInB;
        //     flipped = false;
        // } else {
        //     reference_edge = extremeEdgeInB;
        //     reference_direction = edgeDirectionB;
        //     incident_edge = extremeEdgeInA;
        //     flipped = true;
        // }

        // vec2.normalize(reference_direction, reference_direction);

        // // Clip the incident edge by the first vertex of the reference edge.
        // let o1 :number = vec2.dot(reference_direction, reference_edge[0]); 
        // let contact_points :vec2[] = this.clip(incident_edge[0], incident_edge[1], reference_direction, o1);
        // if (contact_points.length < 2){
        //     console.error("Clipping of manifold failed with too few points: " + contact_points.length);
        // }
        
        // // Clip whats left of the incident edge by the second vertex of the reference edge,
        // // but we need to clip in the opposite direction so we flip the direction and offset.
        // let o2 :number = vec2.dot(reference_direction, reference_edge[1]);
        // contact_points = this.clip(contact_points[0], contact_points[1], vec2.negate(vec2.create(), reference_direction), -o2);
        // if (contact_points.length < 2){
        //     console.error("Clipping of manifold failed with too few points: " + contact_points.length);
        // }
        
        // let reference_normal = vec2.clone(reference_direction);
        // perpendicularize(reference_normal);

        // // If we had to flip the incident and reference edges then we need to flip the reference edge normal to clip properly.
        // if (flipped) vec2.negate(reference_normal, reference_normal);
        // // get the largest depth
        // let max :number = vec2.dot(reference_normal, reference_edge[0]);
        // // make sure the final points are not past this maximum
        // if (contact_points.length > 0 && vec2.dot(reference_normal, contact_points[0]) - max < 0.0) {
        //     contact_points.splice(0,1);
        // }
        // if (contact_points.length > 1 && vec2.dot(reference_normal, contact_points[1]) - max < 0.0) {
        //     contact_points.splice(1,1);
        // }

        // contact_points.filter((contact_point :vec2) => {
        //     if(flipped) {
        //         return polygonBodyB.contains(contact_point);
        //     }
        //     return polygonBodyA.contains(contact_point);
        // });

        // Simplified contact point generation.
        let contact_points :vec2[] = []
        if(polygonBodyA.contains(extremeEdgeInB[0])) contact_points.push(extremeEdgeInB[0]);
        if(polygonBodyA.contains(extremeEdgeInB[1])) contact_points.push(extremeEdgeInB[1]);
        if(polygonBodyB.contains(extremeEdgeInA[0])) contact_points.push(extremeEdgeInA[0]);
        if(polygonBodyB.contains(extremeEdgeInA[1])) contact_points.push(extremeEdgeInA[1]);

        // Compute final contact point.
        let contact_point :vec2 = vec2.create();
        if (contact_points.length > 0){
            contact_points.forEach((point :vec2) => {
                vec2.add(contact_point, contact_point, point);
            });
            vec2.scale(contact_point, contact_point, 1.0 / contact_points.length);
        }
        else {
            console.log("This shouldn't ever happen.");
            contact_point = extremeEdgeInB[0];
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

    // Returns a clipped line segment as a list of points.
    // The points will be clipped only if they not are past o along the normal.
    private static clip(v1 :vec2, v2 :vec2, normal :vec2, o :number) :vec2[]{
        let clipped_points :vec2[] = [];
        let d1 :number = vec2.dot(normal, v1) - o;
        let d2 :number = vec2.dot(normal, v2) - o;
        
        if (d1 >= 0.0) clipped_points.push(v1);
        if (d2 >= 0.0) clipped_points.push(v2);

        if (d1 * d2 < 0.0) {
            let edge :vec2 = vec2.sub(vec2.create(), v2, v1);
            let u :number = d1 / (d1 - d2);
            vec2.scale(edge, edge, u);
            vec2.add(edge, edge, v1);
            clipped_points.push(edge);
        }
        return clipped_points;
    }
}