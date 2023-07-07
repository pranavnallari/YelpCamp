const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken})
const {cloudinary} = require('../cloudinary')   

module.exports.index = async (req,res)=>{
    const campground = await Campground.find({});
    res.render('campgrounds/index', { campground })
}

module.exports.renderNewForm = (req,res)=>{
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res, next) => {
    const geoData = geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    })
    .send()
    const campground = new Campground(req.body.campground);
    campground.images =  req.files.map(f =>({url : f.path,filename : f.filename}))  
    campground.author = req.user._id
    await campground.save();
    req.flash('Success','Successfully made a new campground')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res,) => {
    const campsite = await Campground.findById(req.params.id).populate({path:'review',populate:{path:'author'}}).populate('author');
    if(!campsite){
      req.flash('error','Cannot find Campground');
      return res.redirect('/campgrounds')
   }
     res.render('campgrounds/campsiteDetails', { campsite });
}

module.exports.renderEditForm = async (req, res,next) => {
    const campsite = await Campground.findById(req.params.id)
    if(!campsite){
        req.flash('error','Cannot find Campground');
        return res.redirect('/campgrounds')
     }
     res.render('campgrounds/edit', { campsite });
}

module.exports.updateCampground = async (req, res,next) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    const imgs =  req.files.map(f =>({url : f.path,filename : f.filename}))
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages)
    {
        for(let filename of req.body.deleteImages)
        {
            await cloudinary.uploader.destroy(filename);
        }
       await campground.updateOne({$pull: {images : {filename : {$in: req.body.deleteImages}}}})
    }
    req.flash('success',"Successfully Updated Campground");
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted Campground')
    res.redirect('/campgrounds');
}