import Shape from "../shapes/Shape";
interface Renderer {
    resizeToCanvas: () => void;
    resize: (width: number, height: number) => void; 
    drawShape: (shape: Shape) => void;
    clear: () => void;
    setCamera: (camera : Shape) => void;
}
export default Renderer;