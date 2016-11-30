/* Ball is Life: A Basketball Video Site by Al Gilardi */var express=require("express"),passport=require("passport"),User=require("../models/user"),Clip=require("../models/clip"),Comment=require("../models/comment"),router=express.Router();router.get("/",function(a,b,c){Clip.find({},function(c,d,e){b.render("index",{user:a.user,clips:d.reverse()})})}),router.get("/signup",function(a,b){b.render("signup",{error:a.flash("error"),user:a.user})}),router.post("/signup",function(a,b,c){User.register(new User({username:a.body.username,team:a.body.team}),a.body.password,function(c,d){return c?(a.flash("error",c.message),b.redirect("/signup")):void passport.authenticate("local")(a,b,function(){b.redirect("/")})})}),router.get("/login",function(a,b){b.render("login",{user:a.user,error:a.flash("error")})}),router.post("/login",passport.authenticate("local",{successRedirect:"/",failureRedirect:"/login",failureFlash:!0})),router.get("/submit",function(a,b){b.render("submit",{user:a.user,error:a.flash("error")})}),router.post("/submit",function(a,b){var c=a.body.url;if(c.indexOf("www.youtube.com")<0&&(a.flash("error","Not a valid Youtube link!"),b.redirect("/submit")),a.body.title.length<1)a.flash("error","You didn't enter a title!"),b.redirect("/submit");else{var d=c.split("v=")[1];new Clip({title:a.body.title,url:"//www.youtube.com/embed/"+d,user:a.user.username,team:a.body.team,editable:!0,videoID:d}).save(function(a,c,d){console.log(c),b.redirect("/")})}}),router.get("/logout",function(a,b){a.logout(),b.redirect("/")}),router.get("/user/:userName",function(a,b){User.findOne({username:a.params.userName},function(a,c,d){c?Clip.find({user:c.username},function(a,d,e){console.log(d),b.render("userpage",{user:c,clips:d})}):b.redirect("/user-not-found")})}),router.get("/clip/:videoID",function(a,b){Clip.findOne({videoID:a.params.videoID},function(c,d,e){if(d){d.comments.forEach(function(b){console.log(b),b.user===a.user.username?b.editable=!0:b.editable=!1}),b.render("clippage",{user:a.user,clip:d,comments:d.comments})}else b.redirect("/clip-not-found")})}),router.post("/clip/:videoID",function(a,b){""===a.body.comment&&b.redirect("/clip"+a.params.videoID);var c=new Comment({text:a.body.comment,user:a.user.username,editable:!0,commentID:0});console.log("comment created",c),Clip.findOne({videoID:a.params.videoID},function(d,e,f){c.commentID=a.params.videoID+e.comments.length,e.comments.push(c),e.save(function(c,d,e){console.log(c,d,e),b.redirect("/clip/"+a.params.videoID)})})}),router.get("/stats",function(a,b){var c=0,d=0;Clip.find({},function(a,e,f){e.forEach(function(a){c++}),User.find({},function(a,e,f){e.forEach(function(a){d++}),b.render("stats",{clipNo:c,userNo:d})})})}),router.get("/api/deletecomment/:commentID",function(a,b){var c=a.params.commentID.substring(0,a.params.commentID.length-1);Clip.findOne({videoID:c},function(d,e,f){for(var g=0;g<e.comments.length;g++)e.comments[g].commentID===a.params.commentID&&(e.comments.splice(g,1),console.log(e.comments));e.save(function(a,d,e){b.redirect("/clip/"+c)})})}),router.get("/api/sort",function(a,b){var c={};"All Teams"!=a.query.team&&(c.team=a.query.team),Clip.find(c,function(a,c,d){console.log(c),b.send(c)})}),router.get("/user-not-found",function(a,b){b.render("usernotfound")}),router.get("/clip-not-found",function(a,b){b.render("clipnotfound")}),router.get("*",function(a,b){b.render("404")}),module.exports=router;