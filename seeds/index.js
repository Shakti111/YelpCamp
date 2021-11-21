const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

mongoose
    .connect("mongodb://localhost:27017/yelpCamp", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Mongoose connection established!");
    })
    .catch((err) => {
        console.log(err);
    });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 30 + 10);
        const camp = new Campground({
            author: "6193ca8147874da13249a0f0",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ],
            },
            images: [
                {
                    url: "https://res.cloudinary.com/do14kr3xo/image/upload/v1637225225/YelpCamp/hzqvvucgzsevn3tsdass.jpg",
                    filename: "YelpCamp/hzqvvucgzsevn3tsdass",
                },
                {
                    url: "https://res.cloudinary.com/do14kr3xo/image/upload/v1637240051/YelpCamp/kh9y1vhkfbobhoi3gzln.jpg",
                    filename: "YelpCamp/dymfwlfswmtrgpdwggry",
                },
                {
                    url: "https://res.cloudinary.com/do14kr3xo/image/upload/v1637222436/YelpCamp/xu3k4nfyojwthuyod5tr.jpg",
                    filename: "YelpCamp/szwnfkeyttr5aox2euho",
                },
            ],
            description:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur ex veniam ipsam nesciunt adipisci temporibus maxime quasi quos corporis dolorum.",
            price: price,
        });
        await camp.save();
    }
};
seedDB().then(() => {
    mongoose.connection.close();
});
