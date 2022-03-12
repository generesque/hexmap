
export class LandscapeHex {

  public readonly height: number;
  public readonly iteration: number;

  public static create(height: number, iteration: number): LandscapeHex {
    return new LandscapeHex(height, iteration);
  }

  private constructor(height: number, iteration: number) {
    this.height = height;
    this.iteration = iteration;
  }
}
