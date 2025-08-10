import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Renders the main loader/welcome page
export const showWelcomePage = (req, res) => {
    // Serve the loader.html page
    res.sendFile(path.join(__dirname, "/public/loader.html"));
}

// Renders the contact page
export const showContactPage = (req,res)=>{
    res.render(__dirname +"/views/contact.ejs");
}

// Renders the subscription page
export const showSubscriptionPage = (req,res)=>{
    res.render(__dirname +"/views/subscription.ejs");
}

// Renders the QR page
export const showQrPage = (req,res)=>{
    res.render(__dirname +"/views/qr.ejs");
}

// Handles logout by redirecting to the login page
export const handleLogout = (req,res)=>{
    res.render(__dirname+"/views/login.ejs");
};