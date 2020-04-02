/* --------------- Task Test --------------- */

"use strict";

{
    const
        request = require("supertest"),
        server = require("../src/server"),
        Task = require("../src/models/task"),
        {
            userOne,
            userTwo,
            taskOne,
            taskTwo,
            taskThree,
            setupDataBase } = require("./fixtures/db");

    beforeEach(setupDataBase);

    /* --------------- Create Task --------------- */

    test("Should create new task", async () => {
        const response = await request(server)
            .post("/tasks")
            .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
            .send({
                description: "Eat"
            })
            .expect(201);

        // Assert the database was changed correctly
        const task = await Task.findById(response.body._id);
        expect(task).not.toBeNull();

        // Assertion in the body
        expect(response.body).toMatchObject({
            description: "Eat",
            completed: false
        });
    });

    /* --------------- Get user Tasks --------------- */

    test("Fetch user tasks", async () => {
        const response = await request(server)
            .get("/tasks")
            .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200);

        // Assert tasks fetched correctly
        expect(response.body.length).toBe(2);
    });

    /* --------------- Delete user Tasks --------------- */

    test("Should NOT delete the task of another user", async () => {
        const response = await request(server)
            .delete(`/tasks/${taskOne._id}`)
            .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
            .send()
            .expect(404);

        // Assert task was not deleted
        const task = await Task.findById(taskOne._id);
        expect(task).not.toBeNull();
    });

}