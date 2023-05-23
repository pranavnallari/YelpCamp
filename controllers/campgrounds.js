const Campground = require('../models/campground');

module.exports.index = async (req,res)=>{
    const campground = await Campground.find({});
    res.render('campgrounds/index', { campground })
}

module.exports.renderNewForm = (req,res)=>{
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
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
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    req.flash('success',"Successfully Updated Campground");
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted Campground')
    res.redirect('/campgrounds');
}