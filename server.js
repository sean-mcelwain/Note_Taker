// Dependencies

const express = require('express');
const path = require('path');
const fs = require('fs');

// Sets up the Express App

const app = express();
const PORT = 3000;

// Sets up the Express app to handle data parsing

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Basic route that sends the user first to the AJAX Page


app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

app.get('/api/notes', () => fs.readFile('./db/db.json', 'utf8', (err, data) => {
  const databases = JSON.parse(data);
  databases.forEach(db => {
    console.log(`${db.title}: ${db.text}`);
});
}))


app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
