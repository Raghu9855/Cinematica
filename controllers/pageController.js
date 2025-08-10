import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Renders the main loader/welcome page
export const showWelcomePage = (req, res) => {
    // res.sendFile() is different and DOES need a full path. This line is correct.
    res.sendFile(path.join(__dirname, "../public/loader.html"));
};

// Renders the contact page
export const showContactPage = (req, res) => {
    // CORRECT: Just the name of the view.
    res.render("contact.ejs");
};

// Renders the subscription page
export const showSubscriptionPage = (req, res) => {
    // CORRECT: Just the name of the view.
    res.render("subscription.ejs");
};

// Renders the QR page
export const showQrPage = (req, res) => {
    // CORRECT: Just the name of the view.
    res.render("qr.ejs");
};

// Handles logout by redirecting to the login page
export const handleLogout = (req, res) => {
    // You should redirect on logout, but if you render, just use the name.
    res.render("login.ejs");
};