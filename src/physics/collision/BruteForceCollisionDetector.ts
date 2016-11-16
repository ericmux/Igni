import CollisionDetector from "./CollisionDetector";
import CollisionManifold from "./CollisionManifold";
import Body from "../bodies/Body";

export default class BruteForceCollisionDetector implements CollisionDetector {
    
    /**
     * An array of manifolds to store and reuse manifold objects from.
     */
    private _collisions : CollisionManifold[];
    
    /**
     * A reference to keep to the last manifold detected.
     */
    private _manifold :CollisionManifold;

    /**
     * A variable to keep track of the maximum lenght of the this._collisions array.
     */
    private _maximumManifoldsGenerated : number;

    constructor () {
        this._maximumManifoldsGenerated = 0;
        this._manifold = new CollisionManifold (null, null, null, null, null);
        
        this._collisions = [];
        this._collisions.push (this._manifold);
    }

    public detect(bodies: Body[]) : CollisionManifold[] {
        
        let numberOfContacts : number = 0;

        for (let i = 0; i < bodies.length; i++) {
            for (let j = i+1; j < bodies.length; j++) {
                 if ( ! (bodies[i].isStaticBody && bodies[j].isStaticBody)) {             
                    
                    //  Reference to the reusable manifold
                    this._manifold = this._collisions[numberOfContacts];

                    //  If collided, the this._manifold ref will update the array
                    if (bodies[i].collide(this._manifold, bodies[j])) {
                        
                        ++numberOfContacts;

                        //  If necessary to push another manifold to reuse
                        if (numberOfContacts > this._maximumManifoldsGenerated) {
                            this._collisions.push (new CollisionManifold (null,null,null,null,null));
                        }
                    }
                }
            }
        }

        if (numberOfContacts > this._maximumManifoldsGenerated) {
            this._maximumManifoldsGenerated = numberOfContacts;
        }

        return this._collisions.slice (0, numberOfContacts);
    }
}