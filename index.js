const express = require("express");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, { origins: 'localhost:8080' });
const compression = require("compression");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const apiRoutes = require("./api-routes.js");
const db = require("./db.js");
const groupBy = require('lodash.groupby');


// ---------- MIDDLEWARES ----------
app.use(compression());
app.use(express.json());
app.use("/static", express.static("./static"));
app.use("/user-pics", express.static("./user-pics"));

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});
app.use(cookieSessionMiddleware);
io.use((socket, next) => {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());
app.use((req, res, next) => {
    res.cookie("mytoken", req.csrfToken());
    next();
});
app.use(apiRoutes);

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.use((req, res, next) => {
    console.log("Session debugging middleware, userId = ", req.session.userId, req.url); 
    next();
});


// ---------- REDIRECT UNAUTHORIZED ACCESS ----------
app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect(302, "/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});


// ---------- CHECK & REDIRECT IF USER IS LOGGED IN / OUT ----------
app.get("*", (req, res) => {
    if (!req.session.userId) {
        res.redirect(302, "/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});


// ---------- SOCKET.IO ----------
io.on("connection", async (socket) => {

    console.log(`socket with the id ${socket.id} is now connected`);

    const userId = socket.request.session.userId;
    console.log("socket is connected with userId: ", userId);

    const messages = await db.getChatMessages();

    // send messages to browser:
    socket.emit("chatMessages", messages);

    socket.on("newMessage", async(messageText) => {

        console.log("new message received: ", messageText);

        const {id} = await db.addChatMessage(userId, messageText);
        const user = await db.getOtherUsersById(userId);

        io.sockets.emit("chatMessage", {
            message_id: id,
            message_text: messageText,
            ...user
        });

        console.log("user from socket.io", user);

    });
 
});



server.listen(8080, function () {
    console.log("Ready to rumble!");
});
