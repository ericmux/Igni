import {WGLRenderer} from "../rendering/renderers/WGLRenderer";
import {IDictionary} from "../utils/Dictionary";
import {Resource, RESOURCE_TYPE} from "./Loader";
import Sprite from "../rendering/shapes/Sprite";

//  TODO Refactor texture caching in a external API
//  TODO The way it access gl context ACTIVE_TEXTURE, it should be a singleton.. 
export class TextureManager {
    
    protected _textures : IDictionary<string, WGLTexture>;
    private _defaultOpts : TextureOptions;
    
    private _maxTextureImageUnits : number;
    private _texImageUnits : WGLTexture [];
    private _currentImageUnit : number;

    private _imageUnitOverflow : boolean;

    constructor (initialState : IDictionary<string, WGLTexture>) {
        
        if (initialState == null) throw new Error ("TextureManager can't be initialized with null texture Dictionary");

        Sprite.TextureManager = this;

        //  Query for maximum WebGL imeplementation image units supported
        //  Standard mininum is 8
        let queriedUnits = WGLRenderer.gl.getParameter (WGLRenderer.gl.MAX_TEXTURE_IMAGE_UNITS);
        this._maxTextureImageUnits =  queriedUnits > 8 ?
            queriedUnits : 8; 

        //  Texture caching
        this._currentImageUnit = 0;
        this._texImageUnits = Array(this._maxTextureImageUnits);
        for (let i = 0; i < this._maxTextureImageUnits; ++i)
            this._texImageUnits.push (null);


        this._textures = initialState;
        this._defaultOpts = <TextureOptions> {
                              pixelsPerUnit : 10,
                              colorMode : WGLRenderer.gl.RGBA,
                              dataType  : WGLRenderer.gl.UNSIGNED_BYTE,
                              minFilter : WGLRenderer.gl.LINEAR,
                              magFilter : WGLRenderer.gl.LINEAR
                            };
    }

    public updateTextureImageUnit (path : string)  {
        let tex = this._textures.getValue (path);

        //  If texture doesnt have a valid image unit
        if (tex != null && tex.imageUnit == -1) {
            
            //  Reset old texture
            this._texImageUnits[this._currentImageUnit].imageUnit = -1;
            
            tex.imageUnit = this._currentImageUnit;
            this._texImageUnits[this._currentImageUnit] = tex;

            //  Bind correct texture to current image unit
            WGLRenderer.gl.activeTexture (WGLRenderer.gl.TEXTURE0 + this._currentImageUnit);
            WGLRenderer.gl.bindTexture (WGLRenderer.gl.TEXTURE_2D, tex);

            this._currentImageUnit = (this._currentImageUnit + 1) % this._maxTextureImageUnits;
        }
    }

    public getTexture (path : string) : WGLTexture {
        return  this._textures.getValue (path);
    }

    public onLoadResource (args : {resource : Resource, [propName : string] : any}) {

        let resource = args.resource;
    
        if (resource.type != RESOURCE_TYPE.IMAGE || resource.data == null || resource.disposed) {
            return;
        }

        if (this._textures.contains (resource.path)) {
            alert ("You are overrinding texture " + resource.path + " at TextureManager");
        }

        let resourceArgs = resource.args || {};
    
        //  Prefer more specific pixelPerUnit
        let opts = <TextureOptions> {
            pixelsPerUnit : resourceArgs.pixelsPerUnit || this._defaultOpts.pixelsPerUnit,
            colorMode : this._defaultOpts.colorMode,
            dataType : this._defaultOpts.dataType,
            minFilter : this._defaultOpts.minFilter,
            magFilter : this._defaultOpts.magFilter
        };

        this.createTexture (resource.path, resource.data, opts);      
    }

    private createTexture (path : string, image : HTMLImageElement, opts : TextureOptions) : WGLTexture {

        //  If more textures loaded than image units available
        if (this._imageUnitOverflow && this._texImageUnits[this._currentImageUnit] != null) {
            //  Make old texture not have an image unit indice anymore
            this._texImageUnits[this._currentImageUnit].imageUnit = -1;
            //  Maybe not necessary
            this._texImageUnits[this._currentImageUnit] = null;
        }

        //  Activate current texture image unit
        WGLRenderer.gl.activeTexture (WGLRenderer.gl.TEXTURE0 + this._currentImageUnit);

        let texture = WGLRenderer.gl.createTexture ();
        WGLRenderer.gl.bindTexture (WGLRenderer.gl.TEXTURE_2D, texture);
    
        WGLRenderer.gl.pixelStorei (WGLRenderer.gl.UNPACK_FLIP_Y_WEBGL, 1);
        WGLRenderer.gl.texParameteri(WGLRenderer.gl.TEXTURE_2D, WGLRenderer.gl.TEXTURE_WRAP_S, WGLRenderer.gl.CLAMP_TO_EDGE);
        WGLRenderer.gl.texParameteri(WGLRenderer.gl.TEXTURE_2D, WGLRenderer.gl.TEXTURE_WRAP_T, WGLRenderer.gl.CLAMP_TO_EDGE);
        WGLRenderer.gl.texParameteri( WGLRenderer.gl.TEXTURE_2D, WGLRenderer.gl.TEXTURE_MIN_FILTER, opts.minFilter);
        WGLRenderer.gl.texParameteri( WGLRenderer.gl.TEXTURE_2D, WGLRenderer.gl.TEXTURE_MAG_FILTER, opts.magFilter);
        WGLRenderer.gl.texImage2D(WGLRenderer.gl.TEXTURE_2D, 0, opts.colorMode,
                        opts.colorMode, opts.dataType, image);

        let wglTexture = texture as WGLTexture;
        wglTexture.rawWidthPx = image.width;
        wglTexture.rawHeightPx = image.height;
        wglTexture.pixelsPerUnit = opts.pixelsPerUnit;
        wglTexture.imageUnit = this._currentImageUnit;

        this._texImageUnits[this._currentImageUnit] = wglTexture;
        this._textures.add (path, wglTexture);

        this._currentImageUnit = (this._currentImageUnit + 1) % this._maxTextureImageUnits;

        if (this._currentImageUnit == 0) {            
            this._imageUnitOverflow = true;
        }

        return wglTexture;
    } 
}

export interface WGLTexture extends WebGLTexture {
    rawWidthPx : number;
    rawHeightPx : number;
    pixelsPerUnit : number;
    imageUnit : number;
}

export interface TextureOptions {
	pixelsPerUnit : number;
    colorMode : number;
    dataType : number;
    minFilter : number;
    magFilter : number;
}