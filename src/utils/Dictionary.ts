export interface IDictionary<K extends number | string, V> {
    add (key : K, value : V) : void;
    remove (key : K) : V;
    contains (key : K) : boolean;
    keys () : K[];
    values () : V[];
    getValue (key : K) : V;
}

export class Dictionary<K extends number | string, V> implements IDictionary<K, V>  {

    private _keys : K[];
    private _values : V[];
    
    constructor () {
        this._keys = [];
        this._values = []; 
    }

    public add (key : K, value:V) : void {
        if (this.contains (key)) {
            let i = this._keys.indexOf (key);
            let deleted = this._values.splice (i, 1, value);
            
            if (deleted != null && deleted.length > 0)
                delete deleted[0];
        }
        else {
            this._keys.push (key);
            this._values.push (value);
        }
    }

    public remove (key : K) : V {
        if (this.contains (key)) {

            let i = this._keys.indexOf (key);
            this._keys.splice (i, 1);
            let deleted = this._values.splice (i, 1);
            
            // if (deleted.length > 1) throw error
            if (deleted != null && deleted.length > 0)
                return deleted[0];
        }
        
        return null;
    }

    public contains (key : K) : boolean {
        return this._keys.indexOf (key) !== -1;
    }
    
    public getValue (key : K) {
        if (this.contains (key)) {
            let index = this._keys.indexOf (key);
            return this._values[index];
        }

        return null;
    }

    public keys () : K[] {
        return this._keys;
    }

    public values () : V[] {
        return this._values;
    }

}