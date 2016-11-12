   import {vec2, vec3, vec4} from "gl-matrix";
   import Body from "../bodies/Body";
   import {Renderable} from "../../rendering/shaders/DrawCall";
   import CircleShape from "../../rendering/shapes/CircleShape";
   import LineShape from "../../rendering/shapes/LineShape";

   export default class CollisionManifold {
      /**
       * The id of this collision contact.
       */
      id: string;
      /**
       * The first rigid body in the collision.
       */
      bodyA: Body;
      /**
       * The second rigid body in the collision.
       */
      bodyB: Body;
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
           
      
      constructor(bodyA :Body, bodyB :Body, mtv: vec2, point: vec2, normal: vec2) {
         this.bodyA = bodyA;
         this.bodyB = bodyB;
         this.mtv = mtv;
         this.point = point;
         this.normal = normal;
      }
      
      resolve() {
          // TO DO: resolve collision.
      }

      public debugRenderables (out : Renderable[]) : Renderable[] {
         out.push (this.bodyA.getLatestShape ());
         out.push (this.bodyB.getLatestShape ());
         out.push (new CircleShape (vec3.fromValues (this.point[0], this.point[1], 0), 3));

         //  begin of mtv and normal vectors
         let begin = vec3.fromValues (this.bodyA.position[0], this.bodyA.position[1], 0);
         
         //  mtv debug
         let mtv = vec3.fromValues (this.mtv[0], this.mtv[1], 0);
         let end = vec3.add (vec3.create (), begin, mtv);
         out.push (new LineShape (begin, end));

         //  normal debug
         let normal = vec3.fromValues (this.normal[0], this.normal[1], 0);
         end = vec3.add (vec3.create (), begin, normal);
         out.push (new LineShape (begin, end, vec4.fromValues(0,1,1,1)));

         return out; 
      }
   }