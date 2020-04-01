/* --------------- Task Router --------------- */

"use strict";

{
    const
        express = require("express"),
        Task = require("../models/task"),
        auth = require("../middleware/auth"),
        router = new express.Router();

    // Create
    router.post("/tasks", auth, async (request, response) => {
        // const task = new Task(request.body);
        const task = new Task({
            ...request.body,
            owner: request.user._id
        })
        try {
            await task.save();
            response.status(201).send(task);
        } catch (error) {
            response.status(400).send({ error: error.message });
        }
    });

    // Read All
    router.get("/tasks", auth, async (request, response) => {
        // Get tasks?completed=true
        // Get tasks?limit=10 (show 10 items)
        // Get tasks?skip=10 (skip the first 10 items)
        // Get tasks?sortBy=createdAt:asc (sorting criteria)
        try {
            // 1st approach (does not support pagination & sorting)
            // const tasks = await Task.find({ owner: request.user._id });
            // response.send(tasks);
            // 2nd approach
            const
                match = {},
                sort = {}; // 1=>asc, -1=>desc
            if (request.query.completed) {
                match.completed = request.query.completed === "true";
            }
            if (request.query.sortBy) {
                const [sortCriteria, sortingOrder] = request.query.sortBy.split(":");
                sort[sortCriteria] = sortingOrder === "asc" ? 1 : -1;
            }
            await request.user.populate({
                path: "tasks",
                match,
                options: {
                    limit: parseInt(request.query.limit),
                    skip: parseInt(request.query.skip),
                    sort
                }
            }).execPopulate();
            response.send(request.user.tasks);
        } catch (error) {
            response.status(500).send({ error: error.message });
        }
    });

    // Read One
    router.get("/tasks/:id", auth, async (request, response) => {
        try {
            const task = await Task.findOne({
                _id: request.params.id,
                owner: request.user._id
            })
            if (!task) return response.status(404).send();
            response.send(task);
        } catch (error) {
            response.status(500).send({ error: error.message });
        }
    });

    // Update
    router.patch("/tasks/:id", auth, async (request, response) => {
        const
            updates = Object.keys(request.body),
            allowedUpdates = ["completed", "description"],
            validUpdates = updates.every((update) => allowedUpdates.includes(update));
        if (!validUpdates) return response.status(400).send({
            error: "Invalid updates"
        });
        try {
            const task = await Task.findOne({
                _id: request.params.id,
                owner: request.user._id
            });
            if (!task) return response.status(404).send();
            for (let update of updates) {
                task[update] = request.body[update];
            }
            await task.save();
            response.send(task);
        } catch (error) {
            response.status(400).send({ error: error.message });
        }
    });

    // Delete
    router.delete("/tasks/:id", auth, async (request, response) => {
        try {
            const task = await Task.findOneAndDelete({
                _id: request.params.id,
                owner: request.user._id
            });
            if (!task) return response.status(404).send();
            const incomplete = await Task.countDocuments({
                completed: false,
                owner: request.user._id
            });
            response.send({ incomplete });
        } catch (error) {
            response.status(500).send({ error: error.message });
        }
    });

    module.exports = router;
}