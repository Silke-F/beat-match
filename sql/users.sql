DROP TABLE IF EXISTS artists;
DROP TABLE IF EXISTS chats;
DROP TABLE IF EXISTS friend_requests;
DROP TABLE IF EXISTS secret_code;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(500) NOT NULL,
    lastname VARCHAR(500) NOT NULL,
    email VARCHAR(500) NOT NULL,
    password_hash VARCHAR(60) NOT NULL,
    profile_pic VARCHAR(500),
    bio VARCHAR(5000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE secret_code (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL, 
    secret_code VARCHAR(6) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friend_requests (
    id SERIAL PRIMARY KEY,
    from_id INTEGER REFERENCES users(id),
    to_id INTEGER REFERENCES users(id),
    accepted BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chats (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    message_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE artists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    artist_name VARCHAR,
    artist_id VARCHAR,
    genres VARCHAR,
    artist_pic VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


/* UPDATE users SET profile_pic = 'https://i.imgur.com/MFj3Fb8.jpg' WHERE id = 1; 
/* UPDATE users SET bio = 'hi my name is!' WHERE id = 1; */
/* UPDATE friend_requests SET accepted = true WHERE id = 4; */


/* INSERT INTO friend_requests (from_id, to_id, accepted) VALUES (27, 206, false); 
INSERT INTO friend_requests (from_id, to_id, accepted) VALUES (36, 206, false); 
INSERT INTO friend_requests (from_id, to_id, accepted) VALUES (72, 206, false); 
INSERT INTO friend_requests (from_id, to_id, accepted) VALUES (32, 206, true); 
INSERT INTO friend_requests (from_id, to_id, accepted) VALUES (60, 206, true); 
INSERT INTO friend_requests (from_id, to_id, accepted) VALUES (191, 206, true);  */


/* INSERT INTO chats (user_id, message_text) VALUES (203, 'Hey there'); 
INSERT INTO chats (user_id, message_text) VALUES (12, 'Anyone planning to go to Artic Monkeys concert in Cologne?'); 
INSERT INTO chats (user_id, message_text) VALUES (203, 'YES! Im going in December.'); 
INSERT INTO chats (user_id, message_text) VALUES (12, 'Cool!'); 
INSERT INTO chats (user_id, message_text) VALUES (203, 'Yeah ;)'); 
INSERT INTO chats (user_id, message_text) VALUES (203, 'Wanna join me?'); 
INSERT INTO chats (user_id, message_text) VALUES (12, 'Sounds cool. Let me think about that.'); 
INSERT INTO chats (user_id, message_text) VALUES (203, 'Sure. Ill send you a friend request, we can chat later.'); 
INSERT INTO chats (user_id, message_text) VALUES (12, 'Nice! Thanks man.'); 
INSERT INTO chats (user_id, message_text) VALUES (47, 'Hi everyone! Anyone up for some drinks?'); 
INSERT INTO chats (user_id, message_text) VALUES (111, 'Who wants to join me on the Tool concert in Berlin??'); 
INSERT INTO chats (user_id, message_text) VALUES (187, 'Wow always wanted to see Tool. When and are there still tickets left?'); 
INSERT INTO chats (user_id, message_text) VALUES (47, 'Guys.. what about drinks? :('); 
INSERT INTO chats (user_id, message_text) VALUES (187, 'Not sure about the tickets. Could be hard to get some.'); 
INSERT INTO chats (user_id, message_text) VALUES (12, 'Damn I knew it :( I will check it.'); 

 */