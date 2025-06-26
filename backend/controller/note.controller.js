import Note from "../model/note.model.js";

export const createNote = async (req, res) => {
    const { title, description } = req.body;
    try {
        // Validate the input
        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required" });
        }
        const note = await Note.create({
            userId: req.user._id,
            title,
            description
        })
        res.status(201).json(note);

    } catch (error) {
        console.error(`Error creating note: ${error.message}`);
        res.status(500).json({ message: "Internal server error" });
    }

}
// We will render all the notes for the specific user
export const getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.user._id }).sort({ createdAt: -1 });

        if (!notes || notes.length === 0) {
            return res.status(404).json({ message: "No notes found" });
        }
        console.log(`Fetched ${notes.length} notes for user: ${req.user._id}`);
        res.status(200).json(notes);

    } catch (error) {
        console.error(`Error fetching notes: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getNoteById = async (req, res) => {
    // Note ID is passed as a parameter in the URL
    const { id } = req.params;
    try {
        const note = await Note.findOne({ _id: id, userId: req.user._id });
        if (!note) {
            return res.status(404).json({ message: "note not found" });
        }
        res.status(200).json(note);
    } catch (error) {
        console.error(`Error fetching note by ID: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
export const updateNote = async (req, res) => {
    // Note ID is passed as a parameter in the URL
    const { id } = req.params;
    // The updated title and description are passed in the request body
    const { title, description } = req.body;

    try {
        const user = req.user._id;
        // Validate the input, if user only want to update only title or description
        if (!title && !description) {
            return res.status(400).json({ message: "Title or description is required for update" });
        }
        // Find the note by ID and user ID, then update it
        const note = await Note.findOneAndUpdate(
            { _id: id, userId: user },
            { title, description },
            { new: true } // Return the updated note
        )
        res.status(200).json(note);
    } catch (error) {
        console.error(`Error updating note: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteNote = async (req, res) => {
    const { id } = req.params;
    const user = req.user._id;
    try {
        const note = await Note.findOneAndDelete({ _id: id, userId: user });
        if (!note) {
            return res.status(404).json({ message: "Note not found or you don't have the permission to delete it" });
        }
        res.status(200).json({ message: "Note deleted Successfully" });
    } catch (error) {
        console.error(`Error deleting note:${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
}