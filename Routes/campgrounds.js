var express= require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Middleware = require("../middleware");

//INDEX
router.get("/",function(req,res)
{
    //get all campgrounds from db
    //console.log(req.user);
    Campground.find({},function(err,allcampgrounds)
    {
        if(err)
        {
            console.log(err);
        } else{
            res.render("campgrounds/index",{campgrounds:allcampgrounds,currentUser:req.user})
        }
       
    });
    
    //res.render("campgrounds",{campgrounds:campgrounds});
});
//CREATE ROUTE-Add new campground to Database
router.post("/",Middleware.isLoggedIn,function(req,res)
{
    //get data from form and add to campground array
    var name=req.body.name;
    var price= req.body.price;
    var image=req.body.image;
    var description=req.body.description;
    var author={
        id:req.user._id,
        username : req.user.username
    }
    var newCampground={name:name,price:price,image:image,description:description,author:author}
    //console.log(req.user);
    //create a new campground and save to data base
    Campground.create(newCampground,function(err,newlyCreated)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
    //redirect back to campgrounds page   
});
//New
router.get("/new",Middleware.isLoggedIn,function(req,res)
{
    res.render("campgrounds/new");
});
//Show - shows more info about one campground
router.get("/:id",function(req,res)
{
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground)
    {
        if(err || !foundCampground)
        {
            req.flash("error","Campground not found");
            return res.redirect("back");
        }
        else
        {
            console.log(foundCampground);
            res.render("campgrounds/show",{campground:foundCampground});
        }
    });
});

//Edit Campground
router.get("/:id/edit",Middleware.checkCampgroundOwnership,function(req,res)
{
        Campground.findById(req.params.id, function(err,findcampground)
        {
           
                res.render("campgrounds/edit",{campground:findcampground});
            
        });    
});

//Update Campground Route
router.put("/:id",Middleware.checkCampgroundOwnership,function(req,res)
{
    //find and update the correct campgorunds
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedcampground)
    {
        if(err)
        {
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds/" + req.params.id );
        }
    });
    //redirect to show page- to see the changes
});

//Route- Delete Campground Route
router.delete("/:id",Middleware.checkCampgroundOwnership,function(req,res)
{
    Campground.findByIdAndRemove(req.params.id,function(err)
    {
        if(err)
        {
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds");
        }
    });
});



module.exports=router;