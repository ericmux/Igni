import ColorSquare from "./Square";
import {vec2, vec3, vec4, mat4} from "gl-matrix"
import DrawCall from "../shaders/DrawCall";
import {SpriteDrawCall} from "../shaders/SpriteShader";
import TextureManager from "../../loader/TextureManager";
import {WGLTexture} from "../../loader/TextureManager";

export default class Sprite extends ColorSquare {
    
    public static _textureManager : TextureManager;
    public static get TextureManager () {
        return Sprite._textureManager;
    }
    public static set TextureManager (manager : TextureManager) {
        Sprite._textureManager = manager;
    }

    private _texturePath : string;
    private _uv : vec2[];
    private _texture : WGLTexture;
    private _maintainAspect : boolean; 

    constructor (position :vec3, width : number, height : number, textureName : string, tintColor : vec4) {    
        super (position, width, height);
        
        this._texture = Sprite.TextureManager.getTexture (textureName);
        this._texturePath = textureName;
        this.color = tintColor;
        this._maintainAspect = true;

        this._uv = [];
        this._uv.push (vec2.fromValues (0.0, 0.0));
        this._uv.push (vec2.fromValues (0.0, 1.0));
        this._uv.push (vec2.fromValues (1.0, 1.0));
        this._uv.push (vec2.fromValues (1.0, 0.0));
    }

    public toDrawCall (projection : mat4, view : mat4) : DrawCall {
        //  TODO Refactor engine so DrawCalls are possible just after loading resources
        if (this._texture == null) {
            this._texture = Sprite.TextureManager.getTexture (this._texturePath);
            
            if (this._texture != null && this._maintainAspect) {
                this.width = this._texture.rawWidthPx / this._texture.pixelsPerUnit;
                this.height = this._texture.rawHeightPx / this._texture.pixelsPerUnit;
            }
        }

        //  TODO Make it use a default all white texture instead of returning
        if (this._texture == null) return;

        return new SpriteDrawCall (projection,
                                        view,
                                        this.modelMatrix,
                                        this.color,
                                        this.calculateVertices(),
                                        this._uv,
                                        this._texture);
    }

}