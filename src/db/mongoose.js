/* --------------- Mongoose --------------- */

"use strict";

{
    /* --------------- Require modules --------------- */

    const mongoose = require("mongoose");

    /* --------------- Connect to database --------------- */

    (async () => {
        console.log("Connecting to database");
        console.log(process.env.MONGODB_URL);
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
        console.log("Connected to database");
    })();

    /* --------------- Create models --------------- */

    // Mongoose atumatically lowercase the model names ("User" --> "user")
    // Also adds an "s" at the end, to name the collection

    // const Task = mongoose.model("Task", {
    //     description: {
    //         type: String,
    //         required: true,
    //         trim: true
    //     },
    //     completed: {
    //         type: Boolean,
    //         default: false
    //     }
    // });

    /* --------------- Create instance of models --------------- */

    // const task = new Task({
    //     description: "eat",
    //     completed: false
    // });

    /* --------------- Perform CRUD operations over the instances --------------- */

    // task.save().then(() => {
    //     console.log(task);
    // }).catch((error) => {
    //     console.log("Error!", error.message);
    // }).finally(() => {
    //     console.log("Finally");
    // });
}

