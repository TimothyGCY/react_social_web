const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRound = 10

const validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  return re.test(email)
}

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
    },
  },
  {
    timestamps: true,
  },
)

// hash user password before saving into db
userSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, saltRound)
  next()
})

module.exports = mongoose.model('User', userSchema)
