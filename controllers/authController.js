import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import session from "express-session";
import flash from "connect-flash";
import bcrypt from "bcryptjs";
import { db } from "../db.js";
import dotenv from "dotenv";
import crypto from 'crypto';


// controllers/authController.js (temporary placeholders)

export const getSignupPage = (req, res) => {
    res.render(path.join(__dirname, "/views/signup.ejs"), {
        username: "",
        email: "",
        password: "",
        messages: req.flash(),
    });
}
export const handleSignup = async(req, res) => {
    const { username, email, password } = req.body;
    console.log(req.body);

    // Input Validation
    if (!username || !email || !password) {
        req.flash("error", "All fields are required.");
        return res.redirect("/signup");
    }

    if (!/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(email)) {
        req.flash("error", "Please enter a valid email address.");
        return res.redirect("/signup");
    }

    try {
        // Hash the Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert User into Database
        const user = { username, email, password: hashedPassword };
        db.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", 
            [username, email, hashedPassword], (err) => {
                if (err) {
            req.flash("error", "Database error occurred: " + err.message);
            return res.redirect("/signup");
        }

        req.flash("success", "User registered successfully!");
        res.redirect("/login");
    });

    } catch (error) {
        req.flash("error", "Server error occurred: " + error.message);
        res.redirect("/signup");
    }
}

export const getLoginPage =  (req, res) => {
    res.render(path.join(__dirname, "/views/login.ejs"), {
        email: "",
        password: "",
        messages: req.flash()
    });
}


export const handleLogin = (req, res) => {
    const { email, password } = req.body;

    // Input Validation
    if (!email || !password) {
        req.flash("error", "Both email and password are required.");
        return res.redirect("/login");
    }

    try {
        // Check if user exists in database
        db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
            if (err) {
                req.flash("error", "Database error occurred: " + err.message);
                return res.redirect("/login");
            }

            if (result.length === 0) {
                req.flash("error", "No user found with this email. Please sign up.");
                return res.redirect("/signup");
            }

            // Compare the provided password with the hashed password in the database
            const user = result[0];
            const isMatch = await bcrypt.compare(password, user.password);
            const isAdmin = user.role === "admin";
            if (isAdmin) {
                return res.redirect("/admin");
            } else {
                if (!isMatch) {
                    req.flash("error", "Invalid password. Please try again.");
                    return res.redirect("/login");
                }
               
    
                // If login is successful, redirect to the home page
                req.flash("success", "Login successful!");
                res.redirect(`/home?email=${email}`);  // Assuming you have a home page
            }
            
        });
    } catch (error) {
        req.flash("error", "Server error occurred: " + error.message);
        res.redirect("/login");
    }
}


export const getForgotPasswordPage = (req, res) => {
    res.render("fpassword.ejs");
}


export const handleForgotPassword = (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send('Email is required.');
    }

    // Check if the email exists in the database
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error.');
        }

        if (results.length === 0) {
            return res.status(404).send('No account found with that email.');
        }

        // Generate a reset token and expiration
        const resetToken =crypto.randomBytes(32).toString('hex');
        const resetTokenExpiration = new Date(Date.now() + 3600000); // Token valid for 1 hour

        // Update the user's record with the reset token and expiration
        db.query(
            'UPDATE users SET reset_token = ?, reset_token_expiration = ? WHERE email = ?',
            [resetToken, resetTokenExpiration, email],
            (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error updating user record.');
                }

                // Optionally log the token (for testing purposes)
                console.log(`Reset token for ${email}: ${resetToken}`);

                // Render a success message or redirect
                res.redirect('rpassword');
            }
        );
    });
}


export const getResetPasswordPage = (req, res) => {
    const token = req.query.token || ''; // If a token is passed in the query
    res.render("rpassword.ejs", { token});
}


export const handleResetPassword =(req, res) => {
    const { email, newPassword } = req.body;  // Using email to identify the user

    if (!email || !newPassword) {
        return res.status(400).send('Email and new password are required.');
    }

    try {
        // Query the database to find the user by their email
        db.query(
            'SELECT * FROM users WHERE email = ?',
            [email],
            async (err, results) => {
                if (err) return res.status(500).send('Database error.');
                if (results.length === 0) return res.status(400).send('User not found.');

                // Hash the new password before storing it
                const hashedPassword = await bcrypt.hash(newPassword, 10);

                // Update the user's password in the database
                db.query(
                    'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?',
                    [hashedPassword, email],
                    (err) => {
                        if (err) return res.status(500).send('Error updating password.');
                        res.render('reset_success.ejs'); // Password reset success page
                    }
                );
            }
        );
    } catch (error) {
        res.status(500).send('Error resetting password.');
    }
}