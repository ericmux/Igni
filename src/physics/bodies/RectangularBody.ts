import {vec2, vec3, mat4} from "gl-matrix";
import {perpendicularize} from "../utils/utils";
import Body from "./Body";
import CircularBody from "./CircularBody";  
import RectangularBodyDefinition from "./RectangularBodyDefinition";
import Shape from "../../rendering/shapes/Shape";
import RectangleShape from "../../rendering/shapes/RectangleShape";
import CollisionArea from "../collision/CollisionArea";
import CollisionManifold from "../collision/CollisionManifold";
import CollisionJumpTable from "../collision/CollisionJumpTable";

export default class RectangularBody extends Body {

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
            vec2.fromValues(-this._width/2, this._height/2),
            vec2.fromValues(-this._width/2, -this._height/2),
            vec2.fromValues(this._width/2, -this._height/2)
        ];
        this._axes = [
            vec2.fromValues(1.0,0.0),
            vec2.fromValues(0.0,1.0),
            vec2.fromValues(-1.0,0.0),
            vec2.fromValues(0.0,-1.0)
        ];

        this.shape = new RectangleShape(vec3.fromValues(this.position[0], this.position[1],1.0), this._width, this._height);
    }

    public calculateMoI() :number {
        return (this.mass / 12) * (this._height*this._height + this._width*this._width);
    }

    public contains(point :vec2) :boolean {
        this.updateTransforms();
        let invTransform :mat4 = mat4.invert(mat4.create(), this._transform);
        let pointInBodyCoords3d :vec3 = vec3.transformMat4(vec3.create(), vec3.fromValues(point[0], point[1], 0.0), invTransform);
        let pointInBodyCoords :vec2 = vec2.fromValues(pointInBodyCoords3d[0], pointInBodyCoords3d[1]);

        return !(pointInBodyCoords[0] < -this._width/2 ||
                pointInBodyCoords[0] > this._width/2 || 
                pointInBodyCoords[1] < -this._height/2 || 
                pointInBodyCoords[1] > this._height/2);
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
        this.updateTransforms();
        let world_vertices :vec2[] = [];
        for(let vertex of this._vertices) {
            let world_vertex = vec3.create();
            vec3.transformMat4(world_vertex, vec3.fromValues(vertex[0],vertex[1], 0), this._transform);
            world_vertices.push(vec2.fromValues(world_vertex[0], world_vertex[1]));
        }
        return world_vertices;
    }

    public getWorldAxes() :vec2[] {
        this.updateTransforms();
        this._axes.length = 0;
        for(let i = 0; i < this._vertices.length; i++) {
            let world_axis2d = vec2.sub(vec2.create(), this._vertices[(i+1) % this._vertices.length], this._vertices[i % this._vertices.length]);
            perpendicularize(world_axis2d);
            let world_axis = vec3.fromValues(world_axis2d[0], world_axis2d[1], 0);

            vec3.transformMat4(world_axis, world_axis, this._inverseTranposeTransform);
            vec2.set(world_axis2d, world_axis[0], world_axis[1]);
            vec2.normalize(world_axis2d, world_axis2d);
            this._axes.push(world_axis2d);
        }
        return this._axes;
    }

    public extremeVertex(direction :vec2) {
        let vertices :vec2[] = this.getWorldVertices();
        if (vertices.length === 0) return null;

        let max_dot :number = Number.NEGATIVE_INFINITY;
        let max_vertex :vec2 = null;
        vertices.forEach((vertex :vec2) => {
            let dot :number = vec2.dot(vertex, direction);
            if (dot > max_dot) {
                max_dot = dot;
                max_vertex = vertex;
            }
        });
        return vec2.clone(max_vertex);
    }

    public project(direction :vec2) :[number, number] {
        let world_vertices : vec2[] = this.getWorldVertices();
        let min :number = Number.POSITIVE_INFINITY, max :number = Number.NEGATIVE_INFINITY;
        world_vertices.forEach((vertex : vec2) => {
            let dot_product :number = vec2.dot(vertex, direction);
            max = Math.max(max, dot_product);
            min = Math.min(min, dot_product);
        });
        return [min, max];
    }

}