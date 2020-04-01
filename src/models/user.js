/* --------------- User Model --------------- */

"use strict";

{
    const
        mongoose = require("mongoose"),
        validator = require("validator"),
        bcrypt = require("bcryptjs"),
        jwt = require("jsonwebtoken"),
        Task = require("./task");

    const userSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true
        },
        age: {
            type: Number,
            required: true,
            default: 0,
            validate(value) {
                if (value < 0) {
                    throw new Error("Age must be positive");
                }
            }
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) throw new Error("Not a valid mail");
            }
        },
        password: {
            type: String,
            required: true,
            minlength: 7,
            trim: true,
            validate(value) {
                if (/password/.test(value)) throw new Error(`The password must not contain "password"`);
            }

        },
        tokens: [{
            token: {
                type: String,
                required: true
            }
        }],
        avatar: {
            type: Buffer
        }
    }, {
        timestamps: true
    });

    // Stablish relationship with tasks
    userSchema.virtual("tasks", {
        ref: "Task",
        localField: "_id",
        foreignField: "owner"
    });

    // Hide sensible data
    userSchema.methods.toJSON = function () {
        const
            user = this,
            userObject = user.toObject();
        delete userObject.tokens;
        delete userObject.password;
        delete userObject.avatar;
        return userObject;
    }

    // Generate Authorization Token
    userSchema.methods.generateAuthToken = async function () {
        const
            user = this,
            token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
        user.tokens = user.tokens.concat({ token });
        await user.save();
        return token;
    }

    // Verify credentials 
    userSchema.statics.findByCredentials = async function (email, password) {
        const user = await User.findOne({ email });
        if (!user) throw new Error("Unable to log in");
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) throw new Error("Unable to log in");
        return user;
    }

    // Hash the plain text password
    userSchema.pre("save", async function (next) {
        const user = this;
        // If the password is added or modified
        if (user.isModified("password")) {
            user.password = await bcrypt.hash(user.password, 8);
        }
        next();
    });

    // Delete tasks when user delete its profile
    userSchema.pre("remove", async function (next) {
        const user = this;
        await Task.deleteMany({ owner: user._id });
        next();
    })

    const User = mongoose.model("User", userSchema);

    module.exports = User;
}
