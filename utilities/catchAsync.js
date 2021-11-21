module.exports = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch((e) => {
            if (e.name === "CastError") {
                req.flash("error", "Invalid campground ID!");
                return res.redirect("/campgrounds");
            }
            next(e);
        });
    };
};
