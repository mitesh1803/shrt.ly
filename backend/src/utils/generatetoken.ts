import jwt from "jsonwebtoken";

const JWT_SECRET = "your_jwt_secret";

const generateToken = (userId: any): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

export default generateToken;
