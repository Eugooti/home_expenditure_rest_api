const express = require('express');
const router = express.Router();
const User = require('../Models/UsersModel');
const bcrypt = require('bcrypt');
const passport = require('../Config/PassportConfig/passportConfig');


// Register a new user
router.post('/user', async (req, res) => {
    try {
        const { firstName, lastName, emailAddress, phoneNumber, access } = req.body;

        // Generate a salt and hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(emailAddress, saltRounds);

        const user = await User.create({
            firstName,
            lastName,
            emailAddress,
            access,
            phoneNumber,
            password: hashedPassword
        });

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            // Handle duplicate key error (emailAddress)
            return res.status(400).json({ error: 'User already exists with this email address' });
        }

        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Login with email and password
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: info.message });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            // Cookies are set up here after successful login
            res.cookie('sessionCookie', req.sessionID, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            });
            // Include user information in the response (excluding password)
            const { id,firstName,lastName,emailAddress,phoneNumber,access,activeState } = user;
            const userInfo = {id ,firstName,lastName,emailAddress,phoneNumber,access,activeState};
            return res.json({ message: 'Login successful', user: userInfo });
        });
    })(req, res, next);
});



// Logout
router.get('/logout', (req, res) => {
    // Clear the session and remove the session cookie
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ message: 'Logout failed' });
        }

        // Remove the session cookie
        res.clearCookie('sessionCookie');

        // Redirect or send a response indicating successful logout
        res.json({ message: 'Logout successful' });
    });
});


// Update a user by ID
router.put('/user/:id', async (req, res) => {
    const { id } = req.params;
    const { firstName,lastName, emailAddress, phoneNumber, access } = req.body;

    try {
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update the user attributes
        user.firstName = firstName;
        user.lastName = lastName;
        user.emailAddress = emailAddress;
        user.phoneNumber = phoneNumber;
        user.access = access;


        // Save the updated user
        await user.save();

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'firstName', 'lastName', 'emailAddress', 'access', 'phoneNumber', 'activeState'],
        });

        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
});

//Get user by id
router.get('/user/:id',async (req,res)=>{
    const {id}=req.params;
    try {
        const currentUser=await User.findByPk(id);

        if (!currentUser){
            return res.status(404).json({error:"user not found"})
        }
        res.status(200).json({currentUser})
    }catch (e) {
        res.status(500).json({ error: 'Failed to retrieve user' })
    }
})

//update user password
router.put('/password/:id',async (req,res)=>{
    const {id}=req.params;
    const {initialPassword,newPassword}=req.body;

    try {
        const user=await User.findByPk(id);

        const passwordMatch=await bcrypt.compare(initialPassword,user.password);

        if (!passwordMatch){
            res.status(401).json({error:"Invalid password"})
        }
        const saltRounds = 10;
        user.password=await bcrypt.hash(newPassword, saltRounds);
        await user.save()
        res.status(200).json({message:"Updated Successfully"})

    }catch (e) {
        res.status(500).json({error:"failed to update password"})
    }

})

module.exports = router;
