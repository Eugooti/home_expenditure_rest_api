const Category = require('../Models/Category');
const express = require('express');
const router = express.Router();
const Expenditure = require('../Models/ExpenditureModel');

// Post category
router.post('/category', async (req, res) => {
    const { name, description, maximumCash, createdBy } = req.body;

    try {
        const category = await Category.create({
            name,
            description,
            maximumCash,
            createdBy,
        });

        res.status(201).json({ category,message: 'Category created successfully' });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ Error: 'Failed to create category' });
    }
});

// Get all categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json({ categories });
    } catch (error) {
        console.error('Error retrieving categories:', error);
        res.status(500).json({ error: 'Failed to retrieve categories' });
    }
});

// Get categories created by a particular user
router.get('/categories/:user', async (req, res) => {
    const user = req.params.user;

    try {
        const categories = await Category.findAll({
            where: { createdBy: user },
        });

        res.status(200).json({ categories });
    } catch (error) {
        console.error('Error retrieving categories for the user:', error);
        res.status(500).json({ error: 'Failed to retrieve categories for the user' });
    }
});

// Get category by ID
router.get('/categories/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findByPk(categoryId);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.status(200).json({ category });
    } catch (error) {
        console.error('Error retrieving category:', error);
        res.status(500).json({ error: 'Failed to retrieve category' });
    }
});

// Update category by ID
router.put('/category/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { name, maximumCash } = req.body;

        const category = await Category.findByPk(categoryId);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Update the category
        category.name = name;
        category.maximumCash = maximumCash;

        await category.save();

        res.status(200).json({ category,message: 'Category updated successfully' });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Failed to update category' });
    }
});

// Delete category by ID
router.delete('/category/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;

        const category = await Category.findByPk(categoryId);
        const expenditure = await Expenditure.findOne({ where: { category: category.name } });

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        if (expenditure) {
            return res.status(404).json({ error: 'Category in use' });
        }

        // Delete the category
        await category.destroy();

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Failed to delete category' });
    }
});

module.exports = router;
