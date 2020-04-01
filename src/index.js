/* --------------- index.js --------------- */

"use strict";

console.clear();

{
    /* --------------- Open database --------------- */

    require("./db/mongoose");

    /* --------------- Require modules --------------- */

    const
        express = require("express"),
        userRouter = require("./routers/user"),
        taskRouter = require("./routers/task");

    /* --------------- Create server --------------- */

    const
        server = express(),
        port = process.env.PORT;

    /* --------------- Configure server --------------- */

    // Define paths for express configuration
    // const publicDirectoryPath = path.join(__dirname, "../public");

    // Setup static directory to serve
    // server.use(express.static(publicDirectoryPath));
    // Tell to parse json files
    server.use(express.json());
    // Register routers
    server.use(userRouter);
    server.use(taskRouter);

    /* --------------- Configure server responses --------------- */

    // 404 - Pages not found
    // server.get("*", (request, response) => {
    //     response.status(404).send({ error: "404 page not found" });
    // });

    /* --------------- Get server running --------------- */

    server.listen(port, function () {
        console.log(`Server is running on port ${port}`);
    });
}

