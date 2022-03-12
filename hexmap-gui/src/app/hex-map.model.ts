import {Hex} from "./hex.model";

export class HexMap<T> implements Map<Hex, T> {

  private vals: Map<number, [Hex, T]> = new Map<number, [Hex, T]>();

  public constructor() {
  }

  forEach(callbackfn: (value: T, key: Hex, map: Map<Hex, T>) => void, thisArg?: any): void {
    for (let entry of this.entries()) {
      callbackfn(entry[1], entry[0], this);
    }
  }

  get size(): number {
    return this.vals.size;
  }

  get [Symbol.toStringTag](): string {
    return "HexMap";
  }

  [Symbol.iterator](): IterableIterator<[Hex, T]> {
    return this.vals.values();
  }
  clear(): void {
    this.vals.clear();
  }

  delete(key: Hex): boolean {
    return this.vals.delete(key.hashCode());
  }

  entries(): IterableIterator<[Hex, T]> {
    return this.vals.values();
  }

  get(key: Hex): T | undefined {
    if (this.vals.has(key.hashCode())) {
      // @ts-ignore
      return this.vals.get(key.hashCode())[1];
    }
    return undefined;
  }

  has(key: Hex): boolean {
    return this.vals.has(key.hashCode());
  }

  keys(): IterableIterator<Hex> {
    let result: Set<Hex> = new Set<Hex>();
    for (let val of this.vals.values()) {
      result.add(val[0]);
    }
    return result.keys();
  }

  set(key: Hex, value: T): this {
    this.vals.set(key.hashCode(), [key, value]);
    return this;
  }

  values(): IterableIterator<T> {
    let result: Array<T> = new Array<T>();
    for (let val of this.vals.values()) {
      result.push(val[1]);
    }
    return result.values();
  }

}
