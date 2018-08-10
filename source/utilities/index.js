/**
 * Attaches reactive events to dom elements.
 */
export function addListeners(element, events) {
  events.forEach(function addListener(event) {
    element[event + "s"] = Observable.fromEvent(element, event);
  });
}

/**
 * Finds the distance between two points.
 *
 * @param  {Object} p1 A point object consisting of properties x and y.
 * @return {Number} p2 The distance between the two points.
 */
export function distance(p1, p2) {
  return Math.sqrt(
    (p2.x-p1.x) * (p2.x-p1.x) + (p2.y-p1.y) * (p2.y-p1.y));
}

/**
 * Finds weight from the mass and scene gravity.
 *
 * @param  {Number} mass    The mass of an object.
 * @param  {Number} gravity The force of gravity acting upon an object.
 * @return {Number}         The weight of the object.
 */
export function getWeight(mass, gravity = 9.8) {
  return mass * gravity;
}

export function random(lower, upper) {
  return Math.floor(Math.random() * upper) + lower;
}
