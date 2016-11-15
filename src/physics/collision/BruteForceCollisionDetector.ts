import CollisionDetector from "./CollisionDetector";
import CollisionManifold from "./CollisionManifold";
import Body from "../bodies/Body";

export default class BruteForceCollisionDetector implements CollisionDetector {
    public detect(bodies: Body[]) :CollisionManifold[] {
        let contacts :CollisionManifold[] = [];
        for (let i = 0; i < bodies.length; i++) {
            for (let j = i+1; j < bodies.length; j++) {
                 if ( ! (bodies[i].isStaticBody && bodies[j].isStaticBody)) {
                    let contact :CollisionManifold = bodies[i].collide(bodies[j]);
                    if(contact) {
                        contacts.push(contact);
                    }
                 }
            }
        }
        return contacts;
    }
} 