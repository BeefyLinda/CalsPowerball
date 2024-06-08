const fs = require('fs');
const path = require('path');
const fetchPowerballResults = require('./fetchData');

const playersFilePath = path.join(__dirname, 'players.json');
const addedDrawsFilePath = path.join(__dirname, 'addedDraws.json');

function addPlayer(name, whiteNumbers, powerballNumber) {
  const players = JSON.parse(fs.readFileSync(playersFilePath, 'utf-8'));
  players.push({ name, whiteNumbers, powerballNumber, matched: [] });
  fs.writeFileSync(playersFilePath, JSON.stringify(players, null, 2));
}

function resetPlayers() {
  const players = JSON.parse(fs.readFileSync(playersFilePath, 'utf-8'));
  players.forEach(player => {
    player.matched = [];
  });
  fs.writeFileSync(playersFilePath, JSON.stringify(players, null, 2));
}

async function checkResults() {
  const players = JSON.parse(fs.readFileSync(playersFilePath, 'utf-8'));
  const addedDraws = JSON.parse(fs.readFileSync(addedDrawsFilePath, 'utf-8'));

  players.forEach(player => {
    player.matched = [];
  });

  addedDraws.forEach(result => {
    const [powerball, ...whites] = result.numbers.reverse();

    players.forEach(player => {
      player.whiteNumbers.forEach(num => {
        if (whites.includes(num) && !player.matched.includes(num)) {
          player.matched.push(num);
        }
      });
      if (player.powerballNumber === powerball && !player.matched.includes(powerball)) {
        player.matched.push(powerball);
      }
    });
  });

  fs.writeFileSync(playersFilePath, JSON.stringify(players, null, 2));
}

module.exports = {
  addPlayer,
  checkResults,
  resetPlayers
};
