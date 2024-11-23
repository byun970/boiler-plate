const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

userSchema.pre("save", function (next) {
  // 비밀번호를 암호화 시킨다.

  var user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
      if (err) return reject(err);
      resolve(isMatch);
    });
  });
};

userSchema.methods.generateToken = async function () {
  const user = this;
  const token = jwt.sign(user._id.toHexString(), "secretToken");

  user.token = token;

  try {
    await user.save(); // save() 메서드를 await로 처리
    return token; // 토큰 반환
  } catch (err) {
    throw err; // 에러를 호출한 곳으로 전달
  }
};

userSchema.statics.findByToken = async function (token) {
  const user = this;

  try {
    const decoded = jwt.verify(token, "secretToken");
    const foundUser = await user.findOne({ _id: decoded, token: token }); // Promise 사용
    return foundUser; // 결과 반환
  } catch (err) {
    throw err; // 에러를 호출한 곳으로 전달
  }
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
