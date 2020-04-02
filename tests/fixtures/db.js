/* --------------- DB --------------- */

"use strict";

{
    const
        jwt = require("jsonwebtoken"),
        mongoose = require("mongoose"),
        User = require("../../src/models/user"),
        Task = require("../../src/models/task");

    const
        userOneId = new mongoose.Types.ObjectId(),
        userOne = {
            _id: userOneId,
            name: "Onigiri",
            email: "miau@cat.com",
            age: 5,
            password: "CatsRule!",
            tokens: [{
                token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
            }]
        },
        userTwoId = new mongoose.Types.ObjectId(),
        userTwo = {
            _id: userTwoId,
            name: "Cookie",
            email: "woo@dog.com",
            age: 5,
            password: "CatsRule!",
            tokens: [{
                token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
            }]
        },
        taskOne = {
            _id: new mongoose.Types.ObjectId(),
            description: "First task",
            completed: false,
            owner: userOneId
        },
        taskTwo = {
            _id: new mongoose.Types.ObjectId(),
            description: "Second task",
            completed: true,
            owner: userOneId
        },
        taskThree = {
            _id: new mongoose.Types.ObjectId(),
            description: "Third task",
            completed: false,
            owner: userTwoId
        };

    const setupDataBase = async function () {
        // delete all database
        await User.deleteMany();
        await Task.deleteMany();
        // save users to db
        await new User(userOne).save();
        await new User(userTwo).save();
        // save tasks to db
        await new Task(taskOne).save();
        await new Task(taskTwo).save();
        await new Task(taskThree).save();
    };

    module.exports = {
        userOne,
        userOneId,
        userTwo,
        userTwoId,
        taskOne,
        taskTwo,
        taskThree,
        setupDataBase,
    };
}