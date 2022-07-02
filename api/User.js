const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.post('/signup', (req, res) => {
    let { name, email, password, dateOfBirth } = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();
    dateOfBirth = dateOfBirth.trim();

    if (name == "" || email == "" || password == "" || dateOfBirth == "") {
        res.json({
            status: "FAILED",
            message: "Empty input fields!"
        })
    }
    else if (!/^[a-zA-Z ]*$/.test(name)) {
        res.json({
            status: "FAILED",
            message: "Invalid name entered"
        })
    }
    else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.json({
            status: "FAILED",
            message: "Invalid email entered"
        })
    }
    else if (!new Date(dateOfBirth).getTime()) {
        res.json({
            status: "FAILED",
            message: "Invalid date of birth entered"
        })
    }
    else if (password.length < 8) {
        res.json({
            status: "FAILED",
            message: "Password is too short"
        })
    }
    else {
        // Checking if user already exists
        User.find({ email })
            .then((result) => {
                if (result.length) {
                    res.json({
                        status: "FAILED",
                        message: "User with the provided email already exists"
                    })
                }
                else {
                    // Try to create new user

                    // Password handling
                    const saltsRound = 10;
                    bcrypt.hash(password, saltsRound).then(hashedPassword => {
                        const newUser = new User({
                            name,
                            email,
                            password: hashedPassword,
                            dateOfBirth
                        })
                        newUser.save()
                            .then((result) => {
                                res.json({
                                    status: "SUCCESS",
                                    message: "Signup successful",
                                    data: result
                                })
                            })
                            .catch((error) => {
                                console.log(error);
                                res.json({
                                    status: "FAILED",
                                    message: "An error occured while saving user acount"
                                })
                            })
                    })
                        .catch((error) => {
                            console.log(error);
                            res.json({
                                status: "FAILED",
                                message: "An error occured while hashing password"
                            })
                        })
                }
            })
            .catch((error) => {
                console.log(error);
                res.json({
                    status: "FAILED",
                    message: "An error occured while checking for existing user"
                })
            })
    }
})

router.post('/signin', (req, res) => {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();
    if (email == "" || password == "") {
        res.json({
            status: "FAILED",
            message: "Empty cradential supplied"
        })
    } else {
        // Chceck if user exists
        User.find({ email })
            .then((data) => {
                if (data.length) {
                    // User exists
                    const hashedPassword = data[0].password;
                    bcrypt.compare(password, hashedPassword)
                        .then((result) => {
                            if (result) {
                                // password match
                                res.json({
                                    status: "SUCCESS",
                                    message: "Signin successful",
                                    data: data
                                })
                            } else {
                                res.json({
                                    status: "FAILED",
                                    message: "Invalid password entered"
                                })
                            }
                        })
                        .catch((error) => {
                            res.json({
                                status: "FAILED",
                                message: "An error occured while comparing password"
                            })
                        })
                }
            })
            .catch((error) => {
                res.json({
                    status: "FAILED",
                    message: "An error occured while checking existing of user"
                })
            })
    }
})

module.exports = router;