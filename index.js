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

const DB = 'mongodb+srv://kakha:<password>@clusterreeducate.mquvn.mongodb.net/'.replace(
  "<password>",
 'koimbra10'
);

const Users = require('./models/users')

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
  


  console.log('exercise route START -------------------------')
  console.log(req.body)
  console.log('exercise route END ------------------>>>>>',)
 
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
    // users[userIndex].description = req.body.description
    // users[userIndex].duration = Number(req.body.duration)
    // users[userIndex].date = req?.body?.date? req.body.date: formattedDate
    // console.log('returned data,', users[userIndex])
    const updatedUser = await Users.findByIdAndUpdate(req.params._id, {
      description: req.body.description,
      duration: Number(req.body.duration),
      date: req?.body?.date? new Date(req.body.date).toDateString(): new Date().toDateString()
    }, {new: true // returns updated user
    })
   return  res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
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

    let log = {
      description: user.description,
      duration: user.duration,
      date: user.date,
    };

    // Check if log with the same description already exists
    if (!user.log.find((entry) => entry.description === user.description)) {
      user.log.push(log);
    }

    user.count = user.log.length;
    const updatedUser = await user.save();

    // Fetch the user again after updating
    const query = await Users.findById(updatedUser._id)
      .select('-date -description -duration')
      .lean({ virtuals: true });

    // Check if from or to are provided
    if (from || to) {
      console.log('filtering by', from, to);
    
      // Update the query with date filtering within the 'log' array
      query.log = {
        $elemMatch: {
          date: {
            $gte: from,
            $lte: to,
          },
        },
      };
    }
    
    // Remove the previous query.log assignment if it's still present
  

    return res.json(query);
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