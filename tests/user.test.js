/* --------------- User Test --------------- */

"use strict";

{
    const
        request = require("supertest"),
        server = require("../src/server"),
        User = require("../src/models/user"),
        { userOne, userOneId, setupDataBase } = require("./fixtures/db");

    beforeEach(setupDataBase);

    /* --------------- Create User --------------- */

    test("Should sign up new user", async () => {
        const response = await request(server)
            .post("/users")
            .send({
                name: "Daniel",
                email: "descorcia@intekglobal.com",
                age: 29,
                password: "CatsRule!"
            }).expect(201);

        // Assert the database was changed correctly
        const user = await User.findById(response.body.user._id);
        expect(user).not.toBeNull();

        // Assertion in the body
        expect(response.body).toMatchObject({
            user: {
                name: "Daniel",
                email: "descorcia@intekglobal.com"
            },
            token: user.tokens[0].token
        });

        expect(user.password).not.toBe("CatsRule!");
    });

    test("Should NOT sign up existing user", async () => {
        await request(server)
            .post("/users")
            .send({
                name: userOne.name,
                email: userOne.email,
                age: userOne.age,
                password: userOne.password
            })
            .expect(400);
    });

    /* --------------- User Login --------------- */

    test("Should log in existing user", async () => {
        const response = await request(server)
            .post("/users/login")
            .send({
                email: userOne.email,
                password: userOne.password
            })
            .expect(200);

        const user = await User.findById(userOneId);

        expect(response.body.token).toBe(user.tokens[1].token);
    });

    test("Should NOT log in non-existing user", async () => {
        await request(server)
            .post("/users/login")
            .send({
                name: "Daniel",
                email: "descorcia@intekglobal.com",
            })
            .expect(400);
    });

    /* --------------- User Profile --------------- */

    test("Should get profile of user", async () => {
        await request(server)
            .get("/users/me")
            .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200);
    });

    test("Should NOT get profile of unauthenticated user", async () => {
        await request(server)
            .get("/users/me")
            .send()
            .expect(401);
    });

    /* --------------- Update User Profile --------------- */

    test("Should update valid user fileds", async () => {
        await request(server)
            .patch("/users/me")
            .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
            .send({
                name: "Giri"
            })
            .expect(200);
        const user = await User.findById(userOneId);
        expect(user.name).toBe("Giri");
    });

    test("Should NOT update invalid user fileds", async () => {
        await request(server)
            .patch("/users/me")
            .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
            .send({
                location: "Giri"
            })
            .expect(400);
    });

    /* --------------- Delete Profile --------------- */

    test("Should delete account of user", async () => {
        await request(server)
            .delete("/users/me")
            .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200);

        const user = await User.findById(userOneId);
        expect(user).toBeNull();
    });

    test("Should NOT delete account of unauthenticated user", async () => {
        await request(server)
            .delete("/users/me")
            .send()
            .expect(401);
    });

    /* --------------- Upload avatar --------------- */

    test("Should upload avatar", async () => {
        await request(server)
            .post("/users/me/avatar")
            .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
            .attach("avatar", "tests/fixtures/profile-pic.jpg")
            .expect(200);
        const user = await User.findById(userOneId);
        expect(user.avatar).toEqual(expect.any(Buffer));
    });
}
