const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database Setup
const db = new sqlite3.Database(':memory:', (err) => {
  if (err) console.error('Database error:', err);
  else console.log('Connected to SQLite database');
});

// Create tables
db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Courses table
  db.run(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      instructor TEXT NOT NULL,
      image_url TEXT,
      duration TEXT,
      level TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Enrollments table
  db.run(`
    CREATE TABLE IF NOT EXISTS enrollments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      course_id INTEGER NOT NULL,
      progress INTEGER DEFAULT 0,
      enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(course_id) REFERENCES courses(id)
    )
  `);

  // User Submitted Stories table (needs approval)
  db.run(`
    CREATE TABLE IF NOT EXISTS submitted_stories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      language TEXT NOT NULL,
      level TEXT NOT NULL,
      content TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      approved_at DATETIME,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  // Seed sample courses
  db.run(`
    INSERT OR IGNORE INTO courses (title, description, instructor, level, duration)
    VALUES 
      ('Web Development Basics', 'Learn HTML, CSS, and JavaScript fundamentals', 'Sarah Chen', 'Beginner', '4 weeks'),
      ('Advanced React Patterns', 'Master React hooks, context, and performance optimization', 'Mike Johnson', 'Advanced', '6 weeks'),
      ('Data Science Essentials', 'Python, pandas, and machine learning basics', 'Dr. Priya Sharma', 'Intermediate', '8 weeks'),
      ('UI/UX Design Fundamentals', 'Design principles and tools for modern interfaces', 'Alex Rivera', 'Beginner', '5 weeks'),
      ('Full Stack JavaScript', 'Node.js, Express, and databases for full stack development', 'Emma Wilson', 'Intermediate', '10 weeks')
  `);
});

// Routes

// Register
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      function (err) {
        if (err) {
          return res.status(400).json({ error: 'Username or email already exists' });
        }

        const token = jwt.sign({ id: this.lastID, username }, JWT_SECRET, {
          expiresIn: '7d',
        });

        res.json({ token, user: { id: this.lastID, username, email } });
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  });
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.userId = decoded.id;
    next();
  });
};

// Get all courses
app.get('/api/courses', (req, res) => {
  db.all('SELECT * FROM courses', (err, courses) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json(courses);
  });
});

// Get user enrollments
app.get('/api/enrollments', verifyToken, (req, res) => {
  db.all(
    `SELECT c.*, e.progress, e.enrolled_at FROM enrollments e
     JOIN courses c ON e.course_id = c.id
     WHERE e.user_id = ?`,
    [req.userId],
    (err, enrollments) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      res.json(enrollments);
    }
  );
});

// Enroll in course
app.post('/api/enrollments/:courseId', verifyToken, (req, res) => {
  const { courseId } = req.params;

  db.run(
    'INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)',
    [req.userId, courseId],
    function (err) {
      if (err) {
        return res.status(400).json({ error: 'Already enrolled or course not found' });
      }
      res.json({ success: true, enrollmentId: this.lastID });
    }
  );
});

// Contact form
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields required' });
  }

  // In production, send this email or save to database
  console.log(`Contact from ${name} (${email}): ${message}`);

  res.json({ success: true, message: 'Thank you for contacting us!' });
});

// Submit a story (needs approval)
app.post('/api/stories/submit', verifyToken, (req, res) => {
  const { title, language, level, content, description } = req.body;

  if (!title || !language || !level || !content) {
    return res.status(400).json({ error: 'All fields required' });
  }

  db.run(
    `INSERT INTO submitted_stories (user_id, title, language, level, content, description, status)
     VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
    [req.userId, title, language, level, content, description],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to submit story' });
      }
      res.json({ 
        success: true, 
        message: 'Story submitted! Waiting for admin approval.',
        storyId: this.lastID 
      });
    }
  );
});

// Get pending stories (ADMIN ONLY - for you to approve)
app.get('/api/admin/stories/pending', verifyToken, (req, res) => {
  // In production, check if user is admin
  // For now, this is accessible to anyone with token
  db.all(
    `SELECT s.*, u.username FROM submitted_stories s
     JOIN users u ON s.user_id = u.id
     WHERE s.status = 'pending'
     ORDER BY s.created_at DESC`,
    (err, stories) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      res.json(stories);
    }
  );
});

// Get all approved stories
app.get('/api/stories/approved', (req, res) => {
  db.all(
    `SELECT s.*, u.username FROM submitted_stories s
     JOIN users u ON s.user_id = u.id
     WHERE s.status = 'approved'
     ORDER BY s.created_at DESC`,
    (err, stories) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      res.json(stories);
    }
  );
});

// Approve a story (ADMIN ONLY)
app.post('/api/admin/stories/:id/approve', verifyToken, (req, res) => {
  const { id } = req.params;
  // In production, verify user is admin
  
  db.run(
    `UPDATE submitted_stories SET status = 'approved', approved_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [id],
    (err) => {
      if (err) return res.status(500).json({ error: 'Failed to approve' });
      res.json({ success: true, message: 'Story approved!' });
    }
  );
});

// Reject a story (ADMIN ONLY)
app.post('/api/admin/stories/:id/reject', verifyToken, (req, res) => {
  const { id } = req.params;
  // In production, verify user is admin
  
  db.run(
    `UPDATE submitted_stories SET status = 'rejected' WHERE id = ?`,
    [id],
    (err) => {
      if (err) return res.status(500).json({ error: 'Failed to reject' });
      res.json({ success: true, message: 'Story rejected' });
    }
  );
});

// Get current user info
app.get('/api/user', verifyToken, (req, res) => {
  db.get('SELECT id, username, email FROM users WHERE id = ?', [req.userId], (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
