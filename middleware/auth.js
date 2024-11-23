const { User } = require("../models/User");
const auth = async (req, res, next) => {
  const token = req.cookies.x_auth;

  try {
    const user = await User.findByToken(token); // Promise 방식으로 호출
    if (!user) throw new Error("유저가 존재하지 않습니다.");

    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ isAuth: false, error: true });
  }
};
module.exports = { auth };
