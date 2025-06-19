import express from 'express';
import session from 'express-session';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Route imports
import loginRoute from './routes/login.js';
import captchaRoute from './routes/captcha.js';
import forgotPasswordRoute from './routes/forgotPassword.js';
import dashboardRoute from './routes/dashboard.js';

const app = express();

// Setup __dirname (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Serve uploaded images statically
app.use('/uploads', express.static(uploadDir));

// ⬇️ Accept up to 50MB payloads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS
app.use(cors({
  origin: 'http://localhost:5173', // Or change to your actual frontend
  credentials: true
}));

// Session setup
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 5 * 60 * 1000 }
}));

// ✅ Route setup
app.use('/login', loginRoute);
app.use('/captcha', captchaRoute);
app.use('/forgot-password', forgotPasswordRoute);
app.use('/dashboard', dashboardRoute);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
