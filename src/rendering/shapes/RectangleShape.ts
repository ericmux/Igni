import Shape from "./Shape";
import {vec2, vec3, vec4, mat4} from "gl-matrix"
import DrawCall from "../shaders/DrawCall";
import {FlatColorDrawCall} from "../shaders/FlatColorShader";

export default class RectangleShape extends Shape {
    
    private _width  : number;
    private _height : number;
    private _color  : vec4;
    private _flatColorDrawCall : FlatColorDrawCall;

    constructor (position :vec3, width : number, height : number) {
        super(position, vec3.fromValues (width/2, height/2, 1));
        
        this._color = vec4.fromValues (1.0, 0.0, 0.0, 1.0);
        this._width = width;
        this._height = height;

        this._flatColorDrawCall = new FlatColorDrawCall (null, null, null, null);
    }

    public toDrawCall (projection : mat4, view : mat4) : DrawCall {
            
        this._flatColorDrawCall.projection = projection;
        this._flatColorDrawCall.view = view;
        this._flatColorDrawCall.model = this.modelMatrix;
        this._flatColorDrawCall.color = this._color;

        return this._flatColorDrawCall;
    }


    get height () :number {
        return this._height;
    }

    /**
     * @deprecated Should not try to change vertices. Instead, use {@link Shape.setScale}
     */
    set height (newHeight :number) {
        // this._height = newHeight;
    }

    get width () {
        return this._width;
    }

    /**
     * @deprecated Should not try to change vertices. Instead, use {@link Shape.setScale}
     */
    set width (newWidth :number) {
        // this._width = newWidth;
    }

    get color () :vec4 {
        return this._color;
    }

    set color (color :vec4) {
        this._color = color;
    }
}