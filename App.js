const express=require('express')
const cors = require('cors');
const bodyParser=require('body-parser')
const expenditure=require('./Controler/Expenditure')
const UserAuth=require('./Controler/Auth')
const Todo=require("./Controler/ToDoController")
const events=require('./Controler/EventsController')
const Expenditure=require('./Models/ExpenditureModel')
const Category=require("./Models/Category")
const User=require("./Models/UsersModel")
const ToDo=require('./Models/ToDoModel')
const Calendar=require('./Models/CalenderModel')
const category=require("./Controler/Category")
const passport=require('./Config/PassportConfig/passportConfig')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const morgan = require('morgan');



const app=express();


const generateSecretKey = () => {
    return crypto.randomBytes(32).toString('hex');
};



app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: generateSecretKey(),
    resave: false,
    saveUninitialized: false
}));


// Database synchronization
    (async () => {
        try {
            await Expenditure.sync();
            await Category.sync();
            await User.sync();
            await Calendar.sync();
            await ToDo.sync();
            console.log('Database models synchronized with the database.');
        } catch (err) {
            console.error('Error synchronizing models:', err);
        }
    })();


app.use(morgan('dev'));
app.use(cors());
app.use(passport.initialize(undefined));
//routes
app.use(bodyParser.json())
app.use('/api',expenditure);
app.use('/api',UserAuth);
app.use('/api',category)
app.use('/api',events)
app.use('/api',Todo)





app.listen(process.env.port||5000, ()=> {
    console.log("running")
})
