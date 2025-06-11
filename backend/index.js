const express = require('express');
const session = require('express-session');
const app = express();
const loginRoute = require('./routes/login');
const captchaRoute = require('./routes/captcha');
const forgotPasswordRoute = require('./routes/forgotPassword');

app.use(express.json());

app.use(session({
    secret: 'your-secret-key', // use env var in production
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 5 * 60 * 1000 } // 5 minutes
}));

app.use('/login', loginRoute);
app.use('/captcha', captchaRoute); // GET /captcha returns SVG image
app.use('/forgot-password', forgotPasswordRoute);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});