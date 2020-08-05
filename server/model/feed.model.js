const mongoose = require('mongoose')
require('./user.model')

const feedSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    content: {
      type: String,
      trim: true,
      required: true,
    },
    upvote: {
      type: Number,
      default: 0,
    },
    downvote: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('Feed', feedSchema)
