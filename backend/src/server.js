require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const connectDB = require('./config/db');

const authRoutes      = require('./routes/auth');
const protectedRoutes = require('./routes/protected');

const app  = express();
const PORT = process.env.PORT || 5000;

// Connect MongoDB
connectDB();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

app.use('/api/auth',      authRoutes);
app.use('/api/protected', protectedRoutes);

app.get('/api/health', (_req, res) =>
  res.json({ success: true, message: 'Server running', timestamp: new Date().toISOString() })
);

app.use((req, res) =>
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.path}` })
);

app.use((err, _req, res, _next) =>
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server error.' })
);

app.listen(PORT, () => {
  console.log(` Server   http://localhost:${PORT}`);
  console.log(` MongoDB    ${process.env.MONGO_URI}`);
  console.log(` Mode       ${process.env.NODE_ENV}\n`);
});

module.exports = app;