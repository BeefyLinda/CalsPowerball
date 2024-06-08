const express = require('express');
const fs = require('fs');
const path = require('path');
const { checkResults, resetPlayers } = require('./managePlayers');
const fetchPowerballResults = require('./fetchData');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/players', (req, res) => {
  const players = JSON.parse(fs.readFileSync(path.join(__dirname, 'players.json'), 'utf-8'));
  players.sort((a, b) => b.matched.length - a.matched.length || (b.matched.includes(b.powerballNumber) - a.matched.includes(a.powerballNumber)));
  res.json(players);
});

app.get('/draws', async (req, res) => {
  try {
    const results = await fetchPowerballResults();
    res.json(results.slice(0, 15)); // return the previous 15 draws
  } catch (error) {
    res.status(500).send('Error fetching draws');
  }
});

app.get('/added-draws', (req, res) => {
  const addedDraws = JSON.parse(fs.readFileSync(path.join(__dirname, 'addedDraws.json'), 'utf-8'));
  res.json(addedDraws);
});

app.get('/add-draw', (req, res) => {
  const draw = JSON.parse(req.query.draw);
  let addedDraws = JSON.parse(fs.readFileSync(path.join(__dirname, 'addedDraws.json'), 'utf-8'));
  addedDraws.push(draw);
  fs.writeFileSync(path.join(__dirname, 'addedDraws.json'), JSON.stringify(addedDraws, null, 2));
  checkResults().catch(console.error);
  res.send('Draw added to the game');
});

app.get('/remove-draw', (req, res) => {
  const draw = JSON.parse(req.query.draw);
  let addedDraws = JSON.parse(fs.readFileSync(path.join(__dirname, 'addedDraws.json'), 'utf-8'));
  addedDraws = addedDraws.filter(d => JSON.stringify(d) !== JSON.stringify(draw));
  fs.writeFileSync(path.join(__dirname, 'addedDraws.json'), JSON.stringify(addedDraws, null, 2));
  checkResults().catch(console.error);
  res.send('Draw removed from the game');
});

app.get('/reset-round', (req, res) => {
  fs.writeFileSync(path.join(__dirname, 'addedDraws.json'), JSON.stringify([], null, 2));
  resetPlayers();
  res.send('Round reset');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  checkResults().catch(console.error);
});
