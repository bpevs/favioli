import { BaseScene } from "./scenes/index.js";

/**
 * ScenesManager
 *
 * @property {Object} scenes       Holds the scenes of the current project.
 * @property {Object} currentScene The currently active scene.
 * @property {Object} renderer     The PIXI renderer being used.
 */

export const ScenesManager = {
  scenes: {},
  currentScene: null,
  renderer: null,

  /**
   * Determines whether the window is in portrait or landscape.
   *
   * @return {String} The string portrait or landscape.
   */
  get windowMode() {
    return this.height > this.width ? "portrait" : "landscape";
  },

  /**
   * General Setup
   *
   * @param  {Number} width  The width of the canvas element on the page.
   * @param  {Number} height The height of the canvas element on the page.
   * @return {Object}        The newly initialized Scene Manager.
   */
  initialize(width, height) {
    // Create a single instance of a renderer and append it to the page.
    if (this.renderer) return this;
    this.renderer = PIXI.autoDetectRenderer(width, height);
    this.renderer.backgroundColor = 0xffffff;
    document.body.appendChild(this.renderer.view);

    this.width = width;
    this.height = height;

    // If the desired width/height are the size of the window, keep it that way.
    if (width === window.innerWidth && height === window.innerHeight * 3) {
      window.onresize = () =>
        this.resize(window.innerWidth, window.innerHeight * 3);
    }

    // Start our animation loop and return our new ScenesManager.
    requestAnimationFrame(() => this.loop());
    return this;
  },

  /**
   * Function that resizes the canvas and renderer.
   *
   * @param  {Number} width  The desired width to resize to.
   * @param  {Number} height The desired height to resize to.
   */
  resize(newWidth, newHeight) {
    this.renderer.view.style.newWidth = `${newWidth} px`;
    this.renderer.view.style.newHeight = `${newHeight} px`;
    this.width = newWidth;
    this.height = newHeight;
    this.renderer.resize(newWidth, newHeight);
  },

  /**
   * Loop over our currentScene's update function, unless it's paused.
   */
  loop() {
    requestAnimationFrame(() => this.loop());
    if (!this.currentScene || this.currentScene.isPaused()) return;
    this.currentScene.update();
    this.renderer.render(this.currentScene);
  },

  /**
   * Creates a new scene and adds it to our ScenesManager.
   *
   * @param  {String} id        The desired name for our scene.
   * @param  {Object} SceneType The object we want to extend our scene from.
   * @return {Object}           Our newly created scene.
   */
  createScene(id, SceneType = BaseScene) {
    if (this.scenes[id]) return undefined;
    const scene = Object.create(SceneType);
    scene.id = id;
    this.scenes[id] = scene;
    scene.size(this.width, this.height);
    return scene;
  },

  /**
   * Sets our currentScene, helping us determine what a user sees and organize
   * our game scenes.
   *
   * @param  {String}  id The scene we would like to use
   * @return {Boolean}    Represents whether the scene we want to use exists.
   */
  goToScene(id) {
    if (!this.scenes[id]) return false;
    if (this.currentScene) this.currentScene.pause();
    this.currentScene = this.scenes[id];
    this.currentScene.size(this.width, this.height);
    this.currentScene.resume();
    return true;
  },
};
