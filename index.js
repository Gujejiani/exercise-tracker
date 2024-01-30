const express = require('express')
const app = express()
const cors = require('cors')
const { mongo } = require('mongoose')
require('dotenv').config()
const mongoose = require("mongoose");

app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const DB = process.env.MONGO_DB_URL.replace(
  "<password>",
 process.env.MONGO_PASSWORD
);

const Users = require('./models/users')
const Exercise = require('./models/exercise')
app.post('/api/users', async (req, res)=>{
  const username = req.body.username
  const randomId = generateRandomId()
  const user = await Users.create({username: username})
  
  res.json(user)
})

app.get('/api/users',  async (req, res)=>{

  const usersData = await Users.find({}).select('-__v -log -count');
  res.json(usersData)
})


app.post('/api/users/:_id/exercises', async (req, res)=>{

  // const userIndex = users.findIndex(user => user._id === req.params._id)

 
    const date = req?.body?.date ? new Date(req.body.date).toDateString(): new Date().toDateString()
    await Exercise.create({
      user_id: req.params._id,
      description: req.body.description,
      duration: Number(req.body.duration),
      date: date
    })
    const user = await Users.findById(req.params._id);
    
   return  res.json({
      _id: req.params._id,
      username: user.username,
      description: req.body.description,
      duration: Number(req.body.duration),
      date: req?.body?.date? new Date(req.body.date).toDateString(): new Date().toDateString()
    
   })
  

 


})
app.get('/api/users/:_id/logs', async (req, res) => {
  try {
    const user = await Users.findById(req.params._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let { from, to, limit } = req.query;

    let dateFilter = {
      user_id: user._id,
      date: {}
    };

    if (from || to) {
      if (from) {
        dateFilter.date.$gte = new Date(from);
      }
      if (to) {
        dateFilter.date.$lte = new Date(to);
      }
    } else {
      delete dateFilter.date;
    }

    // Apply the limit if provided
    let limitValue = limit ? parseInt(limit) : undefined;

    console.log(dateFilter, 'dateFilter');

    // Query exercises with the specified user_id, date range, and limit
    const exercises = (await Exercise.find(dateFilter).limit(limitValue)).map(exercise=>{
      return {
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date.toDateString()
      }
    });


    
    
 

    return res.json(
      {
        _id: user._id,
        username: user.username,
        count: exercises.length,
        log: exercises
      }

    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


mongoose.connect(DB).then((res)=>{
  console.log('connected to db')
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})


function generateRandomId() {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';

  for (let i = 0; i < 24; i++) {
    // Randomly select a character from the 'characters' string
    const randomChar = characters[Math.floor(Math.random() * characters.length)];
    id += randomChar;
  }

  return id;
}

function isValidDate(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(dateString);
}