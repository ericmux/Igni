   import {vec2} from "gl-matrix";
   import CollisionArea from "./CollisionArea";
   
   export default class Manifold {
      /**
       * The id of this collision contact.
       */
      id: string;
      /**
       * The first rigid body in the collision.
       */
      bodyA: CollisionArea;
      /**
       * The second rigid body in the collision.
       */
      bodyB: CollisionArea;
      /**
       * The minimum translation vector to resolve penetration, pointing away from bodyA.
       */
      mtv: vec2;
      /**
       * The point of collision shared between bodyA and bodyB.
       */
      point: vec2;
      /**
       * The collision normal, pointing away from bodyA.
       */
      normal: vec2;
           
      
      constructor(bodyA: CollisionArea, bodyB: CollisionArea, mtv: vec2, point: vec2, normal: vec2) {
         this.bodyA = bodyA;
         this.bodyB = bodyB;
         this.mtv = mtv;
         this.point = point;
         this.normal = normal;
      }
      
      resolve() {
          // TO DO: resolve collision.
      }
   }