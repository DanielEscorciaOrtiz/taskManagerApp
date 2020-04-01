/* --------------- MongoDB --------------- */

"use strict";

console.clear();

{

    /* --------------- Create database handler --------------- */

    const { MongoClient, ObjectID } = require("mongodb");

    /* --------------- Configure database --------------- */

    const
        connectionURL = "mongodb://127.0.0.1:27017",
        databaseName = "taskManager";

    // You can create your own id's
    // const id = new ObjectID();
    // console.log("ID", id);
    // console.log("Binary data", id.id);
    // console.log("BD length", id.id.length);
    // console.log("Hex string", id.toHexString());
    // console.log("HS length", id.toHexString().length);
    // console.log("Timestamp", id.getTimestamp());

    /* --------------- Connect to database --------------- */

    MongoClient.connect(connectionURL, { useUnifiedTopology: true }, (error, client) => {
        if (error) return console.log("Unable to connect to database");
        console.log("Connected correctly");

        const db = client.db(databaseName);

        /* --------------- Handle CRUD operations --------------- */
        // CRUD Create Read Update Delete

        // mongoDB collection methods take a callback with (error, X) as argument.
        // If no callback provided, they return a promise

        /* --------------- C r u d --------------- */
        /* --------------- Create --------------- */

        //      Script to add 1 item to the data base

        // db.collection("users").insertOne({
        //     name: "Golem",
        //     age: 1000
        // }, (error, result) => {
        //     if (error) return console.log("Unable to insert");
        //     console.log(result.ops);
        // });

        //      Script to add many items to the data base

        // db.collection("users").insertMany([
        //     {
        //         name: "Cookie",
        //         age: 11
        //     },
        //     {
        //         name: "Machis",
        //         age: 9
        //     }
        // ],  (error, result) =>{
        //     if (error) return console.log("Unable to insert");
        //     console.log(result.ops);
        // });

        /* --------------- c R u d --------------- */
        /* --------------- Read --------------- */

        // db.collection("users").findOne({ name: "Machis" }, (error, document) => {
        //     if (error) return console.log("Unable to get document");
        //     if (!document) return console.log("Document not found");
        //     console.log(document);
        // });

        // db.collection("users").findOne({ _id: new ObjectID("5e7e9cf39e076d10fdc20a80") }, (error, document) => {
        //     if (error) return console.log("Unable to get document");
        //     if (!document) return console.log("Document not found");
        //     console.log(document);
        // });

        //          The find method returns a cursor, with methods to use

        // db.collection("users").find({ age: 29 }).toArray().then((documents) => {
        //     if (!documents.length) return console.log("Documents not found");
        //     console.log("find", documents);
        // }).catch(() => {
        //     console.log("Unable to get documents");
        // }).finally(() => {
        // });

        // db.collection("users").find({ name: "Daniel" }).count((error, count) => {
        //     if (error) return console.log("Unable to get documents");
        //     console.log("count", count);
        // });

        /* --------------- c r U d --------------- */
        /* --------------- Update --------------- */

        // db.collection("users").updateOne({
        //     _id: new ObjectID("5e7e9be37551d610c580fb27")
        // }, {
        //     $set: {
        //         age: 29
        //     }
        // }).then((result) => {
        //     console.log("Updated:", result.modifiedCount===1);
        // }).catch((error) => {
        //     console.log("Error!", error);
        // }).finally(() => {
        //     console.log("Finally");
        // });

        // db.collection("tasks").updateMany({
        //     completed: false
        // }, {
        //     $set: {
        //         completed: true
        //     }
        // }).then((result) => {
        //     console.log("Updated:", result.modifiedCount);
        // }).catch((error) => {
        //     console.log("Error!", error);
        // }).finally(() => {
        //     console.log("Finally");
        // });

        /* --------------- c r u D --------------- */
        /* --------------- Delete --------------- */

        // db.collection("tasks").deleteOne({
        //     description: "Wash dishes"
        // }).then((result) => {
        //     console.log("Deleted:", result.deletedCount === 1);
        // }).catch((error) => {
        //     console.log("Error!", error);
        // }).finally(() => {
        //     console.log("Finally");
        // });

        // db.collection("users").deleteMany({
        //     age: 1000
        // }).then((result) => {
        //     console.log("Deleted:", result.deletedCount);
        // }).catch((error) => {
        //     console.log("Error!", error);
        // }).finally(() => {
        //     console.log("Finally");
        // });




    }); // MongoClient.connect end

}

console.log("Check");
