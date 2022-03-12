import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HexMapService} from "../hex-map.service";
import * as THREE from 'three';
import {HexMap} from "../hex-map.model";
import {LandscapeHex} from "../landscape-hex.model";
import {Layout, Orientation} from "../layout.model";
import {DirectionUtil, Hex} from "../hex.model";
import {Mesh, Object3D, OrthographicCamera, Scene, WebGLRenderer} from "three";
import {Camera} from "three/src/cameras/Camera";
import {Renderer} from "three/src/renderers/WebGLRenderer";

@Component({
  selector: 'app-map-editor',
  templateUrl: './map-editor.component.html',
  styleUrls: ['./map-editor.component.scss']
})
export class MapEditorComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas')
  private canvasRef!: ElementRef;

  @ViewChild('canvasContainer')
  private canvasContainerRef!: ElementRef;

  public drawCalls: number = 0;
  public triangles: number = 0;
  public fps: number = 0;

  public xRotation: number | null = 60;
  public zRotation: number | null = 0.005;
  public zoom: number | null = 1;

  public shadeHeight: boolean = true;
  public drawSmooth: boolean = true;

  public height: number | null = 10;
  public seedSize: number | null = 3;
  public iterations: number | null = 7;
  public falloff: number | null = 0.5;

  public progress: number = 100;


  private fpsTracker: number[] = [];
  private timer1: number = 0;
  private timer2: number = 0;

  private map: HexMap<LandscapeHex> = new HexMap<LandscapeHex>();

  private min: number = 10000;
  private max: number = -10000;

  private layout: Layout = new Layout(Orientation.POINTY_TOP, [.05, .05], [0, 0]);
  private renderer!: WebGLRenderer;
  private camera!: Camera;
  private scene!: Scene;
  private group!: Object3D;
  private root!: Object3D;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private readonly material = new THREE.MeshBasicMaterial({color: 0xFFFFFF, side: THREE.DoubleSide});



  constructor(private hexMapService: HexMapService) {
  }

  ngOnInit(): void {
  }

  render() {
    requestAnimationFrame(() => {
      this.render();
    });

    if (this.xRotation != null) {
      this.root.rotation.x = THREE.MathUtils.degToRad(this.xRotation);
    }

    if (this.zRotation != null) {
      this.group.rotation.z += this.zRotation;
    }
    //group.rotation.y += 0.01;

    this.renderer.render(this.scene, this.camera);
    this.timer2 = this.timer1;
    this.timer1 = performance.now();
    this.drawCalls = this.renderer.info.render.calls;
    this.triangles = this.renderer.info.render.triangles;
    this.fpsTracker.push(1000 / (this.timer1 - this.timer2));
    if (this.fpsTracker.length > 20) {
      this.fpsTracker = this.fpsTracker.slice(1, 20);
    }

    let total = 0;
    for (let v of this.fpsTracker) {
      total += v;
    }
    this.fps = total / this.fpsTracker.length;
  };

  ngAfterViewInit() {
    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
    let square = Math.min(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setSize(square, square);

    this.root = new THREE.Group();

    this.group = new THREE.Group();

    this.root.add(this.group);
    this.scene.add(this.root);
    this.scene.background = new THREE.Color(0, 0, 0.4);


    this.regenerateAll();
    this.render();

  }

  private createMesh(landscape: HexMap<LandscapeHex>, parent: Object3D) {

    let geometryArrays = new Map<number,  number[]>();

    for (let entry of landscape.entries()) {
      let iterVale =  (entry[1].iteration) / (this.iterations!);
      let heightVal = (entry[1].height - this.min) / (this.max - this.min);
      let materialVal = Math.floor(heightVal * 255);
      if (!this.shadeHeight) {
        materialVal = Math.floor(iterVale * 255);
      }

      if (!geometryArrays.has(materialVal)) {
        geometryArrays.set(materialVal, []);
      }
      let array = <number[]>geometryArrays.get(materialVal);

      for (let direction of DirectionUtil.values()) {
        let ha = entry[0].neighbour(DirectionUtil.prev(direction));
        let hb = entry[0].neighbour(direction);
        let hc = entry[0].neighbour(DirectionUtil.next(direction));
        let ph = this.layout.toCartesian(entry[0]);
        let pa = this.layout.toCartesian(ha);
        let pb = this.layout.toCartesian(hb);
        let pc = this.layout.toCartesian(hc);

        let h0 = entry[1].height;

        let pv1 = [(ph[0] + pa[0] + pb[0]) / 3.0, (ph[1] + pa[1] + pb[1]) / 3.0];
        let h1 = entry[1].height;
        let h1a = this.map.has(ha) ? (<LandscapeHex>this.map.get(ha)).height : h1;
        let h1b = this.map.has(hb) ? (<LandscapeHex>this.map.get(hb)).height : h1;
        h1 = (h1 + h1a + h1b) / 3.0;
        let pv2 = [(ph[0] + pc[0] + pb[0]) / 3.0, (ph[1] + pc[1] + pb[1]) / 3.0];
        let h2 = entry[1].height;
        let h2c = this.map.has(hc) ? (<LandscapeHex>this.map.get(hc)).height : h2;
        let h2b = this.map.has(hb) ? (<LandscapeHex>this.map.get(hb)).height : h2;
        h2 = (h2 + h2c + h2b) / 3.0;

        array.push(ph[0], ph[1], h0);
        if (this.drawSmooth) {
          array.push(pv1[0], pv1[1], h1);
          array.push(pv2[0], pv2[1], h2);
        } else {
          array.push(pv1[0], pv1[1], h0);
          array.push(pv2[0], pv2[1], h0);
        }
      }
    }

    for (let geometryArray of geometryArrays.entries()) {
      const vertices = new Float32Array(geometryArray[1]);


      const geometry = new THREE.BufferGeometry();
      // itemSize = 3 because there are 3 values (components) per vertex
      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      let color = new THREE.Color(geometryArray[0] / 255, geometryArray[0] / 255, geometryArray[0] / 255);
      const material = new THREE.MeshBasicMaterial({color: color, side: THREE.DoubleSide});

      parent.add(new THREE.Mesh(geometry, material));
    }
  }

  regenerateGeometry() {
    this.group.clear();
    this.createMesh(this.map, this.group);
  }

  recreateCamera() {
    // 40 at 7 iterations, 1 at 0 iterations
    let size = (40 * (this.iterations! / 7)) / this.zoom!;

    this.camera = new THREE.OrthographicCamera(-size, size, -size, size, 0.1, 1000);
    this.camera.position.set(0, 0, 100);
    this.camera.up = new THREE.Vector3(0, 1, 0);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  }

  regenerateAll() {

    this.map = this.hexMapService.createCircle(this.seedSize!, this.height!);
    let range = this.height! * this.falloff!;
    for (let i = 1; i <= this.iterations!; i++) {
      this.map = this.hexMapService.subdivideMap(this.map, range, i);
      range = range * this.falloff!;
      this.progress = 100 * i / this.iterations!;
    }

    this.min = 100000;
    this.max = -100000;
    for (let val of this.map.values()) {
      if (val.height < this.min) {
        this.min = val.height;
      }
      if (val.height > this.max) {
        this.max = val.height;
      }
    }

    this.recreateCamera();
    this.regenerateGeometry();
  }
}
