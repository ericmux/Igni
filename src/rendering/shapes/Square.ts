import Shape from "./Shape";
import {vec2, vec3, vec4, mat4} from "gl-matrix"
import DrawCall from "../shaders/DrawCall";
import {FlatColorDrawCall} from "../shaders/FlatColorShader";

export default class ColorSquare extends Shape {
    private _width  : number;
    private _height : number;
    private _color  : vec4;

    constructor (position :vec3, width : number, height : number) {
        super(position);
        this._color = vec4.fromValues (1.0, 0.0, 0.0, 1.0);
        this._width = width;
        this._height = height;
    }

    protected calculateVertices () : vec4[] {
        let vertices :vec4[] = [];
        let res : vec2 = vec2.create ();

        vec2.add (res, vec2.create(), [-this._width/2.0, -this._height/2.0]);  
        vertices.push(vec4.fromValues(res[0], res[1], 0.0, 1.0));

        vec2.add (res, res, [0, this._height]);  
        vertices.push(vec4.fromValues(res[0], res[1], 0.0, 1.0));

        vec2.add (res, res, [this._width, 0]);  
        vertices.push(vec4.fromValues(res[0], res[1], 0.0, 1.0));

        vec2.add (res, res, [0, -this._height]);  
        vertices.push(vec4.fromValues(res[0], res[1], 0.0, 1.0));

        return vertices;
    }

    public toDrawCall (projection : mat4, view : mat4) : DrawCall {
            return new FlatColorDrawCall (projection,
                                          view,
                                          this.modelMatrix,
                                          this._color,
                                          this.calculateVertices());
    }


    get height () :number {
        return this._height;
    }

    set height (newHeight :number) {
        this._height = newHeight;
    }

    get width () {
        return this._width;
    }

    set width (newWidth :number) {
        this._width = newWidth;
    }

    get color () :vec4 {
        return this._color;
    }

    set color (color :vec4) {
        this._color = color;
    }
}