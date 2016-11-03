import {vec2, vec3} from "gl-matrix";
import Body from "./Body";
import CircularBody from "./CircularBody";  
import RectangularBodyDefinition from "./RectangularBodyDefinition";
import Shape from "../../rendering/shapes/Shape";
import Square from "../../rendering/shapes/Square";
import CollisionArea from "../collision/CollisionArea";
import CollisionManifold from "../collision/CollisionManifold";
import CollisionJumpTable from "../collision/CollisionJumpTable";

export default class RectangularBody extends Body implements CollisionArea {

    private _width :number;
    private _height :number;

    constructor(bodyDef :RectangularBodyDefinition) {
        super(bodyDef);
        bodyDef.width = bodyDef.width || 0.0;
        bodyDef.height = bodyDef.height || 0.0;

        this._width = bodyDef.width;
        this._height = bodyDef.height;
        this.momentOfInertia = this.calculateMoI();
        if (this.momentOfInertia == 0.0) {
            this._invMomentOfInertia = 0.0;
        } else {
            this._invMomentOfInertia = 1 / this.momentOfInertia;
        }
        this._angularAcceleration = this.torque * this._invMomentOfInertia;
        this._oldAngularAcceleration = this._angularAcceleration;

        this.shape = new Square(vec3.fromValues(this.position[0], this.position[1],1.0), this._width, this._height);
    }

    public calculateMoI() :number {
        return (this.mass / 12) * (this._height*this._height + this._width*this._width);
    }

    public center() {
        return this.position;
    }

    public contains(point :vec2) :boolean {
        return (point[0] >= this.position[0] - this._width/2 && 
                point[0] <= this.position[0] + this._width/2 && 
                point[1] >= this.position[1] - this._height/2 && 
                point[1] <= this.position[1] + this._height/2);
    }

    public collide(body :Body) :CollisionManifold {
        if(body instanceof CircularBody) {
            return CollisionJumpTable.collideCircleRectangle(body, this);
        } 
        if(body instanceof RectangularBody) {
            return CollisionJumpTable.collideRectangleRectangle(this, body);
        }
        return null;
    }

}