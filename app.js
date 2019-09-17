var express= require("express");
var app=express();
var bodyParser= require("body-parser");
var passport= require("passport");
var flash=require("connect-flash");
var LocalStrategy = require("passport-local");
var Campground= require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var methodOverride = require("method-override");
var SeedDB = require("./seeds");
//requiring routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes= require("./routes/campgrounds"),
    authRoutes= require("./routes/index")

//SeedDB(); //seed the database
app.use(require("express-session")({
    secret:"Rusty wins cutest dog",
    resave:false,
    saveUnitialized:false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname +"/public"));
var mongoose = require("mongoose");
app.use(methodOverride("_method"));

//mongoose.connect("mongodb://localhost:27017/yelpcamp",{ useNewUrlParser: true });
mongoose.connect('mongodb+srv://saie12:March2019@cluster0-w6aoi.mongodb.net/test?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useCreateIndex:true
});

app.set("view engine","ejs");

app.use(function(req,res,next)
{
    res.locals.currentUser = req.user;
    res.locals.error=req.flash("error");
    res.locals.success= req.flash("success");
    next();
});

app.use(authRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT,process.env.IP,function()
{
    console.log("Yelpcamp App has started");
});