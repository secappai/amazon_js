const express = require('express');
const bcrypt = require('bcryptjs');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');
const multer = require('multer'); // Importer multer

const db = new sqlite3.Database('citrouille.db');
const upload = multer({ dest: 'uploads/' }); // Configurer le répertoire de destination pour les fichiers téléchargés

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'your-secret-key', // Used to sign the session ID cookie
  resave: false, // Don't save session if unmodified
  saveUninitialized: true, // Save uninitialized sessions
  // Other options...
}));

// create the users table if not exist 
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )
`);

// create the info table if not exist
db.run(`
  CREATE TABLE IF NOT EXISTS info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fname TEXT NOT NULL,
    lname TEXT NOT NULL,
    bdate TEXT NOT NULL,
    pseudo TEXT NOT NULL,
    pp TEXT,
    email TEXT NOT NULL UNIQUE
  )
`);


// Route to handle POST requests to "/register"
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the email is already registered
    const user = await getUserByEmail(email);
    if (user) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash the password

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await insertUser(email, hashedPassword);

    console.log('Registration successful');

    // Go to the login page
    res.redirect('login.html');

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to handle POST requests to "/login"
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Get the user from the database
    const user = await getUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('Login successful');

    req.session.email = email;
    console.log(req.session.email);

    // Go to the home page
    res.redirect('home.html');

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to handle POST requests to "/home"
app.post('/home', upload.single('pp'), async (req, res) => {
  const { fname, lname, bdate, pseudo } = req.body;

  try {
    // Validate form body
    if (!fname || !lname || !bdate || !pseudo) {
      return res.status(400).json({ error: 'Please fill in all required fields' });
    }

    // Get email from session
    const email = req.session.email;

    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Read the file and encode it to base64
    const fs = require('fs');
    const fileData = fs.readFileSync(req.file.path);
    const base64 = fileData.toString('base64');


    // Insert user information into 'info' table
    await insertUserInfo(fname, lname, bdate, pseudo, base64, email);

    console.log('Information saved successfully');

    // Go to the ok page
    res.redirect('ok.html');

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper functions for database operations
async function getUserByEmail(email) {
  const query = 'SELECT * FROM users WHERE email = ?';
  return new Promise((resolve, reject) => {
    db.get(query, [email], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

async function insertUser(email, hashedPassword) {
  const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
  return new Promise((resolve, reject) => {
    db.run(query, [email, hashedPassword], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

async function insertUserInfo(fname, lname, bdate, pseudo, profilePicture, email) {
  const query = `
    INSERT INTO info (fname, lname, bdate, pseudo, pp, email)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  return new Promise((resolve, reject) => {
    db.run(query, [fname, lname, bdate, pseudo, profilePicture, email], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));
