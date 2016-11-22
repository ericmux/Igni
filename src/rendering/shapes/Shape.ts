import {vec2, vec3, mat4, quat} from "gl-matrix";
import {DrawCall, Renderable} from "../shaders/DrawCall";
import IgniEngine from "../../engine/IgniEngine";
import {KeyboardInteractable} from "../../input/Interactable";
import {KeyboardEventInfo} from "../../input/EventInfo"; 
import {KeyboardEvents} from "../../input/InputEvents";
import Body from "../../physics/bodies/Body";

abstract class Shape implements Renderable {
    public abstract toDrawCall(projection: mat4, view : mat4) :DrawCall;

    private _modelMatrix: mat4;
    private _invModelMatrix: mat4;
    private _size : vec2;
    protected position : vec2; 
    protected rotation : number;
    protected scale : vec3;
    protected updateCallback: (shape : Shape, deltaTime : number) => void;

    //  Rotation, Translate, Scale variables to avoid GC
    private _allowedRotationAxis : vec3;
    private _rotationQuaternion : quat;
    private _translationVector : vec3;
    private _scaleVector : vec3;

    // Reference to the parent engine.
    private _engine :IgniEngine;

    constructor(position :vec2, size? : vec2) {
        this.position = position;
        this.rotation = 0;
        this._size = size || vec2.fromValues (1,1);
        this.scale = vec3.fromValues (1,1,1);
        this._modelMatrix = mat4.create();
        this._invModelMatrix = mat4.invert(mat4.create(), this._modelMatrix);
        this._allowedRotationAxis = vec3.fromValues (0,0,1);
        
        //  There are set every frame before usage. So these values dont matter
        this._rotationQuaternion = quat.create ();
        this._translationVector = vec3.create ();
        this._scaleVector = vec3.create ();
        
        this._engine = null;
        this.updateCallback = (shape :Shape, deltaTime : number) => {};
    }

    public update(deltaTime : number) {
        this.updateCallback(this, deltaTime);
    }

    public onUpdate(updateCallback :(shape :Shape, deltaTime : number) => void) {
        this.updateCallback = updateCallback;
    }

    public translate(v : vec2) {
        vec2.add(this.position, this.position, v);
    }

    /**
     * Rotate around z axis angle radians.
     * @param angle angle radians
     */
    public rotate (angle : number) {
        this.rotation += angle;
    }

    /**
     * Set shape scale in x and y dimensions
     */
    public setScale (s : vec2) {
        this.scale = vec3.fromValues(s[0], s[1], 1);
    }

    public setPosition(newPos : vec2) {
        this.position = newPos;
    }

    public getPosition() {
        return this.position;
    } 

    /**
     * Set rotation around z axis in radians
     * @param angle angle radians
     */
    public setRotation(angle : number) {
        this.rotation = angle;
    }

    public getRotation() {
        return this.rotation;
    }

    protected updateModelMatrix () {
        this._rotationQuaternion = quat.setAxisAngle (this._rotationQuaternion, this._allowedRotationAxis, this.rotation);
        vec3.set (this._scaleVector, this._size[0] * this.scale[0], this._size[1] * this.scale[1], 1);
        vec3.set (this._translationVector, this.position[0], this.position[1], 0);

        this._modelMatrix = mat4.fromRotationTranslationScale (
            this._modelMatrix,
            this._rotationQuaternion,
            this._translationVector,
            this._scaleVector);
    }

    get modelMatrix () : mat4 {
        this.updateModelMatrix();
        return this._modelMatrix;
    }

    // A matrix which sets the camera reference to this shape's object coordinates.
    public followShapeViewMatrix () : mat4 {
        this.updateModelMatrix();
        mat4.invert(this._invModelMatrix, this._modelMatrix);
        return this._invModelMatrix;    
    }

    public onKeyDown(handler :(target :Shape | Body, event_info? :KeyboardEventInfo) => void) {
        if(!this._engine) {
            console.error("This body is not attached to any engine object!");
            return;
        }
        this._engine.subscribeTo(KeyboardEvents.KEYDOWN, this, handler);
    }
    public onKeyUp(handler :(target :Shape | Body, event_info? :KeyboardEventInfo) => void) {
        if(!this._engine) {
            console.error("This body is not attached to any engine object!");
            return;
        }
        this._engine.subscribeTo(KeyboardEvents.KEYDOWN, this, handler);
    }
    public onKeyPressed(handler :(target :Shape | Body, event_info? :KeyboardEventInfo) => void) {
        if(!this._engine) {
            console.error("This body is not attached to any engine object!");
            return;
        }
        this._engine.subscribeTo(KeyboardEvents.KEYDOWN, this, handler);    
    }

    public set engine(game :IgniEngine) {
        this._engine = game;
    }
}
export default Shape;