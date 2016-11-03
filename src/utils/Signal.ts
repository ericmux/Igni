export class SignalBind {
    constructor (eventHandler : (args? : {[propName : string] : Object}) => void) {
        this._eventHandler = eventHandler;
        this._next = null;
        this._prev = null;
        this._owner = null;
        this._dispatched = false;
    }

    private _dispatched : boolean;

    public dispatch (owner : Signal, args? : {[propName : string] : Object}) : boolean {
        if (this._dispatched) return false;
        if (owner !== this._owner) throw new Error ("SignalBind dispatched not by its owner");
        
        this._eventHandler(args);

        this._dispatched = true;
        return true;
    }

    protected _eventHandler : (args? : {[propName : string] : Object}) => void;

    //  Getters and Setters
    protected _once : boolean;
    public get once () : boolean {
        return this._once;
    }
    public set once (value : boolean) {
        this._once = value;
    }    

    protected _next : SignalBind;
    public get next () {
        return this._next;
    }
    public set next (value : SignalBind) {
        this._next = value;
    }

    protected _prev : SignalBind;
    public get prev () {
        return this._prev;
    }
    public set prev (value : SignalBind) {
        this._prev = value;
    }

    protected _owner : Signal;
    public get owner () {
        return this._owner;
    }
    public set owner (value : Signal) {
        this._owner = value;
    }
}

export class Signal {

    protected _bindingsHead : SignalBind;
    protected _bindingsTail : SignalBind;

    constructor () {
        this._bindingsHead = null;
        this._bindingsTail = null;
    }

    hasBindings () : boolean {
        return this._bindingsHead != null;
    }

    has (bind : SignalBind) : boolean { 
        return bind.owner === this;
    }

    add (eventHandler : (args? : {[propName : string] : Object}) => void) : SignalBind {
        return this._addBinding (new SignalBind (eventHandler), false);
    }
    
    once (eventHandler : (args? : {[propName : string] : Object}) => void) : SignalBind {
        return this._addBinding (new SignalBind (eventHandler), true);
    }
    
    detach (bind : SignalBind) : boolean {
        if (bind.owner !== this) throw new Error ("Trying to detach a not owned binding");
        if (! this.hasBindings()) return false;

        let p = this._bindingsHead;
        while (p != bind) {
            p = p.next;
        }

        if (p.prev != null)
        {
            p.prev.next = p.next;
        }
        else {
            this._bindingsHead = p.next;
        }
        
        if (p.next != null) {
            p.next.prev = p.prev;
        }
        else {
            this._bindingsTail = p.prev;
        }
        
        p = null;
        return true;
    }

    dispatch (args? : {[propName : string] : Object}) : void {
        if (! this.hasBindings ()) throw new Error ("Trying to dispatch a non observed signal");

        let p = this._bindingsHead;
        while (p != null) {
            p.dispatch (this, args);
            if (p.once) this.detach (p);

            p = p.next;
        }
    }

    getAllBindings () : SignalBind[] { return null;}
    
    detachAll () : void {
        if (! this.hasBindings ()) return;
        
        let p = this._bindingsHead;
        while (p != null) {
            let q = p;
            p = p.next;
            q = null;
        }

        this._bindingsHead = null;
        this._bindingsTail = null;
    }

    private _addBinding (bind : SignalBind, once : boolean) : SignalBind {
        if (! this.hasBindings ()) {
            this._bindingsHead = bind;
            this._bindingsTail = bind;
            bind.next = bind.prev = null;
        }
        else {
            bind.prev = this._bindingsTail;
            bind.next = this._bindingsTail.next;
            this._bindingsTail = bind;
        }
        
        bind.once = once; 
        bind.owner = this;

        return bind;
    }
}