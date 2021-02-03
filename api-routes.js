const express = require("express");
const router = new express.Router();
const passwords = require("./passwords.js");
const db = require("./db.js");
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const cryptoRandomString = require('crypto-random-string');
const secretCode = cryptoRandomString({
    length: 6
});
const ses = require("./ses.js");


const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/user-pics');
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});


// ---------- ADD NEW USER & HASH PASSWORD AFTER REGISTRATION ----------
router.post("/api/register", (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    passwords
        .hash(password)
        .then((password_hash) =>
            db.addUser(firstname, lastname, email, password_hash)
        )
        .then((newUser) => {
            req.session.userId = newUser.id;

            res.json({
                success: true,
                user: newUser,
            });
        })
        .catch((e) => {
            console.log(e);
            res.json({
                success: false,
                error: console.log("Please fill out all fields."),
            });
        });
});



// ---------- USER LOGIN ----------
router.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    db.getUserByEmail(email)
        .then((user) => {
            console.log("user", user);
            if(!user) {
                console.log("User does not exist")
                return res.json({
                    error: "User does not exist", 
                    success: false
                });
            }

            passwords
                .compare(password, user.password_hash)
                .then((passwordMatches) => {
                    if (passwordMatches) {
                        console.log("Password is correct! Have fun!");
                        req.session.userId = user.id;
                        res.json({
                            success: true,
                        });
                    } else {
                        console.log("Password does not match.")
                        res.json({
                            success: false,
                            error:
                                "Password does not match.",
                        });
                    }
                });
        })
        .catch((e) => {
            console.log(e);
            res.json({
                success: false,
                error:
                    "Either this user does not exist, or the password does not match.",
            });
        });
});



// ---------- STORE AND SEND VALIDATION CODE ----------
router.post("/api/send-code", (req, res) => {
    const { email } = req.body;

    db.getUserByEmail(email)
    .then((user) => {
        console.log("user", user);
        if(!user) {
            console.log("User does not exist")
            return res.json({
                error: "User does not exist", 
                success: false
            });
        }
            const userId = user.id;
            console.log("secret-code", secretCode);
            db.addSecretCode(userId, secretCode)
            .then((result) => {
                console.log("see result from secret key", result);
                ses.send(email, secretCode);
                return res.json({
                    success: true
                });
            });
    });
});



// ---------- RESET PASSWORD ----------
router.post("/api/reset-password", (req, res) => {
    console.log("reset password body", req.body);
    const { email, code, new_password } = req.body;

    // compare email address / if user exists
    db.getUserByEmail(email)
    .then((user) => {
        console.log("user", user);
        if(!user) {
            console.log("User does not exist")
            return res.json({
                error: "User does not exist", 
                success: false
            });
        }
            // check if entered and generated secret code match
            db.getUserSecretCode()
            .then((result) => {
                console.log("result from get user code", result);
                if(result.secret_code == code) {
                    console.log("Matching codes!");

                    // hash new password and update user data
                    passwords
                    .hash(new_password)
                    .then((password_hash) => {
                        const userId = user.id;
                        db.updateUserPassword(userId, password_hash)
                        .then(() => {
                            return res.json({
                                success: true
                            });
                        })
                    })

                } else {
                    console.log("Codes don't match!");
                    return res.json({
                        error: "Codes don't match",
                        success: false
                    });
                }
            });
    });
});




// ---------- GET USER DATA FOR PROFILE ----------
router.get("/api/user", (req, res) => {
    const userId = req.session.userId;
    console.log("userId", userId);
    db.getUserDataById(userId)
    .then((user) => {
        console.log("get user data by id", user);
        return res.json(user);
    }) 
})



