import bcrypt from "bcryptjs";
import * as User from '../models/User.js'; // Import our new model functions

// Renders the signup page
export const getSignupPage = (req, res) => {
    res.render("signup.ejs", { messages: req.flash() });
};

// Handles the logic for the signup form submission
export const handleSignup = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password || !/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(email)) {
        req.flash("error", "Please provide valid information for all fields.");
        return res.redirect("/signup");
    }

    try {
        // Use the Model to check if the user exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            req.flash("error", "An account with this email already exists.");
            return res.redirect("/signup");
        }
        
        // Use the Model to create the user
        await User.createUser(username, email, password);

        req.flash("success", "Registration successful! Please log in.");
        res.redirect("/login");
    } catch (error) {
        req.flash("error", "A server error occurred during registration.");
        res.redirect("/signup");
    }
};

// Renders the login page
export const getLoginPage = (req, res) => {
    res.render("login.ejs", { messages: req.flash() });
};

// Handles the logic for the login form submission
export const handleLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        req.flash("error", "Both email and password are required.");
        return res.redirect("/login");
    }

    try {
        // Use the Model to find the user
        const user = await User.findByEmail(email);
        if (!user) {
            req.flash("error", "Invalid credentials.");
            return res.redirect("/login");
        }

        // The controller handles comparing the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash("error", "Invalid credentials.");
            return res.redirect("/login");
        }

        // Login successful, handle session here
        // For example: req.session.userId = user.id;

        if (user.role === "admin") {
            return res.redirect("/admin");
        }
        res.redirect(`/home?email=${email}`);

    } catch (error) {
        req.flash("error", "A server error occurred during login.");
        res.redirect("/login");
    }
};

// Display forgot password page
export const getForgotPasswordPage = (req, res) => {
    res.render("fpassword.ejs");
};


export const handleForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findByEmail(email);

        if (user) {
            // The model generates and saves the token
            const token = await User.updateResetToken(email);
            
            // For testing, we log the token
            console.log(`Password reset token for ${email}: ${token}`);
        }
        
        // --- THIS IS THE CHANGE ---
        // Instead of sending text, redirect the user to the next step.
        res.redirect('/rpassword');

    } catch (error) {
        console.error('Error in forgot password process:', error);
        res.status(500).send("A server error occurred.");
    }
};

// Display reset password page
export const getResetPasswordPage = (req, res) => {
    res.render("rpassword.ejs");
};

// Handle reset password submission
export const handleResetPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
        return res.status(400).send("Email and new password are required.");
    }
    try {
        // Use the Model to update the password
        await User.updatePassword(email, newPassword);
        res.render('reset_success.ejs');
    } catch (error) {
        res.status(500).send("Error resetting password.");
    }
};