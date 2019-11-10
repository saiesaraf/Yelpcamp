var express= require("express");
var router = express.Router({mergeParams:true});
var Campground= require("../models/campground");
var Comment = require("../models/comment");
var Middleware = require("../middleware");

//-Comments Routes
router.get("/new",Middleware.isLoggedIn,function(req,res)
{
    console.log(req.params.id);
    Campground.findById(req.params.id,function(err,campground)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("comments/new",{campground:campground});
        }

    })
    //res.send("This will be comment route");
});

router.post("/",Middleware.isLoggedIn,function(req,res)
{
    //lookup campground using id
    Campground.findById(req.params.id,function(err,campground)
    {
        if(err)
        {
            console.log(err);
            res.redirect("/campgrounds");
        }
        else
        {
            Comment.create(req.body.comment,function(err,comment)
            {
                if(err)
                {
                    req.flash("error","Something went wrong");
                    console.log(err);
                }
                else{
                    //add username and id to the comments
                    comment.author.id= req.user._id;
                    comment.author.username = req.user.username;

                    comment.save();
                    //console.log("New comment user name will be " + req.user.username);
                    //save comment
                    console.log(comment);
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success","successfully added comment");
                    res.redirect('/campgrounds/'+campground._id);
                }//else ends
            });//inner most callback function
        }//else ends
    });//outer 2nd call back function

});//last call back function

//Comments :Edit 
router.get("/:comment_id/edit",Middleware.checkCommentOwnership,function(req,res)
{
    Campground.findById(req.params.id,function(err,foundCampground)
    {
        if(err || !foundCampground)
        {
            req.flash("error","No campgroundfound");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err,foundComment)
        {
            if(err ||!foundComment)
            {
                req.flash("error","Comment not found");
                res.redirect("back");
            }
            else
            {
                res.render("comments/edit",{campground_id:req.params.id,comment:foundComment});
            }
    });
});
    
});
//Comments:Update route
router.put("/:comment_id",Middleware.checkCommentOwnership,function(req,res)
{
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComments)
    {
        if(err)
        {
            res.redirect("back");
        }
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Comments: Delete Route
//DELETE COMMENT ROUTE -> DESTROY
router.delete("/:comment_id", Middleware.checkCommentOwnership, function (req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
             res.redirect("back");
        } else {
            req.flash("success","Comment is deleted");
             res.redirect("/campgrounds/" + req.params.id);       
        }
    });
 });

 


module.exports=router;