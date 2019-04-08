
"use strict";

// Express & Socket.io deps
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const _ = require('lodash');

const news = ['left','right','up','down']
const Snake = require('./elements/snake');
const Apple = require('./elements/apple');

// auto incrementer for gathering users in a session
let autoId = 0;
// size of grid
const GRID_SIZE = 35;
// other players
let players = [];
// Apples 🍎
let apples = [];

//Server on api hit
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});

//Check incomming clients
io.on('connection', (client) => {
  let player;
  let id;

  client.on('auth', (opts, cb) => {
    // Create player
    id = ++autoId;
    player = new Snake(_.assign({
      id,
      dir: news[Math.random() * 3 | 0],//Make snake take random directions
      gridSize: GRID_SIZE,//Grid size should be common across all the viewers/players
      snakes: players,//players already existing
      apples
    }, opts));
    players.push(player);
    // Callback with id
    cb({ id: autoId });
  });

  // Receive keystrokes
  client.on('key', (key) => {
    // and change direction accordingly
    if(player) {
      player.changeDirection(key);
    }
  });

  // Remove players on disconnect
  client.on('disconnect', () => {
    _.remove(players, player);
  });
});

// Create apples
for(var i=0; i < 3; i++) {
  apples.push(new Apple({
    gridSize: GRID_SIZE,
    snakes: players,
    apples
  }));
}


// let this loop reoccur every interval so as to emulate epochs/movements
setInterval(() => {
  players.forEach((p) => {
    p.move();
  });
  io.emit('state', {
    players: players.map((p) => ({
      x: p.x,
      y: p.y ,
      id: p.id,
      nickname: p.nickname,
      points: p.points,
      tail: p.tail
    })),
    apples: apples.map((a) => ({
      x: a.x,
      y: a.y
    }))
  });
}, 200);

