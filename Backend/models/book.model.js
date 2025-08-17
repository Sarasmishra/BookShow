const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    ISBN: {
      type: String,
      unique: true,
      required: true,
    },
    description: {
      type: String,
    },
    publicationDate: {
      type: Date,
    },
    genres: [
      {
        type: String,
      },
    ],
    copiesAvailable: {
      type: Number,
      default: 1,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
    },
    borrowedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    coverImage: {
      type: String,
      default: "", // or a placeholder image URL
    },

    // review and rating 
    reviews: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          comment: {
            type: String,
          },
          rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      averageRating: {
        type: Number,
        default: 0
      },
      
  },
  {
    timestamps: true,
  }
);

const bookModel = mongoose.model("Book", bookSchema);
module.exports = bookModel;
