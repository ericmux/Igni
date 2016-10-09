import Shape from "../shapes/Shape";
interface Renderer {
    resizeToCanvas: () => void;
    resize: (width: number, height: number) => void; 
    drawShapes: (shapes: Shape[]) => void;
    clear: () => void;
}
export default Renderer;