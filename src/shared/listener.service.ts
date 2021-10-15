export type ListenerCallback<T> = (obj: T) => void;
export interface Monitor<T> {
  addListener: (callback: ListenerCallback<T>) => void;
  hasListener: (callback: ListenerCallback<T>) => boolean;
  removeListener: (callback: ListenerCallback<T>) => void;
}

export class ListenerService<T> {
  private _listeners: Set<ListenerCallback<T>> = new Set();
  get listeners(): ListenerCallback<T>[] {
    return [...this._listeners];
  }
  
  private _name: string = "";
  get name() {
    return this._name;
  }

  constructor(name: string, private monitor: Monitor<T>, ...params: ListenerCallback<T>[]) {
    this._name = name;
    //initialize the listener array
    if (Array.isArray(params)) {
      this._listeners = new Set(params);
    }

    //setup the monitor
    if (!monitor.hasListener(this.processCallbacks)) {
      console.log("Initializing Listener", name);
      monitor.addListener(this.processCallbacks.bind(this));
    }
  }

  
  add(callback: ListenerCallback<T>) {
    if (!this._listeners.has(callback)) {
      this._listeners.add(callback);
    }
  }
  //alias: add
  push(callback: ListenerCallback<T>) {
    this.add(callback);
  }

  length(): number {
    return this._listeners.size;
  }

  isValid() {
    return this.monitor.hasListener(this.processCallbacks);
  }

  dispose() {
    console.log("Listener - reset", {exists: this.isValid()});
    this.monitor.removeListener(this.processCallbacks);
  }

  private processCallbacks(result: T) {
    console.log("DEBUG: ListenerService - activated", {name: this.name, result});
    this.listeners.forEach(fn => fn(result));  
  }
}