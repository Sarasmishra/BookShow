const authorModel = require("../models/author.model")
const bookModel = require("../models/book.model")


const createBook = async (req, res) => {
  try {
    const { title, ISBN, description, publicationDate, genres, copiesAvailable, authorId } = req.body;

    if (!title || !ISBN || !authorId) {
      return res.status(409).json({ message: "All fields should be filled" });
    }

    const coverImage = req.file?.path || ""; // path is returned by cloudinaryUpload

    const book = new bookModel({
      title,
      ISBN,
      description,
      publicationDate,
      genres,
      copiesAvailable,
      author: authorId,
      coverImage,
    });

    const savedBook = await book.save();

    // Add book reference to author
    await authorModel.findByIdAndUpdate(authorId, {
      $push: { books: savedBook._id },
    });

    res.status(201).json({
      message: "Book created successfully",
      bookData: savedBook,
    });
  } catch (error) {
    console.log("Error to create book", error);
    res.status(500).json({ message: "Failed to create Book" });
  }
};

const getAllBooks = async (req, res) => {
    try {
      const { title, author, genre, page = 1, limit = 6 } = req.query;
  
      const filter = {};
  
      if (genre) filter.genres = genre;
      if (author) filter.author = author;
      if (title) filter.title = { $regex: title, $options: "i" };
  
      const skip = (page - 1) * limit;
  
      const totalBooks = await bookModel.countDocuments(filter);
      const sortOptions = {
        latest: { publicationDate: -1 },
        title: { title: 1 }
      };
      
      const sortBy = sortOptions[req.query.sort] || {};
      
      const books = await bookModel
        .find(filter)
        .populate('author')
        .skip(skip)
        .limit(parseInt(limit))
        .sort(sortBy);
  
      res.status(200).json({
        books,
        totalPages: Math.ceil(totalBooks / limit),
        currentPage: parseInt(page),
      });
    } catch (error) {
      console.log("Error to get all Books", error);
      res.status(500).json({ message: "Failed to fetch books" });
    }
  };
  const getAllBooksRaw = async (req, res) => {
    try {
      const books = await bookModel.find().populate('author');
      res.status(200).json(books);
    } catch (error) {
      console.error("Error fetching all books:", error);
      res.status(500).json({ message: "Failed to fetch books",error:error.message });
    }
  };

const getBookById = async (req,res)=>{

    try {
        const id = req.params.id

      
    
        const book = await bookModel.findById(id).populate('author')
        if (!book) return res.status(404).json({ message: "Book not found" });
        res.status(200).json(book)
    } catch (error) {
        console.log("error to get bookbyId",error)
        res.status(500).json({message:"Failed to get book",error:error.message})
    }
}

const updateBookById= async (req,res)=>{
    try {
        const updateBook = await bookModel.findByIdAndUpdate(req.params.id,req.body,{new:true})
        if(!updateBook) return res.status(404).json({message:"Book not found"})
        res.status(200).json({message:"Book updated",bookData:updateBook})    
    } catch (error) {
        console.log("error to update book",error)
        res.status(500).json({message:"Failed to update book"})
    } 
}

const deleteBookById = async (req,res)=>{
    try {
        const book = await bookModel.findByIdAndDelete(req.params.id)

        if(!book) return res.status(404).json({message:"Book Not found"})
        
        //  remove the book from author's list
        await authorModel.findByIdAndUpdate(book.author,{
            $pull:{books:book._id}
        })

        res.status(200).json({message:"Book Deleted Successfully"})

    } catch (error) {
        console.log("error to delete book",error)
        res.status(500).json({message:"Failed to delete book"})
    }
}


//  rating and review to book

const addReviewToBook = async (req, res) => {
  const  bookId  = req.params.id;
  const {rating, comment } = req.body;

  try {

    const book = await bookModel.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const alreadyReviewed = book.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You already reviewed this book' });
    }

    const newReview = {
      user: req.user._id,
      name: req.user.name,
      comment,
      rating: Number(rating),
    };

    book.reviews.push(newReview);

    // update average rating
    book.averageRating =
      book.reviews.reduce((acc, item) => acc + item.rating, 0) / book.reviews.length;

    await book.save();

    res.status(201).json({ message: 'Review added', reviews: book.reviews });
  } catch (error) {
    console.log('Error adding review:', error);
    res.status(500).json({ message: 'Failed to add review' });
  }
};



module.exports ={createBook,getAllBooks,getBookById,updateBookById,deleteBookById,getAllBooksRaw,addReviewToBook}