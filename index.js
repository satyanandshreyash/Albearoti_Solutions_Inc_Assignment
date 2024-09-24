require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const joi = require('joi');

mongoose.connect(process.env.mongoUrl);
const User = require('./models/user.model');
const Task = require('./models/task.model');
const { authenticateToken } = require('./utilities');


const app = express();

app.use(express.json());

app.get("/", (req, res)=>{
    res.json({data: "hello"});
})

//Registration API
app.post("/registration", async (req, res)=>{
    const {username, email, password} = req.body;

    //Validation using joi
    const schema = joi.object({
        username: joi.string().required(), 
        email: joi.string().email().required(), 
        password: joi.string().min(6).required()
    })
    const {error} = schema.validate(req.body);
    if(error)return res.status(400).json({message: error.details[0].message})

    const isUser = await User.findOne({email: email});
    if(isUser){
        return res.json({
            message: "User already exist"
        })
    }
    const user = new User({
        username,
        email,
        password
    })
    await user.save();

    const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "3600m"});
    return res.json({
        user, 
        accessToken,
        message: "Registration Successful"
    })
})

//Login API
app.post("/login", async (req, res)=>{
    const {email, password} = req.body;

    const schema = joi.object({
        email: joi.string().email().required(), 
        password: joi.string().required()
    });
    const {error} = schema.validate(req.body);
    if(error)return res.status(400).json({message: error.details[0].message})

    const userInfo = await User.findOne({email: email});
    if(!userInfo){
        return res.status(400).json({message: "User not found"})
    }
    if(userInfo.email === email && userInfo.password === password){
        const user = {user: userInfo};
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "3600m"})
        return res.status(200).json({
            message: "Login Successful",
            email,
            accessToken,
        })
    }else{
        return res.status(400).json({
            message: "Invalid credentials"
        })
    }
})

/**CRUD Implementation*/

//create Task
app.post("/create-task", authenticateToken, async (req, res)=>{
    const {title, description, status, dueDate} = req.body;
    const {user} = req.user;

    const schema = joi.object({
        title: joi.string().required(), 
        description: joi.string().required(), 
        status: joi.string().valid('pending', 'in-progress', 'completed').default('pending'),
        dueDate: joi.date().optional()
    })

    const {error} = schema.validate(req.body);
    if(error)return res.status(400).json({message: error.details[0].message});
    
    try{
        const task = new Task({
            title,
            description,
            status,
            dueDate,
            userId: user._id,
        })
        await task.save();
        return res.json({
            task,
            message: "Task added Successfully"
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    };
})

//Read or Get all Tasks
app.get("/get-all-tasks", authenticateToken, async (req, res)=>{
    try{
        const tasks = await Task.find({user: req.user.id});
        res.json(tasks);
    }catch(error){
        res.status(500).json({message: "Internal Server Error"});
    }
})

//Update Task
app.put("/update-task/:id", authenticateToken, async (req, res)=>{
    const {title, description, status, dueDate} = req.body;
    const {user} = req.user;
    const schema = joi.object({
        title: joi.string(),
        description: joi.string(),
        status: joi.string().valid('pending', 'in-progress', 'completed'),
        dueDate: joi.date(),
    });
    const {error} = schema.validate(req.body);
    if(error)return res.status(400).json({message: error.details[0].message});

    try{
        let task = await Task.findById(req.params.id);
        if(!task)return res.status(404).json({message: "Task not found"});
        if(task.userId.toString() !== user._id)return res.status(401).json({message: "Not Authorized"})

        task = await Task.findByIdAndUpdate(req.params.id, {title, description, status, dueDate}, {new: true});
        res.json({task, message: "Task updated successfully"});
    }catch(error){
        console.error("Error updating task:", error);
        res.status(500).json({message: "Internal Server Error"});
    }

})

//Delete API
app.delete("/delete-task/:id", authenticateToken, async (req, res) => {
    const taskId = req.params.id;
    const {user} = req.user;

    try{
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ message: "Task not found" });

        if(task.userId.toString() !== user._id)return res.status(401).json({message: "Not Authorized"});

        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: "Task removed" });

    }catch(error){
        console.log("error deleting task: ", error);
        res.status(500).json({ message: "Internal Server error" });
    }
})


app.listen(8000, ()=>{
    console.log(`server up and running http://localhost:${process.env.PORT}`);
})