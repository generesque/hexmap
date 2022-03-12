export enum Direction {
  POS_Q,
  POS_S,
  POS_R,
  NEG_Q,
  NEG_S,
  NEG_R
}

export class DirectionUtil {
  public static values() {
    return [Direction.POS_Q, Direction.POS_S, Direction.POS_R, Direction.NEG_Q, Direction.NEG_S, Direction.NEG_R];
  }

  public static getOffset(direction: Direction) {
    switch (direction) {
      case Direction.POS_Q:
        return Hex.UNIT_Q;
      case Direction.POS_S:
        return Hex.UNIT_S;
      case Direction.POS_R:
        return Hex.UNIT_R;
      case Direction.NEG_Q:
        return Hex.UNIT_Q.times(-1);
      case Direction.NEG_S:
        return Hex.UNIT_S.times(-1);
      case Direction.NEG_R:
        return Hex.UNIT_R.times(-1);
    }
  }

  public static next(direction: Direction): Direction {
    switch (direction) {
      case Direction.POS_Q:
        return Direction.POS_S;
      case Direction.POS_S:
        return Direction.POS_R;
      case Direction.POS_R:
        return Direction.NEG_Q;
      case Direction.NEG_Q:
        return Direction.NEG_S;
      case Direction.NEG_S:
        return Direction.NEG_R;
      case Direction.NEG_R:
        return Direction.POS_Q;
    }
    return Direction.POS_Q;
  }

  public static prev(direction: Direction): Direction {
    switch (direction) {
      case Direction.POS_Q:
        return Direction.NEG_R;
      case Direction.POS_S:
        return Direction.POS_Q;
      case Direction.POS_R:
        return Direction.POS_S;
      case Direction.NEG_Q:
        return Direction.POS_R;
      case Direction.NEG_S:
        return Direction.NEG_Q;
      case Direction.NEG_R:
        return Direction.NEG_S;
    }
    return Direction.POS_Q;
  }

  public static fromOffset(offset: Hex): Direction {
    if (Hex.UNIT_Q.equals(offset)) {
      return Direction.POS_Q;
    } else if (Hex.UNIT_S.equals(offset)) {
      return Direction.POS_S;
    } else if (Hex.UNIT_R.equals(offset)) {
      return Direction.POS_R;
    } else if (Hex.UNIT_Q.times(-1).equals(offset)) {
      return Direction.NEG_Q;
    } else if (Hex.UNIT_S.times(-1).equals(offset)) {
      return Direction.NEG_S;
    } else if (Hex.UNIT_R.times(-1).equals(offset)) {
      return Direction.NEG_R;
    }

    return Direction.POS_Q;
  }
}

export class Hex {
  public static readonly ORIGIN: Hex = Hex.create3(0, 0, 0);
  public static readonly ZERO: Hex = Hex.ORIGIN;
  public static readonly UNIT_Q: Hex = Hex.create3(0, -1, 1);
  public static readonly UNIT_R: Hex = Hex.create3(1, 0, -1);
  public static readonly UNIT_S: Hex = Hex.create3(1, -1, 0);


  public readonly q: number;
  public readonly r: number;
  public readonly s: number;

  public static create(q: number, r: number): Hex {
    return new Hex(q, r, -q - r);
  }

  public static create3(q: number, r: number, s: number): Hex {
    return new Hex(q, r, s);
  }

  public static add(a: Hex, b: Hex): Hex {
    return Hex.create3(a.q + b.q, a.r + b.r, a.s + b.s);
  }

  public static subtract(a: Hex, b: Hex): Hex {
    return Hex.create3(a.q - b.q, a.r - b.r, a.s - b.s);
  }

  public static multiply(a: Hex, k: number): Hex {
    return Hex.create3(a.q * k, a.r * k, a.s * k);
  }

  public static len(a: Hex): number {
    return (Math.abs(a.q) + Math.abs(a.r) + Math.abs(a.s)) / 2;
  }

  public static distance(a: Hex, b: Hex): number {
    return Hex.len(Hex.subtract(a, b));
  }


  public static neighbour(a: Hex, d: Direction): Hex {
    return Hex.add(a, DirectionUtil.getOffset(d));
  }

  private constructor(q: number, r: number, s: number) {
    if (q + r + s != 0) {
      throw new Error("q + r + s != 0");
    }

    this.q = q;
    this.r = r;
    this.s = s;
  }

  public plus(b: Hex): Hex {
    return Hex.add(this, b);
  }

  public minus(b: Hex): Hex {
    return Hex.subtract(this, b);
  }

  public times(k: number): Hex {
    return Hex.multiply(this, k);
  }

  public length(): number {
    return Hex.len(this);
  }

  public distanceTo(b: Hex): number {
    return Hex.distance(this, b);
  }

  public neighbour(d: Direction): Hex {
    return Hex.neighbour(this, d);
  }

  public equals(o: Hex): boolean {
    if (this === o) {
      return true;
    }
    if (o === null) {
      return false;
    }
    return this.q == o.q && this.r == o.r && this.s == o.s;
  }

  public hashCode(): number {
    // let h: number = 0
    // h = 31 * h + this.q;
    // h = 31 * h + this.r;
    // h = 31 * h + this.s;
    // return h & 0xFFFFFFFF;
    return this.q + (this.r << 16) + (this.s << 24);
  }


  public toString(): string {
    return "Hex{" +
      "q=" + this.q +
      ", r=" + this.r +
      ", s=" + this.s +
      '}';
  }

}
