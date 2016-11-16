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
           

      private debugContactPoint: CircleShape;
      private debugNormal: LineShape;
      private debugMtv: LineShape; 
      
      constructor(bodyA :Body, bodyB :Body, mtv: vec2, point: vec2, normal: vec2) {
         this.bodyA = bodyA;
         this.bodyB = bodyB;
         this.mtv = mtv;
         this.point = point;
         this.normal = normal;

         this.debugContactPoint = new CircleShape (vec2.create(), 3);
         this.debugNormal = new LineShape (vec2.create (), vec2.create (), vec4.fromValues(0,0,0,1));
         this.debugMtv = new LineShape (vec2.create (), vec2.create ());
      }

      public debugRenderables (out : Renderable[]) : Renderable[] {
         out.push (this.bodyA.getLatestPhysicalShape ());
         out.push (this.bodyB.getLatestPhysicalShape ());

         this.debugContactPoint.setPosition (this.point);
         out.push (this.debugContactPoint);

         //  begin of mtv and normal vectors
         let normalScale = 10;
         
         //  Vector to used to minimize garbage generation
         //  And also represents line end points (for both mtv and normal)
         let end = vec2.create ();

         //  Now 'end' is mtv end point. Set mtv line values
         vec2.add (end, this.bodyA.position, this.mtv);
         this.debugMtv.setLine (this.bodyA.position, end);
         
         //  Hold value for who is bigger
         let isNormalBiggerThanMTV = normalScale > vec2.dist (this.bodyA.position, end);

         //  Now 'end' is normal end point. Set normal line values
         vec2.scaleAndAdd(end, this.bodyA.position, this.normal, normalScale);
         this.debugNormal.setLine (this.bodyA.position, end);

         //  Order mtv and normal accordingly to who is bigger
         if (isNormalBiggerThanMTV) {
            out.push (this.debugNormal);
            out.push (this.debugMtv);
         }
         else {
            out.push (this.debugMtv);
            out.push (this.debugNormal);
         }
         
         return out; 
      }
   }