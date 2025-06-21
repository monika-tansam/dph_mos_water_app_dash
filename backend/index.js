import express from 'express';
import session from 'express-session';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

//Chlorination
import cron from 'node-cron';
import { exec } from 'child_process';

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
app.use(express.json({ limit: '150mb' }));
app.use(express.urlencoded({ extended: true, limit: '150mb' }));

// CORS
app.use(cors({
  origin: 'http://localhost:5173', // Or change to your actual frontend
  credentials: true
}));

// Schedule tasks manually (e.g. daily via cron)
// app.get('/schedule', async (req, res) => {
//   await scheduleTasks();
//   res.send('Task scheduling done.');
// });
// Run every day at 6 PM
cron.schedule('0 18 * * *', () => {
  console.log('🕒 Running chlorination prediction via cron...');
  exec('node ./scripts/chlorinationSchedule.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`⚠️ Stderr: ${stderr}`);
      return;
    }
    console.log(stdout);
  });
});

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
