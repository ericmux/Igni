import {vec2, vec3} from "gl-matrix";
import Body from "./Body";
import RectangularBody from "./RectangularBody";
import CircularBodyDefinition from "./CircularBodyDefinition";
import Shape from "../../rendering/shapes/Shape";
import Circle from "../../rendering/shapes/Circle";
import CollisionArea from "../collision/CollisionArea";
import CollisionManifold from "../collision/CollisionManifold";
import CollisionJumpTable from "../collision/CollisionJumpTable";

// TO DO: Make all constructors take body definitions. BODY FACTORY.

export default class CircularBody extends Body implements CollisionArea {

    private _radius :number;

    constructor(bodyDef :CircularBodyDefinition) {
        super(bodyDef);
        bodyDef.radius = bodyDef.radius || 0.0;

        this._radius = bodyDef.radius;
        this.momentOfInertia = this.calculateMoI();
        if (this.momentOfInertia == 0.0) {
            this._invMomentOfInertia = 0.0;
        } else {
            this._invMomentOfInertia = 1 / this.momentOfInertia;
        }
        this._angularAcceleration = this.torque * this._invMomentOfInertia;
        this._oldAngularAcceleration = this._angularAcceleration;

        this.shape = new Circle(vec3.fromValues(this.position[0], this.position[1],1.0), this._radius);
    }

    public calculateMoI() :number {
        return 0.5 * this.mass * Math.pow(this._radius, 2);
    }

    public center() {
        return this.position;
    }

    public contains(point :vec2) :boolean {
        return vec2.sqrLen(vec2.sub(vec2.create(), point, this.center())) <= this._radius*this._radius;
    }

    public collide(body :Body) :CollisionManifold {
        if(body instanceof CircularBody) {
            return CollisionJumpTable.collideCircleCircle(this, body);
        } 
        if(body instanceof RectangularBody) {
            return CollisionJumpTable.collideCircleRectangle(this, body);
        }
        return null;
    }


    public getWorldVertices() :vec2[] {
        // circles have no vertices.
        return [];
    }

    public axes() :vec2[] {
        return [];
    }

    public extremeVertex(direction :vec2) {
        return vec2.create();
    }

    public project(direction :vec2) :[vec2, vec2] {
        return [vec2.create(), vec2.create()];
    }


    public get radius() :number {
        return this._radius;
    }

}