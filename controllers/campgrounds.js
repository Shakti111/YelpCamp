const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary/index");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const campground = require("../models/campground");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
    const geoData = await geoCoder
        .forwardGeocode({
            query: req.body.campground.location,
            limit: 1,
        })
        .send();
    const newCamp = new Campground(req.body.campground);
    newCamp.geometry = geoData.body.features[0].geometry;
    newCamp.images = req.files.map((f) => ({
        url: f.path,
        filename: f.filename,
    }));
    newCamp.author = req.user._id;
    await newCamp.save();
    req.flash("success", "Successfully made a new campground");
    res.redirect(`/campgrounds/${newCamp._id}`);
};

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const foundCamp = await Campground.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("author");
    if (!foundCamp) {
        req.flash("error", "Cannot find the campground!");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { foundCamp });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const foundCamp = await Campground.findById(id);
    if (!foundCamp) {
        req.flash("error", "Cannot find the campground!");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { foundCamp });
};
module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const editCamp = await Campground.findByIdAndUpdate(
        id,
        req.body.campground,
        {
            runValidators: true,
        }
    );
    const imgs = req.files.map((f) => ({
        url: f.path,
        filename: f.filename,
    }));
    editCamp.images.push(...imgs);
    await editCamp.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await editCamp.updateOne({
            $pull: { images: { filename: { $in: req.body.deleteImages } } },
        });
    }
    req.flash("success", "Successfully updated campground");
    res.redirect(`/campgrounds/${editCamp._id}`);
};

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground");
    res.redirect("/campgrounds");
};
