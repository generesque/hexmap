import {Hex} from "./hex.model";

export class HexSet implements Set<Hex> {

  private hexes: Map<number, Hex> = new Map<number, Hex>();

  public static from(o: HexSet): HexSet {
    let newSet = new HexSet();
    for (let hex of o) {
      newSet.add(hex);
    }
    return newSet;
  }

  public constructor() {
  }

  get [Symbol.toStringTag](): string {
    return "HexSet";
  }
  get size(): number {
    return this.hexes.size;
  }


  public add(hex: Hex): this {
    if (!this.hexes.has(hex.hashCode())) {
      this.hexes.set(hex.hashCode(), hex);
    }
    return this
  }

  public remove(hex: Hex) {
    this.hexes.delete(hex.hashCode());
  }


  [Symbol.iterator](): IterableIterator<Hex> {
    return this.hexes.values();
  }

  clear(): void {
    this.hexes.clear();
  }

  delete(value: Hex): boolean {
    return this.hexes.delete(value.hashCode());
  }

  entries(): IterableIterator<[Hex, Hex]> {
    let result: Array<[Hex, Hex]> = new Array<[Hex, Hex]>()
    for (let h of this.hexes.values()) {
      result.push([h, h]);
    }
    return result.values();
  }

  forEach(callbackfn: (value: Hex, value2: Hex, set: Set<Hex>) => void, thisArg?: any): void {
    for (let h of this.hexes.values()) {
      callbackfn(h, h, this);
    }
  }

  has(value: Hex): boolean {
    return this.hexes.has(value.hashCode());
  }

  keys(): IterableIterator<Hex> {
    return this.hexes.values();
  }

  values(): IterableIterator<Hex> {
    return this.hexes.values();
  }


}
