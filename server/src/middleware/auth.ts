import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  username: string;
  exp: number;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // TODO: verify the token exists and add the user data to the request object
  // Get the authorization header from the request
  const authHeader = req.headers.authorization;

  // Check if the authorization header is present
  if (!authHeader) {
    return res.status(401).json({ message: "Access denied. No token provided."})
      }
      const token = authHeader.split(" ")[1]; // Extract token from "Bearer TOKEN"
      const secretKey = process.env.JWT_SECRET_KEY || "";
    
      jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: "Invalid or expired token" });
        }
    
        const user = decoded as JwtPayload;
    
        // Check if token has expired
        if (user.exp * 1000 < Date.now()) {
          return res.status(403).json({ message: "Session expired. Please log in again." });
        }
    
        req.user = user; // Attach user data to the request
        next(); // Proceed to the next middleware
      });
    };