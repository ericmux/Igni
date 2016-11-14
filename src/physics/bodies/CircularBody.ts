import {vec2, vec3} from "gl-matrix";
import Body from "./Body";
import RectangularBody from "./RectangularBody";
import CircularBodyDefinition from "./CircularBodyDefinition";
import Shape from "../../rendering/shapes/Shape";
import CircleShape from "../../rendering/shapes/CircleShape";
import CollisionArea from "../collision/CollisionArea";
import CollisionManifold from "../collision/CollisionManifold";
import CollisionJumpTable from "../collision/CollisionJumpTable";

export default class CircularBody extends Body {

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

        this.shape = new CircleShape(vec3.fromValues(this.position[0], this.position[1],1.0), this._radius);
    }

    public calculateMoI() :number {
        return 0.5 * this.mass * Math.pow(this._radius, 2);
    }

    public contains(point :vec2) :boolean {
        return vec2.sqrLen(vec2.sub(vec2.create(), point, this.position)) <= this._radius*this._radius;
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
        return null;
    }

    public getWorldAxes() :vec2[] {
        // circles have an infinite amount of axes.
        return null;
    }

    public extremeVertex(direction :vec2) :[vec2, number] {
        return [vec2.scaleAndAdd(vec2.create(), this.position, vec2.normalize(vec2.create(), direction), this._radius), -1];
    }

    public extremeEdge(direction :vec2) :[vec2, vec2] {
        // circles have no edges.
        return null;
    }

    public project(direction :vec2) :[number, number] {
        let dot_product :number = vec2.dot(this.position, direction);
        return [dot_product - this._radius, dot_product + this._radius];
    }


    public get radius() :number {
        return this._radius;
    }

}