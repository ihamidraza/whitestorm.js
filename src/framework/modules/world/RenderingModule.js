import {
  PCFSoftShadowMap,
  WebGLRenderer,
  Vector2
} from 'three';

import {Loop} from '../../extras/Loop';

export class RenderingModule {
  constructor(params = {}) {
    this.params = Object.assign({
      width: window.innerWidth,
      height: window.innerHeight,

      resolution: new Vector2(1, 1),

      bgColor: 0x000000,
      bgOpacity: 1,

      renderer: {}
    }, params);

    this.renderer = new WebGLRenderer(this.params.renderer);

    this.renderer.setClearColor(
      this.params.bgColor,
      this.params.bgOpacity
    );

    this.setSize(
      Number(this.params.width * this.params.resolution.x).toFixed(),
      Number(this.params.height * this.params.resolution.y).toFixed()
    );
  }

  integrateRenderer(element, scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.renderLoop = new Loop((clock) => this.renderModule(this.scene, this.camera, clock.getDelta()));
    this.attachToCanvas(element);

    return this.renderLoop;
  }

  renderModule(scene, camera, delta) {
    this.renderer.render(scene, camera);
  }

  setSize(width, height) {
    if (this.renderer) this.renderer.setSize(width, height);
  }

  attachToCanvas(element) {
    const canvas = this.renderer.domElement;

    // attach to new parent world dom
    element.appendChild(canvas);
    canvas.style.width = '100%';
    canvas.style.height = '100%';
  }

  manager(manager) {
    this.renderLoop = this.integrateRenderer(
      manager.get('element'),
      manager.get('scene'),
      manager.get('camera').native
    );

    manager.onDependencyUpdate({
      element: (element) => {
        this.attachToCanvas(element);
      },
      scene: (scene) => {
        this.scene = scene;
      },
      camera: (camera) => {
        this.camera = camera.native;
      }
    });

    manager.addDependency('renderer', this.renderer, {alias: '$rendering'});
  }

  integrate(params, self) {
    self.renderLoop.start(this);
  }
}