// ---------- UPLOAD & STORE USER PICS ----------
router.post("/api/fileupload", uploader.single('file'), (req, res) => {

    if(!req.session.userId) {
        console.log("User is not logged in");
        return res.json({
            error: "User is not logged in."
        });
    }

    console.log("req.file", req.file);
    const newProfilePic = `/user-pics/${req.file.filename}`;
    const userId = req.session.userId;
    db.uploadUserPic(userId, newProfilePic)
    .then(updatedUser => {
        console.log("result from uploaduser", updatedUser);
        return res.json({
            success: true,
            updatedUser,
        });
    })
    .catch((e) => {
        console.log(e);
        res.json({
            success: false,
            error:
                "Something went wrong with the upload.",
        });
    });
});



// ---------- UPDATE USER BIO ----------
router.post("/api/updatebio", (req, res) => {

    const userId = req.session.userId;
    const {editedBio} = req.body;

     db.updateUserBio(userId, editedBio)
    .then(updatedUser => {
        return res.json({
            success: true,
            updatedUser,
        });
    }) 
});



// ---------- GET OTHER USERS PROFILE BY ID ----------
router.get("/api/user/:id", (req, res) => {

    const currentUserId = req.params.id;
    const itsMe = req.params.id == req.session.userId;
    console.log("req.params.id", req.params.id, currentUserId)
    console.log("itsMe", itsMe)

    db.getOtherUsersById(currentUserId)
    .then(user => {
        console.log("result user", user);
        if(!user) {
            res.json({
                success: false,
                error: "User does not exist."
            })
        } else {
            return res.json({
                success: true,
                user,
                itsMe,
            })
        }
    })
})



// ---------- FIND USER BY QUERY ----------
router.get("/api/find-user/:query", (req, res) => {

    const userQuery = req.params.query;
    console.log("userQuery", userQuery);

    db.getUserListByQuery(userQuery)
    .then(user => {
        console.log("result user", user);
        if(!user) {
            res.json({
                success: false,
                error: "User does not exist."
            })
        } else {
            return res.json({
                success: true,
                user,
            })
        }
    })
})


// friend request status
const noFriendRequest = "no_friend_request"
const acceptedFriendRequest = "friend_request_accepted"
const madeByMeFriendRequest = "friend_request_made_by_me"
const madeToMeFriendRequest = "friend_request_made_to_me"

// ---------- GET FRIEND STATUS ----------
router.get("/api/friend-status/:otherUsersId", (req, res) => {
    
    const {otherUsersId} = req.params;
    const itsMe = req.session.userId;
    

    db.getFriendRequestStatus(itsMe, otherUsersId)
        .then(friendRequestStatus => {

            console.log("friend request status", friendRequestStatus);

        if(!friendRequestStatus) {
            return res.json({
                status: noFriendRequest
            });
        }
    
        if(friendRequestStatus.accepted) {
            return res.json({
                status: acceptedFriendRequest
            });
        }

        if(friendRequestStatus.from_id == itsMe) {
            return res.json({
                status: madeByMeFriendRequest
            });
        }

        if(friendRequestStatus.to_id == itsMe && friendRequestStatus.accepted == false) {
            return res.json({
                status: madeToMeFriendRequest
            });
        }
    })
})



// ---------- UPDATE FRIEND STATUS ----------
router.post("/api/friend-status/make-request/:otherUsersId", (req, res) => {

    const {otherUsersId} = req.params;
    const itsMe = req.session.userId;

    db.makeFriendRequest(itsMe, otherUsersId)
        .then(result => {
            return res.json({
                status: madeByMeFriendRequest
            });
        }); 

});

router.post("/api/friend-status/accept-request/:otherUsersId", (req, res) => {

    const {otherUsersId} = req.params;
    const itsMe = req.session.userId;

    db.acceptFriendRequest(itsMe, otherUsersId)
        .then(result => {
            return res.json({
                status: acceptedFriendRequest
            });
        });

});

router.post("/api/friend-status/cancel-request/:otherUsersId", (req, res) => {

    const {otherUsersId} = req.params;
    const itsMe = req.session.userId;

    db.cancelFriendRequest(itsMe, otherUsersId)
        .then(result => {
            return res.json({
                status: noFriendRequest
            });
        });

});

