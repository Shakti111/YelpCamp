const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const catchAsync = require("../utilities/catchAsync");
const users = require("../controllers/users");
const isLoggedIn = (req, res, next) => {
    if (req.user) {
        req.logout();
        req.flash("success", "Successfully logged out!");
        return res.redirect("/campgrounds");
    }
    next();
};

router
    .route("/register")
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router
    .route("/login")
    .get(users.renderLogin)
    .post(
        passport.authenticate("local", {
            failureFlash: true,
            failureRedirect: "/login",
        }),
        users.login
    );

router.get("/logout", isLoggedIn, users.logout);

module.exports = router;
