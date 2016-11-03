import IDisposable from "../utils/IDisposable";
import {Signal} from "../utils/Signal";

export interface ILoader {
    enqueue (path : string) : void;
    onComplete (callback : (resources : {[propName : string] : Object}) => void) : void;
    load () : void;
}

export class Resource implements IDisposable {
    _data : HTMLImageElement; // | HtmlAudioElement | HTMLsomething
    _disposed : boolean;

    constructor (data : HTMLImageElement) {
        this._data = data;
        this._disposed = false;
    }

    public get data () : HTMLImageElement {
        if (this._disposed) throw new Error ("Resource already disposed!");
        return this._data;
    }

    public dispose () : void {
        if (this._disposed) return;
        this._data = null;
        //delete this._data;    
    }
}

export class Loader implements ILoader {

    private _queue : {path : string} [];
    private _loading : boolean;
    private _completed : boolean;
    private _completeLoadSignal : Signal;
    private _resources : {[propName : string] : Resource};

    constructor () {
        this._queue = [];
        this._completed = false;
        this._loading = false;
        this._completeLoadSignal = new Signal ();
        this._resources = {};
    }

    public enqueue (path : string) : void {
    
        if (this._loading || this._completed) throw new Error ("Can't enqueue resources while loading or after completed");

        this._queue.push ({"path" : path});
    }

    onComplete (callback : (resources : {[propName : string] : Object}) => void) : void {
        this._completeLoadSignal.once (callback);
    }

    public load () : void {
    
        if (this._loading || this._completed) throw new Error ("Can't load resources while still loading or after completed");
    
        this._loading = true;

        let files : number = this._queue.length;

        for (let i = 0; i < this._queue.length; ++i) {
            
            let queued = this._queue[i];
            
            let imageHash : any = require.context('../../images', true, /.(gif|png|jpe?g|svg)$/) (queued.path);

            let image = new Image ();
            image.src = imageHash as string;
            image.onload = () => {
                this._resources[queued.path] = new Resource (image);

                --files;
                if (files == 0) {
                    this._completeLoadSignal.dispatch (this._resources);

                }
            }
        }
    }
}
