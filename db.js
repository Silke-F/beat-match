const spicedPg = require("spiced-pg");
const db = spicedPg(process.env.DATABASE_URL || "postgres:Silke:@localhost:5432/social-network");


// ---------- ADD NEW USER ON REGISTRATION ----------
exports.addUser = (firstname, lastname, email, password_hash) => {
    return db.query(
        "INSERT INTO users (firstname, lastname, email, password_hash) VALUES($1, $2, $3, $4) RETURNING *;",
        [firstname, lastname, email, password_hash]
    ).then(res => res.rows[0]);
};


// ---------- VALIDATE EMAIL FOR LOGIN ----------
exports.getUserByEmail = (email) => {
    return db.query(
        "SELECT * FROM users WHERE email = $1;",
        [email]
    ).then(({ rows }) => rows[0]);
};


// ---------- ADD SECRET CODE FOR PASSWORD RESET ----------
exports.addSecretCode = (userId, secretCode) => {
    return db.query (
        "INSERT INTO secret_code (user_id, secret_code) VALUES($1, $2) RETURNING*;",
        [userId, secretCode]
    ).then(({ rows }) => rows[0]);
}


// ---------- GET SECRET CODE ----------
exports.getUserSecretCode = () => {
    return db.query (
        `SELECT * FROM secret_code 
        WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '5 minutes';`
    ).then(({ rows }) => rows[0]);
}


// ---------- UPDATE USER PASSWORD ----------
exports.updateUserPassword = (userId, password_hash) => {
    return db.query (
        "UPDATE users SET password_hash = $1 WHERE id = $2;",
        [password_hash, userId]
    )
}


// ---------- GET USER DATA BY ID ----------
exports.getUserDataById = (userId) => {
    return db.query (
        "SELECT * FROM users WHERE id = $1;", [userId]
    ).then(({ rows }) => rows[0]);
}


// ---------- UPLOAD NEW USER PROFILE PIC ----------
exports.uploadUserPic = (userId, newProfilePic) => {
    return db.query (
        "UPDATE users SET profile_pic = $1 WHERE id = $2 RETURNING *;",
        [newProfilePic, userId]
    ).then(({ rows }) => rows[0]);
}


// ---------- UPDATE USER BIO ----------
exports.updateUserBio = (userId, editedBio) => {
    return db.query (
        "UPDATE users SET bio = $1 WHERE id = $2 RETURNING*;",
        [editedBio, userId]
    ).then(({ rows }) => rows[0]);
}


// ---------- GET OTHER USERS PROFILE BY ID ----------
exports.getOtherUsersById = (currentUserId) => {
    return db.query (
        "SELECT * FROM users WHERE id = $1;", [currentUserId]
    ).then(({ rows }) => rows[0]);
}


// ---------- GET USER LIST WHEN SEARCHING FOR USERS ----------
exports.getUserListByQuery = (userQuery) => {
    return db.query (
        "SELECT * FROM users WHERE firstname ILIKE $1;",
        [userQuery + "%"]
    ).then(({ rows }) => rows);
}


// ---------- GET CURRENT FRIEND REQUEST STATUS ----------
exports.getFriendRequestStatus = (itsMe, otherUsersId) => {
    return db.query (
        "SELECT * FROM friend_requests WHERE (from_id = $1 AND to_id = $2) OR (from_id = $2 AND to_id = $1);",
        [itsMe, otherUsersId]
    ).then(({ rows }) => rows[0]);
}


// ---------- UPDATE CURRENT FRIEND STATUS ----------
exports.makeFriendRequest = (itsMe, otherUsersId) => {
    return db.query (
        "INSERT INTO friend_requests (from_id, to_id, accepted) VALUES($1, $2, false) RETURNING *;",
        [itsMe, otherUsersId]
    ).then(({ rows }) => rows[0]);
}

exports.acceptFriendRequest = (itsMe, otherUsersId) => {
    return db.query (
        "UPDATE friend_requests SET accepted = true WHERE (from_id = $1 AND to_id = $2) RETURNING *;",
        [otherUsersId, itsMe]
    ).then(({ rows }) => rows[0]);
}

