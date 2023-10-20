const express = require('express');
const router = express.Router();
const Expenditure = require('../Models/ExpenditureModel');

// CREATE a new expenditure
router.post('/expenditure', async (req, res) => {
    const { name, category, cost, description, createdBy } = req.body;
    const updatedBy = createdBy;

    try {
        const expenditure = await Expenditure.create({ name, category, cost, description, createdBy, updatedBy });
        res.status(201).json({ message:"Expenditure created successfully" });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create expenditure' });
    }
});

// READ all expenditures
router.get('/expenditures', async (req, res) => {
    try {
        const expenditures = await Expenditure.findAll();
        res.status(200).json({ expenditures });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve expenditures' });
    }
});

// READ expenditures created by a particular user
router.get('/expenditures/:user', async (req, res) => {
    const user = req.params.user;

    try {
        const expenditures = await Expenditure.findAll({
            where: { createdBy: user },
        });

        res.status(200).json({ expenditures });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve expenditures for the user' });
    }
});

// READ an expenditure by ID
router.get('/expenditures/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const expenditure = await Expenditure.findByPk(id);

        if (!expenditure) {
            return res.status(404).json({ error: 'Expenditure not found' });
        }

        res.status(200).json({ expenditure });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve expenditure' });
    }
});

// UPDATE an expenditure by ID
router.put('/expenditure/:id', async (req, res) => {
    const { id } = req.params;
    const { name, category, cost } = req.body;

    try {
        const expenditure = await Expenditure.findByPk(id);

        if (!expenditure) {
            return res.status(404).json({ error: 'Expenditure not found' });
        }

        expenditure.name = name;
        expenditure.category = category;
        expenditure.cost = cost;

        await expenditure.save();

        res.status(200).json({ message:"Expenditure updated successfully" });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update expenditure' });
    }
});

// DELETE an expenditure by ID
router.delete('/expenditure/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const expenditure = await Expenditure.findByPk(id);

        if (!expenditure) {
            return res.status(404).json({ error: 'Expenditure not found' });
        }

        await expenditure.destroy();

        res.status(200).json({ message: 'Expenditure deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete expenditure' });
    }
});

module.exports = router;
