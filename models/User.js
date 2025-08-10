import { db } from "../db.js";
import bcrypt from "bcryptjs";
import crypto from 'crypto';

// This function finds a single user by their email address.
// I've upgraded it to use async/await for cleaner, more reliable code.
export const findByEmail = async (email) => {
    const [rows] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0]; // Returns the user object or undefined
};

// This function creates a new user.
// It also handles password hashing, as that's part of creating user data.
export const createUser = async (username, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.promise().query(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, hashedPassword]
    );
    return result.insertId; // Returns the ID of the newly created user
};

// Updates a user's record with a password reset token
export const updateResetToken = async (email) => {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiration = new Date(Date.now() + 3600000); // Token is valid for 1 hour

    await db.promise().query(
        "UPDATE users SET reset_token = ?, reset_token_expiration = ? WHERE email = ?",
        [resetToken, resetTokenExpiration, email]
    );
    return resetToken;
};

// Updates a user's password and clears the reset token
export const updatePassword = async (email, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.promise().query(
        "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiration = NULL WHERE email = ?",
        [hashedPassword, email]
    );
    return true;
};

// Updates a user's profile information (e.g., username)
export const updateProfile = async (username, email) => {
    // We use .promise() to allow for async/await
    await db.promise().query("UPDATE users SET username = ? WHERE email = ?", [username, email]);
    return true;
};

// Deletes a user from the database
export const deleteUser = async (email) => {
    await db.promise().query("DELETE FROM users WHERE email = ?", [email]);
    return true;
};