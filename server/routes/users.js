let express = require("express");
let Users = require("../models/user");
let router = express.Router();
let bcrypt = require("bcrypt");

function createUserList(users) {
    var userList = [];
    var id;
    for (let i = 0; i < users.length; i++) {
        newUser = new Users(users[i]);
        userList.push(newUser)
    }
    return userList;
}

// Create a new user
router.post("/user", async (req, res) => {
    try {
        let user = req.body;
        let checkIfTaken = await Users.getUserByUsername(user.username);
        if (checkIfTaken) {
            res.status(401).json(ERROR);
        }
        user.password = bcrypt.hashSync(user.password, 10);
        let id = await Users.addUser(user);

        res.send(new Users(user));
        
    } catch (err) {
        res.status(400).json({
            status: 400,
            message: err.message,
        });
    }
});

/* Gets the list of users from the DB */
router.get("/userlist", async (req, res) => {
    let search = null;
    if (req.query.search) {
        search = req.query.search
    }
    try {
        let users = createUserList(await Users.getUserList(search));
        res.status(200).json(users);
    } catch (err) {
        res.status(400).json({
            status: 400,
            message: err.message,
        });
    }
});

/** Update user */
router.put("/user/:uid", async (req, res) => {
    try {
        let user = await Users.getUserByUsername(req.params.uid);
        user.username = req.body.username;
        user.password = bcrypt.hashSync(req.body.password, 10);
        user.isAdmin = req.body.isAdmin;

        await Users.updateUserByUsername(req.params.uid, user);
        res.status(200).json({
            status: 200,
            message: "User updated",
        });
        
    } catch (err) {
        res.status(400).json({
            status: 400,
            message: err.message,
        });
    }
});

/** Delete a user */
router.delete("/user/:uid", async (req, res) => {
    try {
        let user = await Users.deleteByUsername(req.params.uid);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(400).json({
                status: 400,
                message: "No post found",
            });
        }

    } catch (err) {
        res.status(400).json({
            status: 400,
            message: err.message,
        });
    }
});

router.post("/login", async (req, res, next) => {
    var user = await Users.getUserByUsername(req.body.username);

    const ERROR = "Invalid credentials";
    if (user) {
        req.session.regenerate(() => {
            bcrypt.compare(
                req.body.password,
                user.password,

                (error, result) => {
                    if (result) {
                        delete user.password;

                        req.session.cookie.expires = 3600000;
                        req.session.user = user;
                        res.json(user);
                    } else {
                        res.status(401).json(ERROR);
                    }
                }
            );
        });
    } else {
        res.status(401).json(ERROR);
    }
});

router.post("/logout", (req, res, next) => {
    req.session.destroy(() => {
        res.status(200).send({});
    });
});

router.get("/who", (req, res, next) => {
    let result = req.session && req.session.user;
    res.json(result);
});

module.exports = router;
