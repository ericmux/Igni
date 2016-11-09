import RectangleShape from "./RectangleShape";
import {vec2, vec3, vec4, mat4} from "gl-matrix"
import DrawCall from "../shaders/DrawCall";
import {SpriteDrawCall} from "../shaders/SpriteShader";
import {TextureManager} from "../../loader/TextureManager";
import {WGLTexture} from "../../loader/TextureManager";

export default class Sprite extends RectangleShape {
    
    public static _textureManager : TextureManager;
    public static get TextureManager () {
        return Sprite._textureManager;
    }
    public static set TextureManager (manager : TextureManager) {
        Sprite._textureManager = manager;
    }

    private _texturePath : string;
    private _texture : WGLTexture;
    private _maintainAspect : boolean;
    private _spriteDrawCall : SpriteDrawCall;

    constructor (position :vec3, textureName : string, width? : number, height? : number, tintColor? : vec4, maintainAspect? : boolean) {    
        
        let texture = Sprite.TextureManager.getTexture (textureName);

        //  If user did not passed {maintainAspect}, then consider it is true
        if (maintainAspect === undefined || maintainAspect) {
            width = texture.rawWidthPx / texture.pixelsPerUnit;
            height = texture.rawHeightPx / texture.pixelsPerUnit;
        }

        super (position, width || 100, height || 100);

        this._texture = texture;
        this._texturePath = textureName;
        this.color = tintColor || vec4.fromValues (1,1,1,1);
        this._maintainAspect = maintainAspect === undefined || maintainAspect;
        this._spriteDrawCall = new SpriteDrawCall (null, null, null, null, null);
    }

    public toDrawCall (projection : mat4, view : mat4) : DrawCall {
        Sprite.TextureManager.updateTextureImageUnit (this._texturePath);

        this._spriteDrawCall.projection = projection;
        this._spriteDrawCall.view = view;
        this._spriteDrawCall.model = this.modelMatrix;
        this._spriteDrawCall.color = this.color;
        this._spriteDrawCall.texture = this._texture;

        return this._spriteDrawCall; 
    }

}