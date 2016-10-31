import ColorSquare from "./Square";
import {vec2, vec3, vec4, mat4} from "gl-matrix"
import DrawCall from "../shaders/DrawCall";
import {SpriteDrawCall} from "../shaders/SpriteShader";

export default class Sprite extends ColorSquare {
    
    private _uv : vec2[];
    private _texture : WebGLTexture;

    constructor (position :vec3, width : number, height : number, texture : WebGLTexture, tintColor : vec4) {
        super (position, width, height);
        
        this._texture = texture;
        this.color = tintColor;
        this._uv = [];
        this._uv.push (vec2.fromValues (0.0, 0.0));
        this._uv.push (vec2.fromValues (0.0, 1.0));
        this._uv.push (vec2.fromValues (1.0, 1.0));
        this._uv.push (vec2.fromValues (1.0, 0.0));
    }

    public toDrawCall (projection : mat4, view : mat4) : DrawCall {
            return new SpriteDrawCall (projection,
                                          view,
                                          this.modelMatrix,
                                          this.color,
                                          this.calculateVertices(),
                                          this._uv,
                                          this._texture);
    }

}