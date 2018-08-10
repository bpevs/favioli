import { ScenesManager } from "./ScenesManager.js";
import { BunnyScene } from "./scenes/index.js";


/**
 * Main
 *
 * Our main file, and the first file loaded by webpack to be compiled.
 * This is where we create our instance of a scenesManager and handle switching
 * scenes.
 */

const scenesManager = Object.create(ScenesManager);
scenesManager.initialize(window.innerWidth, window.innerHeight * 3);
scenesManager.createScene("bunnyScene", BunnyScene).initialize();
scenesManager.goToScene("bunnyScene");
