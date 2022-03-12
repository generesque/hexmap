import {Direction, Hex} from "./hex.model";

export class Orientation {

  public static readonly POINTY_TOP
    = new Orientation(Math.sqrt(3.0), Math.sqrt(3.0) / 2.0, 0.0, 3.0 / 2.0,
    Math.sqrt(3.0) / 3.0, -1.0 / 3.0, 0.0, 2.0 / 3.0,
    0.5);
  public static readonly FLAT_TOP
    = new Orientation(3.0 / 2.0, 0.0, Math.sqrt(3.0) / 2.0, Math.sqrt(3.0),
    2.0 / 3.0, 0.0, -1.0 / 3.0, Math.sqrt(3.0) / 3.0,
    0.0);

  public readonly f0: number;
  public readonly f1: number;
  public readonly f2: number;
  public readonly f3: number;

  public readonly b0: number;
  public readonly b1: number;
  public readonly b2: number;
  public readonly b3: number;

  public readonly start_angle; // in multiples of 60°

  private constructor(f0: number, f1: number, f2: number, f3: number,
                      b0: number, b1: number, b2: number, b3: number,
                      start_angle: number) {
    this.f0 = f0;
    this.f1 = f1;
    this.f2 = f2;
    this.f3 = f3;

    this.b0 = b0;
    this.b1 = b1;
    this.b2 = b2;
    this.b3 = b3;

    this.start_angle = start_angle;
  }
}

export class Layout {

  private readonly orientation: Orientation;
  private readonly size: [number, number];
  private readonly origin: [number, number];

  public constructor(orientation: Orientation, size: [number, number], origin: [number, number]) {
    this.orientation = orientation;
    this.size = size;
    this.origin = origin;
  }

  public toCartesian(h: Hex): [number, number] {
    let x = (this.orientation.f0 * h.q + this.orientation.f1 * h.r) * this.size[0];
    let y = (this.orientation.f2 * h.q + this.orientation.f3 * h.r) * this.size[1];
    return [x + this.origin[0], y + this.origin[1]];
  }

  public cornerOffset(d: Direction): [number, number] {
    let angle = 2.0 * Math.PI * (this.orientation.start_angle + d) / 6;
    return [this.size[0] * Math.cos(angle), this.size[1] * Math.sin(angle)];
  }

}
