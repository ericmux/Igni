import IDisposable from "../utils/IDisposable";
import {Signal} from "../utils/Signal";

export interface ILoader {
    enqueue (path : string, args? : any) : void;
    load () : void;
    onLoadResource : Signal;
    onCompleteSignal : Signal;
}

export enum RESOURCE_TYPE {
    IMAGE, AUDIO
}

export class Resource implements IDisposable {
    private _data : HTMLImageElement; // | HtmlAudioElement | HTMLsomething
    private _path : string;
    private _isComplete : boolean;
    private _type : RESOURCE_TYPE;
    private _args : any;

    //  Signal dispatched when resource is completed
    public onCompleteResource : Signal;

    constructor (path : string, args? : any) {
        this._data = null;
        this._isComplete = false;
        this._path = path;
        this._args = args;
        this.disposed = false;
        this.onCompleteResource = new Signal ();
    }
    
    public get path () : string {
        return this._path;
    }

    public get data () : HTMLImageElement {
        return this._data;
    }
    
    public get args () : any {
        return this._args;
    }

    public get type () : RESOURCE_TYPE {
        return this._type;
    }

    //  IDisposable 
    disposed : boolean;
    public dispose () : void {
        if (this.disposed) return;
        this._data = null;
        this.disposed = true;   
    }

    public load () {
        
        let extension = Resource.s_extractExtension (this._path);
        let loadType = Resource.s_map[extension];

        //  Make sure path has lower case extension
        let path = this._path.slice (0, this._path.lastIndexOf (".") + 1) + extension;

        if (loadType === undefined) throw new Error ("Tried to load a non supported resource: " + extension);

        switch (loadType) {
            
            case RESOURCE_TYPE.IMAGE: {
                this._type = RESOURCE_TYPE.IMAGE;
                this._loadImage (path);
            } break;
            
            default: {
                
            }
            break;
        }
    }

    //  Private loader functions
    private _loadImage (path : string) {
        let imageHash : any = require.context('../../images', true, /.(gif|png|jpe?g|svg)$/) (path);

        this._data = new Image ();
        
        this._data.addEventListener ("load", this._complete.bind (this), false);
        this._data.addEventListener ("error", this._error.bind (this), false);
        this._data.addEventListener ("abort", this._abort.bind (this), false);

        this._data.src = imageHash as string;
    }

    private _complete () {
        this._isComplete = true;
        this.onCompleteResource.dispatch ({resource : this});
    }

    private _error () {
        console.log ("error");
    }

    private _abort () {
        console.log ("abort");
    }
    
    //  Static class members
    private static s_map : {[propName : string] : RESOURCE_TYPE} = {
         "png" : RESOURCE_TYPE.IMAGE,
         "jpg" : RESOURCE_TYPE.IMAGE
    } 

    public static s_extractExtension (path : string) : string {
        path = path.toLowerCase ();
        let extensionStartIndex = path.lastIndexOf (".") + 1;
        return path.substring (extensionStartIndex);
    }
}

export class Loader implements ILoader {

    private _queue : {path : string, args : any} [];
    private _loading : boolean;
    private _completed : boolean;
    private _resources : {[propName : string] : Resource};
    private _resourcesNumber : number;

    public get loading () : boolean {
        return this._loading;
    }

    /**
     * When Loader finishes all resources 
     */
    public onCompleteSignal : Signal;

    /**
     * When Loader finishes a single resource 
     */  
    public onLoadResource : Signal;

    constructor () {
        this._queue = [];
        this._completed = false;
        this._loading = false;
        this._resources = {};
        this._resourcesNumber = 0;
        this.onCompleteSignal = new Signal ();
        this.onLoadResource = new Signal ();
    }

    public enqueue (path : string, args? : any) : void {
    
        if (this._loading || this._completed) throw new Error ("Can't enqueue resources while loading or after completed");

        //  If Resource already there..
        if (this._resources[path] !== undefined &&
            this._resources[path] != null &&
            this._resources[path].data != null) {
            return;
        }

        this._queue.push ({"path" : path, "args" : args});
    }

    public reset (keepCache = false) {
        this._queue = [];
        this._completed = false;
        this._loading = false;
        this._resourcesNumber = 0;
        this.onCompleteSignal.detachAll ();
        this.onLoadResource.detachAll ();

        if (!keepCache) {
            for (var prop in this._resources) {
                this._resources[prop].dispose ();
            }
            this._resources = {};
        }
    }

    public load () : void {
    
        if (this._loading || this._completed) throw new Error ("Can't load resources while still loading or after completed");
    
        this._loading = true;

        this._resourcesNumber = this._queue.length;

        for (let i = 0; i < this._queue.length; ++i) {

            let queued = this._queue[i];
            this._resources[queued.path] = new Resource (queued.path, queued.args);
            this._resources[queued.path].onCompleteResource.once (this._onLoadResource.bind (this));
            this._resources[queued.path].load ();
        }
    }

    private _onLoadResource (loaded : {resource :  Resource, [propName : string] : any}) {
        --this._resourcesNumber;

        //  Run resource consumers
        if (this.onLoadResource.hasBindings ()) {
            this.onLoadResource.dispatch (loaded);
        }

        if (this._resourcesNumber == 0) {
            if (this.onCompleteSignal.hasBindings ())
                this.onCompleteSignal.dispatch (this._resources);
            this._completed = true;
            this._loading = false;
        }
    }
}
