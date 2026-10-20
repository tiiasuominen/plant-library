const Database = require('better-sqlite3');

const db = new Database('plants.db');

function initDatabase() {
db.exec(`
CREATE TABLE IF NOT EXISTS plants (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
species TEXT NOT NULL,
location TEXT,
watering_frequency TEXT,
notes TEXT
)
`);

const result = db.prepare(
'SELECT COUNT(*) AS count FROM plants'
).get();

if (result.count === 0) {
const insertPlant = db.prepare(`
INSERT INTO plants
(name, species, location, watering_frequency, notes)
VALUES (?, ?, ?, ?, ?)
`);


const insertMany = db.transaction((plants) => {
for (const plant of plants) {
insertPlant.run(...plant);
}
});

insertMany([
[
'Monstera',
'Monstera deliciosa',
'Olohuone, ikkuna',
'Kerran viikossa',
'Kasvaa hyvin'
],
[
'Rauhanlilja',
'Spathiphyllum',
'Makuuhuone',
'Kahdesti viikossa',
'Pitää varjosta'
],
[
'Kaktus',
'Echinopsis',
'Keittiö',
'Kerran kuussa',
'Kastele harvoin'
],
[
'Orkidea',
'Phalaenopsis',
'Kylpyhuone',
'Kerran viikossa',
'Vaatii kosteutta'
],
[
'Joulutähti',
'Euphorbia pulcherrima',
'Olohuone, pöytä',
'Kahdesti viikossa',
'Ei pidä vedosta'
]
]);

console.log('Lisättiin 5 testikasvia tietokantaan.');
} else {
console.log('Tietokannassa on jo kasveja.');
}
}

module.exports = { db, initDatabase };