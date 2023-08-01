const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
var fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

//---------------------------------------------------------------------//
// ROUTE 1: get all the notes using: POST "/api/notes/fetchallnotes"   //
//---------------------------------------------------------------------//
    router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch {
        console.error(error.message);
        res.status(500).send("Internal server error ");
    }
    });

    //-----------------------------------------------------------//
    // ROUTE 2: add a new note using: POST "/api/notes/addnote"  //
    //-----------------------------------------------------------//

    router.post("/addnote",fetchuser,
    [
        body("title", "title must be atleast 3 characters").isLength({ min: 3 }),
        body("description", "Description must be atleast 5 characters").isLength({
        min: 5,
        }),
    ],
    async (req, res) => {
        try {
        const { title, description, tag } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title,
            description,
            tag,
            user: req.user.id,
        });
        const savedNote = await note.save();
        res.json(savedNote);
        } catch {
        console.error(error.message);
        res.status(500).send("Internal server error ");
    }
}
);
// ROUTE 3:Update an existing note using: POST "/api/notes/updatenote"  login required //
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try{
        //new note creation
        const newNote = {};
        if (title) {
            newNote.title = title;
        }
        if (description) {
            newNote.description = description;
    }
    if (tag) {
        newNote.tag = tag;
    }
    
    // find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if (!note) {
        return res.status(404).send("note not found");
    }
    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
    }
    note = await Note.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
    )
        res.json({note});
        }
    catch(error){
            res.status(500).send("Internal server error ");
        }
});
// ROUTE 4: an existing note using: POST "/api/notes/deletenote"  login required //
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try{
    // find the note to be deleted and delete it
    let note = await Note.findById(req.params.id);
    if (!note) {
        return res.status(404).send("note not found");
    }
    //Allow deletion onlyif user owns this note
    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndDelete(
        req.params.id
    )
        res.json({"Success":"The note has been deleted", note: note});
        }
    catch(error){
            res.status(500).send("Internal server error ");
        }
});
module.exports = router;
