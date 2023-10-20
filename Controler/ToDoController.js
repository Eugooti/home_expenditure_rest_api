const express = require('express');
const router = express.Router();
const ToDo = require('../Models/ToDoModel'); // Import your ToDo model

// Create a new to-do item
router.post('/toDo', async (req, res) => {
    const { title,date, description,  createdBy } = req.body;

    try {
        const todoItem = await ToDo.create({
            title,
            description,
            date,
            createdBy,
        });

        res.status(201).json({ todoItem });
    } catch (error) {
        console.error('Error creating to-do item:', error);
        res.status(500).json({ error: 'Failed to create to-do item' });
    }
});

// Get all to-do items
router.get('/toDoList', async (req, res) => {
    try {
        const toDoList = await ToDo.findAll();
        res.status(200).json({ toDoList });
    } catch (error) {
        console.error('Error retrieving to-do items:', error);
        res.status(500).json({ error: 'Failed to retrieve to-do items' });
    }
});

// Get a to-do item by ID
router.get('/toDo/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const todoItem = await ToDo.findByPk(id);

        if (!todoItem) {
            return res.status(404).json({ error: 'To-Do item not found' });
        }

        res.status(200).json({ todoItem });
    } catch (error) {
        console.error('Error retrieving to-do item:', error);
        res.status(500).json({ error: 'Failed to retrieve to-do item' });
    }
});

// Update a to-do item by ID
router.put('/toDo/:id', async (req, res) => {
    const id = req.params.id;
    const { name, description, date } = req.body;

    try {
        const todoItem = await ToDo.findByPk(id);

        if (!todoItem) {
            return res.status(404).json({ error: 'To-Do item not found' });
        }

        todoItem.name = name;
        todoItem.description = description;
        todoItem.date = date;

        await todoItem.save();

        res.status(200).json({ todoItem });
    } catch (error) {
        console.error('Error updating to-do item:', error);
        res.status(500).json({ error: 'Failed to update to-do item' });
    }
});

// Delete a to-do item by ID
router.delete('/toDo/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const todoItem = await ToDo.findByPk(id);

        if (!todoItem) {
            return res.status(404).json({ error: 'To-Do item not found' });
        }

        await todoItem.destroy();

        res.status(200).json({ message: 'To-Do item deleted successfully' });
    } catch (error) {
        console.error('Error deleting to-do item:', error);
        res.status(500).json({ error: 'Failed to delete to-do item' });
    }
});

// Get all to-do items created by a particular user
router.get('/toDoList/:user', async (req, res) => {
    const user = req.params.user;

    try {
        const toDoList = await ToDo.findAll({
            where: { createdBy: user },
        });

        res.status(200).json({ toDoList });
    } catch (error) {
        console.error('Error retrieving to-do items for the user:', error);
        res.status(500).json({ error: 'Failed to retrieve to-do items for the user' });
    }
});

module.exports = router;
