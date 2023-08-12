type Listener<T> = (value: T) => void;

export default class Observable<T> {
	private _value: T;
	get value(): T {
		return this._value;
	}

	setValue(value: T) {
		this._value = value;
		this.runListeners();
	}

	listeners: Listener<T>[] = [];

	constructor(initialValue: T) {
		this._value = initialValue;
	}

	on(listener: Listener<T>) {
		this.listeners.push(listener);
		return () => this.off(listener);
	}

	off(listener: Listener<T>) {
		const indexOfListener = this.listeners.indexOf(listener);
		this.listeners.splice(indexOfListener, 1);
	}

	runListeners() {
		this.listeners.forEach((l) => l(this.value));
	}
}
