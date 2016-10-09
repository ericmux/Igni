import Shape from "../rendering/shapes/Shape";
import Renderer from "../rendering/renderers/Renderer";
interface Engine {
    start: () => void;
    add: (shape: Shape) => void; // Shouldn't be Shape, but "Body/Actor" (with Body containing a ref to its Shape).
}
export default Engine;