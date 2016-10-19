import Shape from "../shapes/Shape";
import Camera from "../camera/Camera";
interface Renderer {
    resizeToCanvas: () => void;
    resize: (width: number, height: number) => void; 
    drawShapes: (shapes: Shape[]) => void;
    clear: () => void;
    setCamera: (camera : Camera) => void;
}
export default Renderer;