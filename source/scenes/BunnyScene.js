import { BaseScene } from "./BaseScene.js";
import { Bunny } from "../entities/Entity.js";
import { addListeners, distance, random } from "../utilities/index.js";


/**
 * BunnyScene
 *
 * A more specific scene that extends the Scene class.  It is developed to be
 * interactive, and utilizes both Bunny sprites as well as rxjs listeners from
 * "./Utilities".  This specific BunnyScene is full of falling bunnies.  Word.
 *
 * @property {Array}   models        Holds all of the bunny models for easy access.
 * @property {Number}  gravity       A base fall speed.  NOT MATHEMATICALLY ACCURATE.
 * @property {Object}  mousePosition The position of the mouse.
 * @property {Boolean} mouseMoving   Keeps track of whether the mouse is moving.
 * @property {Boolean} iteractive    Tells Pixi.js to allow interaction on this scene.
 */

export const BunnyScene = Object.assign(BaseScene, {
  models: [],
  gravity: 8,
  mousePosition: { x: null, y: null },
  mouseMoving: false,
  interactive: true,

  /**
   * General setup makes 1000 bunnies and sets listeners.
   *
   * @param  {Number} numBunnies The number of bunnies to be placed on the screen.
   * @return {Object}            The newly initialized scene.
   */
  initialize(numBunnies = 1500) {
    this.makeBunnies(numBunnies);
    this.listenForMouseMovement();
    return this;
  },

  /**
   * Listens to the mouse and sets mousePosition and mouseMoving.
   */
  listenForMouseMovement() {
    const mouseStop = debounce(() => this.mouseMoving = false, 1000);

    addListeners(this, [ "mousemove", "mouseover", "mouseout" ]);
    // For as long as the mouse is over the screen, listen for mousemove events.
    this.mouseovers
      .concatMap(() => {
        return this.mousemoves
          .takeUntil(this.mouseouts);
      })

      // For each mousemove event...
      .forEach(pos => {
        this.mouseMoving = true;

        // Set the mouse position to our event data.
        this.mousePosition.x = pos.data.global.x;
        this.mousePosition.y = pos.data.global.y;

        // After 1 second of mouse silence, set mouseMoving back to false.
        mouseStop.call(this);
      });
  },

  /**
   * Makes a shit ton of bunnies.
   *
   * @param  {Number} numberOfBunnies however many bunnies you want.
   */
  makeBunnies(numberOfBunnies) {
    for(let i=0; i <= numberOfBunnies; i++){ this.makeBunny() };
  },

  /**
   * Creates an instance of a Bunny, places it to a random location, and stores
   * a reference in the models array.
   *
   * @return {Object} The newly created bunny instance.
   */
  makeBunny() {
    let bunny = Bunny();
    bunny.initialize();
    bunny.position.x = random(0, window.innerWidth);
    bunny.position.y = random(-bunny.height, window.innerHeight * 3 + bunny.height);
    this.addChild(bunny);
    this.models.push(bunny);
    return bunny;
  },

  /**
   * The function that runs on every frame and updates all the bunny instances.
   */
  update() {
    this.models.forEach((model) => {
      model.position.y += model.mass * this.gravity;
      model.rotation += model.rotationSpeed;
      if(model.position.y > (window.innerHeight * 3 + model.height)) {
        model.position.y = -model.height;
        if(model.scale.y < 2) {
          model.position.x = random(0, window.innerWidth);
        }
      }
      if( this.mousePosition && this.mouseMoving &&
        distance(this.mousePosition, model.position) < Math.sqrt(model.height * model.width)/2) {
        model.scale.x += 0.1;
        model.scale.y += 0.1;
      }
    });
  }
});
