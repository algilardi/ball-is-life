var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var Clip = require('../models/clip');
var Comment = require('../models/comment');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    Clip.find({}, function(err, clips, count) {
        res.render('index', { user : req.user, clips : clips.reverse()})
    });
});

// Signup page
router.get('/signup', function(req, res) {
    res.render('signup', {error : req.flash('error'), user: req.user});
});

router.post('/signup', function(req, res, next) {
    User.register(new User({ username : req.body.username, team : req.body.team }), req.body.password, function(err, user) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/signup');
        }
        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

// Login page
router.get('/login', function(req, res) {
    res.render('login', { user : req.user, error : req.flash('error') });
});

router.post('/login', passport.authenticate('local', {
    successRedirect : '/',
    failureRedirect : '/login',
    failureFlash : true
}));

// Video Submision page
router.get('/submit', function(req, res) {
    res.render('submit', { user : req.user, error:req.flash('error') });
});

// Adds the video to the database
router.post('/submit', function(req, res) {
    var urlString = req.body.url;
    if (urlString.indexOf("www.youtube.com") < 0) {
        req.flash('error', "Not a valid Youtube link!");
        res.redirect('/submit');
    }
    if (req.body.title.length < 1) {
        req.flash('error', "You didn't enter a title!");
        res.redirect('/submit');
    }
    else {
        var id = urlString.split('v=')[1];
        new Clip({
            title : req.body.title,
            url : '//www.youtube.com/embed/' + id,
            user: req.user.username,
            team : req.body.team,
            editable : true,
            videoID: id}).save( function(err, clip, count){
                console.log(clip);
                res.redirect("/");
            });
    }
});

// Logout page
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

// Generic user page
router.get('/user/:userName', function(req, res) {
    User.findOne({username:req.params.userName}, function(err, user, count) {
        if (!user) {
            res.redirect('/user-not-found')
        }
        else {
            Clip.find({user:user.username}, function(err, clips, count) {
                console.log(clips);
                res.render('userpage', {user:user, clips:clips});
            });
        }
    });
});

// Generic clip page
router.get('/clip/:videoID', function(req, res) {
    Clip.findOne({videoID:req.params.videoID}, function(err, clip, count) {
        if (!clip) {
            res.redirect('/clip-not-found')
        }
        else {
          clip.editable = false;
          if (req.user) {
            if (clip.user === req.user.username)
              clip.editable = true;
            }
          var commentUsers = [];
          clip.comments.forEach(function(comment, count){
            comment.commentID = req.params.videoID + count;
            if (req.user) {
              if (comment.user === req.user.username) {
                comment.editable = true;
              }
              else {
                comment.editable = false;
              }
            }
            else {
              comment.editable = false;
            }
          });
          clip.save(function(){
            console.log(clip.editable);
            res.render('clippage', {user:req.user, clip:clip, comments:clip.comments});
          });
        }
    });
});

// Clip Post, for handling comments being added
router.post('/clip/:videoID', function(req, res) {
  if (req.body.comment.length === 0) {
    res.redirect('/clip/' + req.params.videoID);
  }
  else {
    var comment = new Comment({
        text:req.body.comment,
        user:req.user.username,
        editable:true,
        commentID:0
    });
    console.log("comment created", comment);
    Clip.findOne({videoID:req.params.videoID}, function(err, clip, count) {
      //updates comment ID (for deleting)
      comment.commentID = req.params.videoID + clip.comments.length;
        clip.comments.push(comment);
        clip.save(function(err, clip, count) {
            console.log(err, clip, count);
            res.redirect('/clip/' + req.params.videoID);
        });
    });
  }
});

// Stats page
router.get('/stats', function(req, res) {
    var clipNo = 0;
    var userNo = 0;
    Clip.find({}, function(err, clips, count) {
        clips.forEach(function(clip) {
            clipNo++;
        });
        User.find({}, function(err, users, count) {
            users.forEach(function(clip) {
                userNo++;
            });
            res.render('stats', {clipNo:clipNo, userNo:userNo});
        });
    })
});

// Deleting comments
router.get('/api/deletecomment/:commentID', function(req, res) {
  var videoID = req.params.commentID.substring(0, req.params.commentID.length-1);
  Clip.findOne({videoID:videoID}, function(err, clip, count) {
    for (var i = 0; i < clip.comments.length; i++) {
      if (clip.comments[i].commentID === req.params.commentID) {
        console.log("BEFORE", clip.comments);
        clip.comments.splice(i, 1);
        console.log("AFTER",clip.comments);
      }
    }
    clip.save(function(err, clip, count) {
      res.redirect('/clip/' + videoID);
    });
  });
});

// Deleting Clips
router.get('/api/deleteclip/:videoID', function(req, res) {
  Clip.remove({videoID:req.params.videoID}, function(err) {
    if (!err) {
      res.redirect('/');
    }
  });
});

// AJAX api
router.get('/api/sort', function(req, res) {
    var teamFilter = {};
    if (req.query.team != "All Teams") {
        teamFilter.team = req.query.team;
    }
    Clip.find(teamFilter, function(err, clips, count) {
        console.log(clips);
        res.send(clips);
    })
})

// User Not Found page
router.get('/user-not-found', function(req, res) {
    res.render('usernotfound');
});

// Clip Not Found page
router.get('/clip-not-found', function(req, res) {
    res.render('clipnotfound');
})

// 404
router.get('*', function(req, res) {
    res.render('404');
})

module.exports = router;
