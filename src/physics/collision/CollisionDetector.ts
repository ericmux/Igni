import Body from "../bodies/Body";
import CollisionManifold from "./CollisionManifold";

interface CollisionDetector {
    detect: (bodies: Body[]) => CollisionManifold[];
}
export default CollisionDetector;