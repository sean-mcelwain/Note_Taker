// Dependencies

const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');

// Sets up the Express App

const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// API Routes

const readDB = util.promisify(fs.readFile);
const writeDB = util.promisify(fs.writeFile);

app.get('/api/notes', (req, res) => {
  readDB('./db/db.json', 'utf8').then((data) =>{
    const notes = [].concat(JSON.parse(data))
    res.json(notes);
  })
});

app.post('/api/notes', (req, res) => {
  const  note = req.body;
  readDB('./db/db.json', 'utf8').then((data) => {
    const notes = [].concat(JSON.parse(data));
    note.id = notes.length +1
    notes.push(note);
    return notes
  }).then((notes) => {
    writeDB('./db/db.json', JSON.stringify(notes))
    res.json(note);
  })
});

app.delete('/api/notes/:id',  (req, res) => {
  const noteID = parseInt(req.params.id);
  readDB('./db/db.json', 'utf8').then((data) => {
    const notes = [].concat(JSON.parse(data));
    const notesUpdated = []
    for (let i = 0; i<notes.length; i++) {
    if (noteID !== notes[i].id) {
      notesUpdated.push(notes[i])
    }
} 
return notesUpdated
}).then((notes) => {
  writeDB('./db/db.json', JSON.stringify(notes))
  res.send()
})
})

// HTML Routes

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

// Listener

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
