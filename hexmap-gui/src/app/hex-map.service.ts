import {Injectable} from '@angular/core';
import {Direction, DirectionUtil, Hex} from "./hex.model";
import {LandscapeHex} from "./landscape-hex.model";
import {HexMap} from "./hex-map.model";
import {HexSet} from "./hex-set.model";

@Injectable({
  providedIn: 'root'
})
export class HexMapService {

  constructor() {
  }

  private randomInRange(range: number): number {
    return Math.random() * range - range * .5;
  }

  public createCircle(radius: number, height: number): HexMap<LandscapeHex> {
    let hexes: HexSet = new HexSet();
    let x = DirectionUtil.getOffset(Direction.POS_Q);
    if (radius == 0) {
      return new HexMap<LandscapeHex>();
    }
    hexes.add(Hex.ZERO);
    let previouslyAdded: HexSet = new HexSet();
    previouslyAdded.add(Hex.ZERO);
    for (let i = 1; i < radius; ++i) {
      let toProcess: HexSet = HexSet.from(previouslyAdded);
      previouslyAdded.clear();
      for (let hex of toProcess) {
        for (let d of DirectionUtil.values()) {
          let newEntry = hex.neighbour(d);
          hexes.add(newEntry);
          previouslyAdded.add(newEntry);
        }
      }
    }

    let map: HexMap<LandscapeHex> = new HexMap<LandscapeHex>();
    for (let h of hexes) {
      map.set(h, LandscapeHex.create(this.randomInRange(height), 0));
    }
    return map;
  }

  public subdivideMap(sourceMap: HexMap<LandscapeHex>, range: number, iteration: number): HexMap<LandscapeHex> {
    let targetMap: HexMap<LandscapeHex> = new HexMap<LandscapeHex>();

    // subdivide the map and calculate new values
    for (let h of sourceMap.keys()) {
      targetMap.set(h.times(2), <LandscapeHex>sourceMap.get(h));
      for (let d of DirectionUtil.values()) {
        let n = h.neighbour(d);
        let target = h.times(2).neighbour(d);
        if (!sourceMap.has(n)) {
          // this hex is not in the source, use the current value to generate the new entry
          targetMap.set(target, LandscapeHex.create((<LandscapeHex>sourceMap.get(h)).height + this.randomInRange(range), iteration));
        } else if (!targetMap.has(target)) {
          targetMap.set(target, LandscapeHex.create(
            ((<LandscapeHex>sourceMap.get(h)).height + (<LandscapeHex>sourceMap.get(h.neighbour(d))).height) * 0.5
            + this.randomInRange(range), iteration));
        }
      }
    }

    return targetMap;
  }
}
