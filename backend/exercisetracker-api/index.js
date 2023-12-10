const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const users = [];
const exercises = [];
let counter = 1;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/api/users', (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const existingUser = users.find(user => user.username === username);

  if (existingUser) {
    return res.json(existingUser);
  }

  const newUser = { username, _id: counter++ + '' }; // Convert counter to string
  users.push(newUser);

  res.json(newUser);
});

app.get('/api/users', (req, res) => {
  const usersList = users.map(user => ({ username: user.username, _id: user._id }));
  res.json(usersList);
});

// Add exercises
app.post('/api/users/:_id/exercises', (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;

  if (!description || !duration) {
    return res.status(400).json({ error: 'Description and duration are required' });
  }

  const user = users.find(user => user._id == _id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const exercise = {
    userId: user._id,
    description,
    duration: parseInt(duration),
    date: date ? new Date(date) : new Date(),
  };

  exercises.push(exercise);

  // Return the user object with the exercise fields added
  res.json({
    username: user.username,
    _id: user._id,
    description: exercise.description,
    duration: exercise.duration,
    date: exercise.date.toDateString(),
  });
});

app.get('/api/users/:_id/logs', (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;

  const user = users.find(user => user._id == _id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  let log = exercises.filter(exercise => exercise.userId == user._id);

  if (from || to) {
    log = log.filter(exercise => {
      const exerciseDate = new Date(exercise.date);
      return (!from || exerciseDate >= new Date(from)) && (!to || exerciseDate <= new Date(to));
    });
  }

  const count = log.length;

  if (limit) {
    log = log.slice(0, parseInt(limit));
  }

  // Convert the date property to a string in the desired format
  log = log.map(exercise => ({
    description: exercise.description,
    duration: exercise.duration,
    date: exercise.date.toDateString(),
  }));

  res.json({
    username: user.username,
    count,
    _id: user._id,
    log,
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
