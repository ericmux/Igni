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


        let oldPixelToUnits = this._pixelsToUnits;
        this._pixelsToUnits = this._unitsAlongVerticalScreen / heightPx;

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
        let s = this._pixelsToUnits/this._zoom;

        this.scale = vec3.fromValues(s, s, 1);
    }

    public incrementZoom (inc : number) {
        this.setZoom (this._zoom + inc);
    }

    public toDrawCall(projection: mat4, view : mat4) :DrawCall {
        return null;
    }
}