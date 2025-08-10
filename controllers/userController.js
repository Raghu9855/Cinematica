import bcrypt from "bcryptjs";
import * as User from '../models/User.js'; // We only import the User model

// Renders the user's profile page
export const getProfilePage = async (req, res) => {
    const email = req.query.email;
    if (!email) {
        return res.status(400).send('Email is required');
    }

    try {
        // Use the model to find the user
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('profile', { user });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Handles updating a user's profile
export const updateProfile = async (req, res) => {
    const { email, username } = req.body;
    try {
        // Use the model to update the profile
        await User.updateProfile(username, email);
        res.redirect(`/profile?email=${email}`);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).send('Server Error: Could not update profile');
    }
};

// Renders the page to confirm account deletion
export const getDeleteAccountPage = (req, res) => {
    res.render("daccount.ejs");
};

// Handles deleting a user's account
export const deleteAccount = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        req.flash('error', 'Both email and password are required.');
        return res.redirect('/deleteaccount');
    }

    try {
        // Use the model to find the user
        const user = await User.findByEmail(email);
        if (!user) {
            req.flash('error', 'No account found with the specified email.');
            return res.redirect('/deleteaccount');
        }

        // The controller verifies the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash('error', 'Invalid password. Please try again.');
            return res.redirect('/deleteaccount');
        }

        // Use the model to delete the user
        await User.deleteUser(email);

        req.flash('success', 'Account deleted successfully!');
        res.redirect('/signup');

    } catch (error) {
        req.flash('error', 'Server error occurred: ' + error.message);
        res.redirect('/home');
    }
};