import Shape from "../rendering/shapes/Shape";
import Renderer from "../rendering/renderers/Renderer";
import Body from "../physics/bodies/Body";
import {Loader} from "../loader/Loader";
import {TextureManager} from "../loader/TextureManager";

export default Engine;

export interface Engine {
    loader: Loader;
    textureManager: TextureManager;
    start: () => void;
    stop: () => void;
    resume: () => void;
    addShape: (shape: Shape) => void; // For render-only objects.
    addBody: (body: Body) => void; // For physics-enabled rich objects.
}

export interface EngineOptions {
    frameControl : boolean, //  Allows binding of three keyboard keys to stop, resume and resumeFrame
    stopKeyBinding : number,
    resumeKeyBinding : number,
    resumeFrameKeyBinding : number,
    debugDraw : boolean,
    iterationsPerPhysicsTick :number
}