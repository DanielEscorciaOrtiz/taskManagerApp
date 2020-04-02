/* --------------- Server middleware --------------- */

"use strict";

// const maintenanceMode = (request, response, next) => response.status(503).send("Server in maintenance");
{
    const
        jwt = require("jsonwebtoken"),
        User = require("../models/user");

    const auth = async function (request, response, next) {
        try {
            const
                token = request.header("Authorization").replace("Bearer ", ""),
                decoded = jwt.verify(token, process.env.JWT_SECRET),
                user = await User.findOne({ _id: decoded._id, "tokens.token": token })
            if (!user) throw new Error();
            request.user = user;
            request.token = token;
            next();
        } catch (error) {
            response.status(401).send({error:"Please authenticate"});
        }
    }
    // const token = jwt.sign({ _id: "abc123" }, "example", { expiresIn: "1 day" });
    //     console.log(token);
    module.exports = auth;
}