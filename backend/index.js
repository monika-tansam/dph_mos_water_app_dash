import express from 'express';
import session from 'express-session';
import cors from 'cors';
import loginRoute from './routes/login.js';
import captchaRoute from './routes/captcha.js';
import forgotPasswordRoute from './routes/forgotPassword.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // your frontend URL
    credentials: true
}));
app.use(express.json());

app.use(session({
    secret: 'your-secret-key', // use env var in production
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 5 * 60 * 1000 } // 5 minutes
}));

app.use('/login', loginRoute);
app.use('/captcha', captchaRoute);
app.use('/forgot-password', forgotPasswordRoute);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});