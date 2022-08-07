const express = require("express");
const app = express();
const PORT =  9000;
const mongoose = require("mongoose");
//const todotask = require("./models/todotask");

//dotemv is where we keep connections thatwe want to be secret

const TodoTask = require('./models/todotask');
//requires the model you created to use it
require('dotenv').config();

//middleware helps to deal with traffic as it moves to and from
//set middleware
app.set("view engine", "ejs");
app.use(express.static('public')); //for static files like index.html or css, we declared that we will put them into the public folder
app.use(express.urlencoded({extended: false}));
//no.11 helps validate the info we are passing back and forth

mongoose.connect(
    process.env.DB_CONNECTION,
    {useNewUrlParser: true},
    () => {console.log('Connected to db!')}
    )
//telling mongoose where to look for that connection

//GET
app.get('/', (req, res) => {
    try{//tell it what to render
        TodoTask.find({}, (err, task) => {
            todoTasks: task
            res.render("index.ejs", {todoTasks:task});
        }
        );
        
        //look for the specific task and render it
    }catch(err){
      if (err) return res.status(500).send(err);
    }

});

//POST
app.post('/', async (req,res) =>{
    const todoTask = new TodoTask({
        title: req.body.title,
        content: req.body.content
    
    });
    try{
        //wait the task being documented and save
        await todoTask.save();
        console.log(todoTask)
        //redirect back to the homepage, kind of like a refresh
        res.redirect('/');
    }catch(error){
        if (err) return res.status(500).send(err)
        res.redirect('/');
    }
});

//UPDATE or edit
app
    .route('/edit/:id')
    .get((req,res) => {
        const id = req.params.id
        TodoTask.find({}, (err, task) => {
            res.render("edit.ejs", {
                todoTasks:task, idTask: id 
            });
        })
        //edit button currently not working :(
    .post((req, res) => {
        const id = req.params.id
        TodoTask.findByIdAndUpdate(
            id,
            {
                title: req.body.title,
                content: req.body.content

            },
            err =>{
            if(err)return res.status(500).send(err)
            res.redirect('/')
            }
            
        )
    });
    });
    //DELETE
app
    .route('/remove/:id')
    .get((req,res) =>{
        const id = req.params.id;
        TodoTask.findByIdAndRemove(
            id, err => {
                if(err)return res.status(500).send(err)
            res.redirect('/');
            }
        )
    })
    



app.listen(PORT, () =>console.log(`Server is running on port ${PORT}`));
