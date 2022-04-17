const identity = (item) => item;

/**
 * Scene extends Pixi containers, allowing us to pause containers and update
 * the function that runs with requestAnimationFrame.  Works hand in hand with
 * ScenesManage and can be extended for more specific scenes.  Use
 * Object.create(Scene) or ScenesManager to create instances of Scene.
 *
 * @property {Boolean}  paused   Keeps track of whether the manager should run update()
 * @property {Function} updateCB The function to run with requestAnimationFrame.
 */
export const BaseScene = Object.assign(new PIXI.Container(), {
  paused: false,
  state: {
    width: 0,
    height: 0,
  },
  updateCB: identity,

  /**
   * Sets updateCB to be run by requestAnimationFrame.  Defaults to an empty
   * function.
   *
   * @parameter {Function} updateCB
   */
  onUpdate(updateCB = identity) {
    this.updateCB = updateCB;
  },

  /**
   * Runs updateCB.  This will be directly called by requestAnimationFrame.
   */
  update() {
    this.updateCB();
  },

  /**
   * Pauses the scene by setting paused to true.
   */
  pause() {
    this.paused = true;
  },

  /**
   * Resumes the scene by setting paused to false.
   */
  resume() {
    this.paused = false;
  },

  size(width, height) {
    this.state.width = width;
    this.state.height = height;
  },

  /**
   * API to access paused in a prettier way.
   *
   * @return {Boolean} this.paused Represents whether the current scene is paused.
   */
  isPaused() {
    return this.paused;
  },
});
