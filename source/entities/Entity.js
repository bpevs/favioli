import { random } from "../utilities/index.js";


/**
 * Makes Bunnies by creating a Sprite, then extending the resulting sprite with
 * new, more specific properties.
 *
 * @property {Number} mass          The mass of a bunny.
 * @property {Number} rotationSpeed The speed of rotation of a bunny in degrees/frame.
 */
export function Bunny() {
  return Object.assign(PIXI.Sprite.fromImage("assets/icons/32.png"), {
    anchor: { x: null, y: null },
    mass: 0,
    rotation: null,
    rotationSpeed: null,
    scale: { x: null, y: null },

    /**
     * initializes an entity, setting up all the variables that should be random
     * per instance.
     *
     * @return {Object} The newly created bunny.
     */
    initialize() {
      this.scale.x = this.scale.y = random(0.8, 1);
      this.rotationSpeed = random(-0.05, 0.05);
      this.rotation = random(0, 360);
      this.mass = random(0.1, 0.3);
      this.anchor.x = this.anchor.y = 0.5;
      return this;
    }
  });
}
