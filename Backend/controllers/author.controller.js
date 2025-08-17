const authorModel = require("../models/author.model")



const createAuthor = async (req,res)=>{
    try {
        const {name,biography,dateOfBirth,nationality} = req.body
        if(!name|| !biography || !dateOfBirth || !nationality){

            return res.status(401).json({message:"All field should be completed"})
        }

        const data  = new authorModel({name,biography,dateOfBirth,nationality})
        const author  = await data.save()

        res.status(201).json({message:"Created Author successfully",authorData:author})
    } catch (error) {
        console.log("Eroor in creation of author",error)
        res.status(500).json({message:"Failed to create Author"})
    }
}

const getAllAuthorsRaw = async(req,res)=>{
    try {
        const authors = await authorModel.find().populate('books')
        res.status(200).json(authors)
    } catch (error) {
        console.log("Error in fetch authors",error)
        res.status(500).json({message:"Failed to fetch Authors"})
    }
}
// controllers/author.controller.js

const getAllAuthors = async (req, res) => {
    try {
      const { name, nationality, sort, page = 1, limit = 6 } = req.query;
  
      const filter = {};
      if (name) filter.name = { $regex: name, $options: 'i' };
      if (nationality) filter.nationality = nationality;
  
      const sortOptions = {
        name: { name: 1 },
        latest: { createdAt: -1 }
      };
  
      const sortBy = sortOptions[sort] || {};
  
      const skip = (page - 1) * limit;
  
      const authors = await authorModel
        .find(filter)
        .populate('books')
        .skip(skip)
        .limit(parseInt(limit))
        .sort(sortBy);
  
      const totalCount = await authorModel.countDocuments(filter);
  
      res.status(200).json({
        authors,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: parseInt(page)
      });
    } catch (error) {
      console.error("Error fetching authors:", error);
      res.status(500).json({ message: "Failed to fetch authors" });
    }
  };
  

const getAuthorById = async (req,res)=>{
    try {
        const author  = await authorModel.findById(req.params.id).populate('books')
        if(!author) return res.status(404).json({message:"Author not found"})

            res.status(200).json(author)
    } catch (error) {
        console.log("Error in fetch Author",error)
        res.status(500).json({message:"Failed to fetch Author"})
    }
}


const updateAuthorById = async (req,res)=>{
try {


    const updateData = {}
    if(req.body.name){
        updateData.name = req.body.name
    }
    if(req.body.biography){
        updateData.biography = req.body.biography
    }
    if(req.body.dateOfBirth){
        updateData.dateOfBirth = req.body.dateOfBirth
    }
    if(req.body.nationality){
        updateData.nationality = req.body.nationality
    }

    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No valid fields to update" });
    }

    const updatedAuthor = await authorModel.findByIdAndUpdate(req.params.id,updateData,{new:true})

    if (!updatedAuthor) return res.status(404).json({ message: "Author not found" });
     res.status(200).json({message:"Author updated Successfully",author:updatedAuthor})
} catch (error) {
console.log("Author not updated : ",error)
res.status(500).json({message:"update failed"})    
}
}

const deleteAuthorById = async (req,res) =>{
    try {
        const author = await authorModel.findByIdAndDelete(req.params.id)
        res.status(200).json({message:"Author deleted successfully"})
    } catch (error) {
        console.log("Error in delete Author",error)
        res.status(500).json({message:"Failed to delete Author"})
    }
}

module.exports = {createAuthor,getAllAuthors,getAuthorById,updateAuthorById,deleteAuthorById,getAllAuthorsRaw}