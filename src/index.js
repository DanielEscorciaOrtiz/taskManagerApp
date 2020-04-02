/* --------------- index.js --------------- */

"use strict";

console.clear();

{
    /* --------------- Import server --------------- */

    const server = require("./server");

    /* --------------- Create Port --------------- */

    const port = process.env.PORT;

    /* --------------- Get server running --------------- */

    server.listen(port, function () {
        console.log(`Server is running on port ${port}`);
    });
}

