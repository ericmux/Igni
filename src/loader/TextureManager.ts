import {WGLRenderer} from "../rendering/renderers/WGLRenderer";
import {IDictionary} from "../utils/Dictionary";
import {Resource, ILoader} from "./Loader";
import Sprite from "../rendering/shapes/Sprite";

export default class TextureManager {
    
    protected _loader : ILoader;
    protected _textures : IDictionary<string, WGLTexture>;
    private _loaded : boolean;
    private _defaultOpts : TextureOptions;

    constructor (initialState : IDictionary<string, WGLTexture>, loader : ILoader) {
        if (initialState == null) throw new Error ("TextureManager can't be initialized with null Dictionary");
        
        Sprite.TextureManager = this;

        this._loader = loader;
        this._loaded = false;
        this._textures = initialState;
        this._defaultOpts = <TextureOptions> {
                              pixelsPerUnit : 10,
                              colorMode : WGLRenderer.gl.RGBA,
                              dataType  : WGLRenderer.gl.UNSIGNED_BYTE,
                              minFilter : WGLRenderer.gl.LINEAR,
                              magFilter : WGLRenderer.gl.LINEAR
                            };
    }

    public getTexture (path : string) : WGLTexture {
        return  this._textures.getValue (path);
        
    }

    public queueResource (path : string, opts? : TextureOptions) {
        if (this._textures.contains (path))
            alert ("You are overrinding texture " + path + " at TextureManager");

        opts = opts || this._defaultOpts;

        this._loader.enqueue (path);
    }

    public loadTextures (opts? : TextureOptions) {
        let self = this;

        opts = opts || this._defaultOpts;

        this._loader.onComplete ( (resources : {[propName : string] : Resource}) : void => {
            
            for (var prop in resources) {
                self.createTexture (prop, resources[prop].data, opts);
            }
        });

        this._loader.load ();
    }

    private createTexture (path : string, image : HTMLImageElement, opts : TextureOptions) : WebGLTexture {
        let texture = WGLRenderer.gl.createTexture ();
        WGLRenderer.gl.bindTexture (WGLRenderer.gl.TEXTURE_2D, texture);
    
        WGLRenderer.gl.pixelStorei (WGLRenderer.gl.UNPACK_FLIP_Y_WEBGL, 1);
        WGLRenderer.gl.texImage2D(WGLRenderer.gl.TEXTURE_2D, 0, opts.colorMode,
                        opts.colorMode, opts.dataType, image);
        WGLRenderer.gl.texParameteri(WGLRenderer.gl.TEXTURE_2D, WGLRenderer.gl.TEXTURE_WRAP_S, WGLRenderer.gl.CLAMP_TO_EDGE);
        WGLRenderer.gl.texParameteri(WGLRenderer.gl.TEXTURE_2D, WGLRenderer.gl.TEXTURE_WRAP_T, WGLRenderer.gl.CLAMP_TO_EDGE);
        WGLRenderer.gl.texParameteri( WGLRenderer.gl.TEXTURE_2D, WGLRenderer.gl.TEXTURE_MIN_FILTER, opts.minFilter);
        WGLRenderer.gl.texParameteri( WGLRenderer.gl.TEXTURE_2D, WGLRenderer.gl.TEXTURE_MAG_FILTER, opts.magFilter);

        let wglTexture = texture as WGLTexture;
        wglTexture.rawWidthPx = image.width;
        wglTexture.rawHeightPx = image.height;
        wglTexture.pixelsPerUnit = opts.pixelsPerUnit;

        this._textures.add (path, wglTexture);
        return texture;
    } 
}

export interface WGLTexture extends WebGLTexture {
    rawWidthPx : number;
    rawHeightPx : number;
    pixelsPerUnit : number;
}

export interface TextureOptions {
	pixelsPerUnit : number;
    colorMode : number;
    dataType : number;
    minFilter : number;
    magFilter : number;
}