router.post("/api/friend-status/unfriend/:otherUsersId", (req, res) => {

    const {otherUsersId} = req.params;
    const itsMe = req.session.userId;

    db.unfriendUser(itsMe, otherUsersId)
        .then(result => {
            return res.json({
                status: noFriendRequest
            });
        });

});



// ---------- GET FRIENDS LIST AND CURRENT FRIEND STATUS ----------
router.get("/api/friends", (req, res) => {

    const itsMe = req.session.userId;

    db.getFriendsAsList(itsMe)
        .then(friendList => {
            return res.json({
                friendList
            });
        });

});



// ---------- ADD ARTISTS ----------
router.post("/api/add-artist", (req, res) => {

    const userId = req.session.userId;
    const {name, genres, id} = req.body.artist;
    const stringGenres = JSON.stringify(genres);

     db.getFavoritArtists(userId)
        .then(artists => {
                if(req.body.artist.images.length > 0) {
                    var {url} = req.body.artist.images[0];
                    db.addArtistWithPic(userId, name, stringGenres, url, id)
                    .then(async () => {
                        await db.getFavoritArtists(userId)
                        .then(updatedFavorites => {
                            return res.json({
                                updatedFavorites
                            })
                        }) 
                    })
                } else {
                    db.addArtistWithoutPic(userId, name, stringGenres, id)
                    .then(async () => {
                        await db.getFavoritArtists(userId)
                        .then(updatedFavorites => {
                            return res.json({
                                updatedFavorites
                            })
                        }) 
                    })
                    
                  }
        }) 
});



// ---------- DELETE ARTISTS ----------
router.post("/api/delete-artist", (req, res) => {

    const userId = req.session.userId;
    const {id} = req.body.artist;
    console.log("id", id);

     db.deleteFavoritArtists(userId, id)
        .then(async () => {
            await db.getFavoritArtists(userId)
            .then(updatedFavorites => {
                updatedFavorites.map(artist => {
                    artist.genres = JSON.parse(artist.genres)
                })
                return res.json({
                    updatedFavorites
                })
            }) 
        })

});


// ---------- DELETE ARTIST FROM PROFILE ----------
router.post("/api/delete-artist-profile", (req, res) => {

    const userId = req.session.userId;
    const {artist_id} = req.body.artist;
    console.log("artist from profile", userId, req.body.artist)


     db.deleteFavoritArtists(userId, artist_id)
     .then(async () => {
        await db.getFavoritArtists(userId)
        .then(updatedFavorites => {
            updatedFavorites.map(artist => {
                artist.genres = JSON.parse(artist.genres)
            })
            return res.json({
                updatedFavorites
            })
        }) 
    })
});



// ---------- GET FAVORIT ARTISTS FOR SEARCH ----------
router.get("/api/favorit-artists", (req, res) => {

    const userId = req.session.userId;

    db.getFavoritArtists(userId)
        .then(favorites => {
            return res.json({
                favorites
            })
        })

});


// ---------- GET MY FAVORIT ARTISTS ----------
router.get("/api/my-favorit-artists", (req, res) => {

    const userId = req.session.userId;

    db.getFavoritArtists(userId)
        .then(artists => {
            artists.map(artist => {
                artist.genres = JSON.parse(artist.genres)
            })
            return res.json({
                artists
            })
        })

});



// ---------- GET OTHER USERS FAVORIT ARTISTS ----------
router.get("/api/users-favorit-artists/:otherUsersId", (req, res) => {
    const {otherUsersId} = req.params;

    db.getOtherUsersFavoritArtists(otherUsersId)
        .then(artists => {
            artists.map(artist => {
                artist.genres = JSON.parse(artist.genres)
            })
            return res.json({
                artists
            })
        })
});



// ---------- GET MUSIC MATCHES ----------
router.get("/api/music-matches", async (req, res) => {
   
    const userId = req.session.userId;

    db.getFavoritArtists(userId)
        .then(async (artists) => {
            for(let artist of artists) {
                artist.matchingUsers = await db.getUsersWhoMatches(artist.artist_id, userId)
            } res.json({artists})
        })
});




module.exports = router;  