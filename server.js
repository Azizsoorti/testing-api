require('dotenv').config();
const bodyParser = require('body-parser')
const express = require('express');
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;
const port = process.env.PORT || 3000;



mongoose.connect(mongoString);
const database = mongoose.connection;
database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())



const userSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    age: {
        required: true,
        type: Number
    }
})

const userModel= mongoose.model('datastudent', userSchema)

app.get("/", (req,res)=>{
    res.send("hello world i am a devolper ")
})

app.post("/",(req,res)=>{
    res.json(req.body)
})

// Db creation 
app.post('/save_user', async (req, res) => {
    const user = new userModel({
        name: req.body.name,
        age: req.body.age
    })

    try {
        const outPut = await user.save();
        res.status(200).json(outPut)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
    res.json(req.body)
})


// Db Reading
app.get("/all_user", async (req,res)=>{

try{

    const user = await userModel.find()
    res.status(200).json(user);
}catch(error){
    console.log(error.message);
    res.status(500).json({msg: "Error occured", logs:error.message})
}

})

app.listen(port, () => {
    console.log(`Server Started at ${port}`)
})