import {vec2, vec3, mat4} from "gl-matrix";
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
    private _vertices :vec2[];
    private _axes :vec2[];

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

        this._vertices = [
            vec2.fromValues(this._width/2, this._height/2),
            vec2.fromValues(this._width/2, -this._height/2),
            vec2.fromValues(-this._width/2, this._height/2),
            vec2.fromValues(-this._width/2, -this._height/2)
        ];
        this._axes = [];

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


    public getWorldVertices() :vec2[] {
        let world_vertices :vec2[] = [];
        for(let vertex of this._vertices) {
            let world_vertex = vec3.create();
            vec3.transformMat4(world_vertex, vec3.fromValues(vertex[0],vertex[1], 0), this._transform);
            world_vertices.push(vec2.fromValues(world_vertex[0], world_vertex[1]));
        }
        return world_vertices;
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

}