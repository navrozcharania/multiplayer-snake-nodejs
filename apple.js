// Use ES6
"use strict";

/*
 * Apple class
 */
class Apple {
  constructor(snakes, apples) {
    this.snakes = snakes;
    this.apples = apples;
    this.respawn();
  }

  respawn() {
    this.x = Math.random() * 30 | 0;
    this.y = Math.random() * 30 | 0;

    this._checkCollisions();

    return this;
  }

  _checkCollisions() {
    // With snakes
    this.snakes.forEach((s) => {
      // Head
      if(s.x === this.x && s.y === this.y) {
        this.respawn();
      }
      // Tail
      s.tail.forEach((t) => {
        if(t.x === this.x && t.y === this.y) {
          this.respawn();
        }
      });
    });
    // With apples
    this.apples.forEach((a) => {
      // Except self
      if(this !== a) {
        if(a.x === this.x && a.y === this.y) {
          this.respawn();
        }
      }
    });
  }
}

module.exports = Apple;