exports.cancelFriendRequest = (itsMe, otherUsersId) => {
    return db.query (
        "DELETE FROM friend_requests WHERE (from_id = $1 AND to_id = $2) OR (from_id = $2 AND to_id = $1);",
        [otherUsersId, itsMe]
    ).then(({ rows }) => rows[0]);
}

exports.unfriendUser = (itsMe, otherUsersId) => {
    return db.query (
        "DELETE FROM friend_requests WHERE (from_id = $1 AND to_id = $2) OR (from_id = $2 AND to_id = $1);",
        [itsMe, otherUsersId]
    ).then(({ rows }) => rows[0]);
}


// ---------- GET FRIEND LIST WITH STATUS ----------
exports.getFriendsAsList = (itsMe) => {
    return db.query (
        `SELECT * FROM friend_requests
        JOIN users
            ON (from_id = users.id AND to_id = $1      AND accepted=false)
            OR (from_id = users.id AND to_id = $1      AND accepted=true)  
            OR (from_id = $1      AND to_id = users.id AND accepted=true)
            OR (from_id = $1      AND to_id = users.id AND accepted=false);`,
            [itsMe]
    ).then(({ rows }) => rows);
}


// ---------- GET CHAT MESSAGES ----------
exports.getChatMessages = () => {
    return db.query (
        `SELECT * FROM (  
            SELECT chats.id as message_id, * FROM chats
            JOIN users
            ON (chats.user_id = users.id)
            ORDER BY chats.id DESC
            LIMIT 15
        ) as subquery
        ORDER BY message_id ASC;`
    ).then(({ rows }) => rows);
}


// ---------- ADD NEW CHAT MESSAGES ----------
exports.addChatMessage = (userId, messageText) => {
    return db.query (
        "INSERT INTO chats (user_id, message_text) VALUES ($1, $2) RETURNING id;",
        [userId, messageText]
    ).then(({ rows }) => rows[0]);
}


// ---------- ADD ARTIST WITH URL TO PROFILE ----------
exports.addArtistWithPic = (userId, name, genres, url, id) => {
    return db.query (
        "INSERT INTO artists (user_id, artist_name, genres, artist_pic, artist_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
        [userId, name, genres, url, id]
    ).then(({ rows }) => rows);
}


// ---------- ADD ARTIST WITHOUT URL TO PROFILE ----------
exports.addArtistWithoutPic = (userId, name, genres, id) => {
    return db.query (
        "INSERT INTO artists (user_id, artist_name, genres, artist_id) VALUES ($1, $2, $3, $4) RETURNING *;",
        [userId, name, genres, id]
    ).then(({ rows }) => rows);
}


// ---------- DELETE ARTIST ----------
exports.deleteFavoritArtists = (userId, id) => {
    return db.query (
        "DELETE FROM artists WHERE (user_id = $1 AND artist_id = $2);",
        [userId, id]
    ).then(({ rows }) => rows);
}


// ---------- GET FAVORIT ARTISTS FOR MY PROFILE ----------
exports.getFavoritArtists = (userId) => {
    return db.query (
        "SELECT * FROM artists WHERE user_id = $1;", 
    [userId]
    ).then(({ rows }) => rows);
}


// ---------- GET FAVORIT ARTISTS FOR OTHER USERS PROFILE ----------
exports.getOtherUsersFavoritArtists = (otherUsersId) => {
    return db.query (
        "SELECT * FROM artists WHERE user_id = $1;",
        [otherUsersId]
    ).then(({ rows }) => rows);
}


// ---------- GET FAVORIT ARTISTS IDS ----------
exports.getUsersWhoMatches = (artistId, userId) => {
    return db.query (
        `SELECT * FROM artists 
        JOIN users ON 
        (users.id = artists.user_id)
        WHERE artist_id = $1 AND user_id != $2;`, 
    [artistId, userId]
    ).then(({ rows }) => rows);
}


/* // ---------- GET MUSIC MATCHES ----------
exports.getMatches = (myFavorites) => {
    return db.query (
        'SELECT * FROM users JOIN artists ON artists.artist_name = $1;`,
        [myFavorites]
    ).then(({ rows }) => rows);
} */