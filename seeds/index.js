//Initializing Mongoose and connecting to MongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/YelpCamp')
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch(err=>{
    console.log("Connection to MongoDB failed");
    console.log(err);
})

const Campground= require('../models/campground');
const cities = require('./cities');
const {places,descriptors} = require('./seedhelper');

const deleteDB  = async () =>{
    await Campground.deleteMany({});
}
deleteDB();

const sample = array =>array[Math.floor(Math.random()*array.length)];

const seedDB = async () =>{
    for (let i=0;i<300;i++)
    {
        const random1000 = Math.floor(Math.random()*1000);
        const price =Math.floor(Math.random()*500)+1000;
        const camp = new Campground({
            author:'647ae23d773ee05878a20a15',
            location:`${cities[random1000].city},${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            images:{
                url:'https://res.cloudinary.com/dxk0ubbcv/image/upload/v1685774975/YelpCamp/mxs29ymmubu5cyy8znwk.jpg',
                filename:'YelpCamp/mxs29ymmubu5cyy8znwk'
            },
            geometry :{
                type:"Point",
                coordinates:[
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            price:price,
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Et officia sint exercitationem praesentium minus accusantium eos magni, repellendus, dolor atque in omnis reiciendis incidunt provident recusandae minima, sequi perspiciatis rem.'
        });
       await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
});

