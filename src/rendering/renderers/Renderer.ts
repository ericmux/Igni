import Shape from "../shapes/Shape";
import {Renderable} from "../shaders/DrawCall";
interface Renderer {
    resizeToCanvas: () => void;
    beforeRender: () => void;
    resize: (width: number, height: number) => void; 
    drawShape: (shape: Shape) => void;
    debugDraw: (renderable : Renderable) => void;
    clear: () => void;
    setCamera: (camera : Shape) => void;
}
export default Renderer;