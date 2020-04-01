/* --------------- User Router --------------- */

"use strict";

{
    const
        express = require("express"),
        multer = require("multer"),
        sharp = require("sharp"),
        User = require("../models/user"),
        auth = require("../middleware/auth"),
        { sendWelcomeEmail, sendCancelationEmail } = require("../emails/account"),
        router = new express.Router();

    // Create
    router.post("/users", async (request, response) => {
        const user = new User(request.body);
        try {
            await user.save();
            sendWelcomeEmail(user.email, user.name);
            const token = await user.generateAuthToken();
            response.status(201).send({ user, token });
        } catch (error) {
            response.status(400).send({ error: error.message });
        }
    });

    // Login
    router.post("/users/login", async (request, response) => {
        try {
            const
                user = await User.findByCredentials(request.body.email, request.body.password),
                token = await user.generateAuthToken();
            response.send({ user, token });
        } catch (error) {
            response.status(400).send({ error: error.message })
        }
    });

    // Log out one session
    router.post("/users/logout", auth, async (request, response) => {
        try {
            request.user.tokens = request.user.tokens.filter((token) => token.token !== request.token);
            await request.user.save();
            response.send("Logged out");
        } catch (error) {
            response.status(500).send();
        }
    });

    // Log out all sessions
    router.post("/users/logoutAll", auth, async (request, response) => {
        try {
            request.user.tokens = [];
            await request.user.save();
            response.send("Logget out from all devices");
        } catch (error) {
            response.status(500).send();
        }
    });

    // See Profile
    router.get("/users/me", auth, async (request, response) => {
        response.send(request.user);
    });

    // Update profile
    router.patch("/users/me", auth, async (request, response) => {
        const
            updates = Object.keys(request.body),
            allowedUpdates = ["age", "name", "email", "password"],
            validUpdates = updates.every((update) => allowedUpdates.includes(update));
        if (!validUpdates) return response.status(400).send({ error: "Invalid updates" });
        try {
            for (let update of updates) {
                request.user[update] = request.body[update];
            }
            await request.user.save();
            response.send(request.user);
        } catch (error) {
            response.status(400).send({ error: error.message });
        }
    });

    // Delete profile
    router.delete("/users/me", auth, async (request, response) => {
        try {
            await request.user.remove();
            sendCancelationEmail(request.user.email, request.user.name);
            response.send("Profile deleted");
        } catch (error) {
            response.status(500).send({ error: error.message });
        }
    });

    // Upload avatar
    const upload = multer({
        limits: {
            fileSize: 1e6 // 1,000,000 = 1MB
        },
        fileFilter(request, file, callback) {
            if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                return callback(new Error(`Please upload an image`));
            }
            callback(undefined, true);
        }
    });
    router.post("/users/me/avatar", auth, upload.single("avatar"), async (request, response) => {
        const buffer = await sharp(request.file.buffer).resize({
            width: 200,
            height: 200
        }).png().toBuffer();
        request.user.avatar = buffer;
        await request.user.save();
        response.send("Avatar uploaded");
    }, (error, request, response, next) => {
        response.status(400).send({ error: error.message })
    });

    // Delete avatar
    router.delete("/users/me/avatar", auth, async (request, response) => {
        try {
            if (!request.user.avatar) return response.status(404).send();
            request.user.avatar = undefined;
            await request.user.save();
            response.send("Avatar deleted");
        } catch (error) {
            response.status(500).send({ error: error.message });
        }
    })

    // Fetch avatar
    router.get("/users/me/avatar", auth, (request, response) => {
        try {
            if (!request.user.avatar) return response.status(404).send();
            response.set("Content-Type", "image/jpg").send(request.user.avatar);
        } catch (error) {
            response.status(500).send({ error: error.message });
        }
    });

    module.exports = router;
}