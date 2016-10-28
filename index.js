// Use ES6
"use strict";

// Express & Socket.io deps
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Key maps
const KEYS = {
  up: 38,
  right: 39,
  down: 40,
  left: 37
};

// Handy remove method for arrays
Array.prototype.remove = function(e) {
  var p, _;
  if ((p = this.indexOf(e)) > -1) {
    return ([].splice.apply(this, [p, p - p + 1].concat(_ = [])), _);
  }
};

// Remote players
var players = [];

class Snake {
  constructor(dir, x, y) {
    this.dir = dir; //direction
    this.x = x;
    this.y = y;
  }

  changeDirection(key) {
    switch (key) {
      case KEYS.up:
        if (this.dir !== 'down')
          this.dir = 'up'; break;
      case KEYS.right:
        if (this.dir !== 'left')
          this.dir = 'right'; break;
      case KEYS.down:
        if (this.dir !== 'up')
          this.dir = 'down'; break;
      case KEYS.left:
        if (this.dir !== 'right')
          this.dir = 'left'; break;
    }
  }

  move() {
    switch(this.dir) {
      case 'right':
        this.x++; break;
      case 'left':
        this.x--; break;
      case 'up':
        this.y--; break;
      case 'down':
        this.y++; break;
    }

    // Boundaries
    if(this.x > 30-1) this.x = 0;
    if(this.x < 0) this.x = 30-1;
    if(this.y > 30-1) this.y = 0;
    if(this.y < 0) this.y = 30-1;
  }
}

/*
 * Serve client
 */

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});

/*
 * Listen for incoming clients
 */
io.on('connection', (client) => {
  var player = new Snake('right', 0, 1);
  players.push(player);

  // Receive keystrokes
  client.on('key', (key) => {
    // and change direction accordingly
    player.changeDirection(key);
  });

  // Remove player on disconnect
  client.on('disconnect', () => {
    players.remove(player);
  });
});

// Main loop
setInterval(() => {
  players.forEach((p) => { p.move(); });
  io.emit('state', {
    players: players.map((p) => ({ x: p.x, y: p.y })),
    apples: [{x: 10, y: 10}]
  });
}, 100);

