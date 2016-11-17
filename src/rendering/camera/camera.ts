import {vec2, vec3, mat4, quat} from "gl-matrix";
import Shape from "../shapes/Shape";
import DrawCall from "../shaders/DrawCall";

export default class Camera extends Shape {

    /**
     * This determines how many of the Engine's unitary units fit
     * in the vertical size of the screen. Along with the pixel size 
     * of the screen's vertical, we can make _unitsAlongVerticalScreen
     * always fit on the vertical, for any screen pixel vertical size. 
     */
    private _unitsAlongVerticalScreen :number;
    
    /**
     * Zoom multiplier.
     */
    private _zoom :number;

    /**
     * It represents how many screen pixels fit on a unit.
     * It should always be the canvasHeight/this._unitsAlongVerticalScreen
     */
    private _pixelsToUnits :number;

    /**
     * The Camera has been initialized when it has 
     */
    private _initialized : boolean;

    constructor (position :vec2, zoom? :number, canvasHeightPx? :number) {
        super(position);

        this._unitsAlongVerticalScreen = 10;
        
        this._zoom = zoom || 1;

        // Unitary for correct use at {setScreenHeight} at first run time
        this._pixelsToUnits = 1;

        if (canvasHeightPx !== undefined) {
            this.setScreenHeight (canvasHeightPx);   
            this.setPosition (position);
        }
    }

    /**
     * For Camera, use setZoom instead. Maybe Camera should not inherit from Shape...
     */
    public setScale (s : vec2) {
        return;
    }

    /**
     * Set camera's pixels to unit scale, using external height in pixels.
     */
    public setScreenHeight (heightPx :number) {                

        // Avoid losing pixelToUnits information due to height being 0
        if (heightPx === 0) return;

        // We have to do this so the position passed to contructor is 
        // correctly applied
        if (! this._initialized) {
            this.position = vec2.negate (this.position, this.position);    
            this._initialized = true;
        }

        let oldPixelToUnits = this._pixelsToUnits;
        this._pixelsToUnits = heightPx / this._unitsAlongVerticalScreen;

        this.position = vec2.scale (this.position, this.position, this._pixelsToUnits / oldPixelToUnits);

        this.setZoom (this._zoom);
    }

    /**
     * Set zoom multiplier.
     * @param newZoom If it is less than zero, it is clamped to zero.
     */
    public setZoom (newZoom : number) {
        if (newZoom < 0) newZoom = 0;

        this._zoom = newZoom;
        let s = this._zoom * this._pixelsToUnits;

        this.scale = vec3.fromValues(s, s, 1);
    }

    public incrementZoom (inc : number) {
        this.setZoom (this._zoom + inc);
    }

    public setPosition(newPos : vec2) {    
        newPos = vec2.negate (newPos, newPos);
        newPos = vec2.scale (newPos, newPos, this._pixelsToUnits);
        
        this.position = newPos;
    }

    public translate(v : vec2) {
        v = vec2.negate (v, v);
        v = vec2.scale (v, v, this._pixelsToUnits);

        vec2.add(this.position, this.position, v);
    }

    public toDrawCall(projection: mat4, view : mat4) :DrawCall {
        return null;
    }

    public followShapeViewMatrix () : mat4 {
        return this.modelMatrix;
    }
}