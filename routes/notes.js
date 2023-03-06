const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { findByIdAndUpdate } = require('../models/User');


//Route 1: Get all notes using Get "/api/notes/fetchallnotes". Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
  }
})

//Route 2: add notes using Post "/api/notes/addnotes". Login required
router.post('/addnotes', fetchuser, [
  body("title", "enter valid title").isLength({ min: 3 }),
  body("description", "enter valid description").isLength({ min: 5 }),
], async (req, res) => {
  const { title, description, tag } = req.body;
  //if there is error, return bad request and errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const note = new Notes({ title, description, tag, user: req.user.id });
    const savedNotes = await note.save();
    res.json(savedNotes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
  }
})

//Route 3: Update notes using Put "/api/notes/updatenotes/id". Login required
router.put('/updatenotes/:id', fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
    // create newNotes object
    const newNotes = {};
    if (title) { newNotes.title = title };
    if (description) { newNotes.description = description };
    if (tag) { newNotes.tag = tag };

    // find the notes to be updated and update it
    let notes = await Notes.findById(req.params.id);
    if (!notes) {
      return res.status(404).send("not found")
    }

    if (notes.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed")
    }

    notes = await Notes.findByIdAndUpdate(req.params.id, { $set: newNotes }, { new: true })
    res.json({ notes });
  }
  catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
  }
})

//Route 4: Delete notes using: Delete "/api/notes/deletenotes/id". Login required
router.delete('/deletenotes/:id', fetchuser, async (req, res) => {
  try {
    // find the notes to be deleted and delete it
    let notes = await Notes.findById(req.params.id);
    if (!notes) {
      return res.status(404).send("not found")
    }

    if (notes.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed")
    }

    notes = await Notes.findByIdAndDelete(req.params.id)
    res.json({ notes: notes, Result: 'Notes successfully deleted!' });
  }
  catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
  }
})

module.exports = router 