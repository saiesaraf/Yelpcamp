var Campground = require("../models/campground");
var Comment = require("../models/comment");

// ALL MIDDLEWARE GOES HERE
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCampground){
            if(err || !foundCampground){
                req.flash("error","Campground not found");
               res.redirect("/campgrounds");
           } else {
                 //does user own campground?
               if(foundCampground.author.id.equals(req.user._id))  {
                 next();  
               } else {
                req.flash("error","You dont have permission to do that");
                res.redirect("back");
               }
           }
        });
    } else {
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
    }
}


middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment){
            if(err || !foundComment){
                req.flash("error","Comment not found");
               res.redirect("/campgrounds");
           } else {
                 //does user own comment?
               if(foundComment.author.id.equals(req.user._id)) {
                 next();  
               } else {
                req.flash("error","You dont have permission to do that");
                res.redirect("back");
               }
           }
        });
    } else {
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    //add to flash
    req.flash("error","You need to be logged in to be able to do that");
    res.redirect("/login");
}
module.exports = middlewareObj;