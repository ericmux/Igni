import Shape from "../rendering/shapes/Shape";
import Renderer from "../rendering/renderers/Renderer";
import Body from "../physics/bodies/Body";
interface Engine {
    start: () => void;
    stop: () => void;
    addShape: (shape: Shape) => void; // For render-only objects.
    addBody: (body: Body) => void; // For physics-enabled rich objects.
}
export default Engine;