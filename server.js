const express = require('express');
const path = require('path');
const { db, initDatabase } = require('./database');

const app = express();
const PORT = 3000;

app.use(express.json());

try {
initDatabase();
} catch (error) {
console.error('Tietokannan alustus epäonnistui:', error);
process.exit(1);
}


app.use(express.static(__dirname));

app.get('/plants', (req, res) => {
try {
const plants = db.prepare(
'SELECT * FROM plants ORDER BY id'
).all();

res.json(plants);
} catch (error) {
console.error('Kasvien haku epäonnistui:', error);
res.status(500).json({
error: 'Kasvien hakeminen epäonnistui.'
});
}
});

app.get('/plants/:id', (req, res) => {
try {
const id = req.params.id;

if (!/^[1-9]\d*$/.test(id)) {
return res.status(400).json({
error: 'Virheellinen kasvin ID.'
});
}

const plant = db.prepare(
'SELECT * FROM plants WHERE id = ?'
).get(Number(id));

if (!plant) {
return res.status(404).json({
error: 'Kasvia ei löytynyt.'
});
}

res.json(plant);
} catch (error) {
console.error('Kasvin haku epäonnistui:', error);
res.status(500).json({
error: 'Kasvin hakeminen epäonnistui.'
});
}
});

const server = app.listen(PORT, () => {
console.log(
`Kasvikirjasto käynnissä: http://localhost:${PORT}`
);
});

function shutdown() {
server.close(() => {
db.close();
process.exit(0);
});
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);