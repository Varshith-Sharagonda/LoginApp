import jwt from 'jsonwebtoken';

export const generateAuthTokenAndSetCookie = (res, user) => {
  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  return token;
};

export const authenticateToken = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized access.' });
  }
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    if (!id) {
      return res.status(401).json({ success: false, message: 'Unauthorized access.' });
    }
    req.userId = id;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: `Error protecting route: ${error.message}` });
  }
};
