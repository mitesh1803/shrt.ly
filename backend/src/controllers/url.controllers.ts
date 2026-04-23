import type { Request, Response, NextFunction } from "express";
import { nanoid } from "nanoid";
import { prisma } from "../db.js";
import jwt from "jsonwebtoken";

interface JwtPayloadType {
  userId: number;
}

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

const getBaseUrl = (req: Request) => {
  const configuredBaseUrl = process.env.APP_BASE_URL?.replace(/\/+$/, "");

  if (configuredBaseUrl) {
    return configuredBaseUrl;
  }

  return `${req.protocol}://${req.get("host")}`;
};

const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      next(); 
      return;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayloadType;
    req.userId = decoded.userId;
    next();
  } catch {
    next(); 
  }
};

const loginCheck = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayloadType;
    req.userId = decoded.userId;
    next();

  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

const generateUrl = async (req: Request, res: Response) => {
  try {
    const base = getBaseUrl(req);
    const { url } = req.body;

    if (!url) {
      res.status(400).json({ message: "URL is required" });
      return;
    }

    const urlId = nanoid();
    const shortUrl = `${base}/${urlId}`;

    await prisma.url.create({
      data: {
        originalUrl: url,
        shortCode: urlId,
        userId: req.userId ?? null, // logged in = userId, guest = null
      },
    });

    res.status(201).json({ shortUrl });

  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

const redirectUrl = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;

    if (typeof code !== 'string') {
      res.status(400).json({ message: "Invalid code" });
      return;
    }

    const found = await prisma.url.findUnique({
      where: { shortCode: code },
    });

    if (!found) {
      res.status(404).json({ message: "URL not found" });
      return;
    }

    res.redirect(found.originalUrl);

  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserLinks = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const links = await prisma.url.findMany({
      where: { userId: req.userId },
    });

    res.status(200).json({ links });

  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteUrl = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;

    if (typeof code !== 'string') {
      res.status(400).json({ message: "Invalid code" });
      return;
    }

    const found = await prisma.url.findUnique({
      where: { shortCode: code },
    });

    if (!found) {
      res.status(404).json({ message: "URL not found" });
      return;
    }

    if (found.userId !== req.userId) {
      res.status(403).json({ message: "Not authorized to delete this URL" });
      return;
    }

    await prisma.url.delete({
      where: { shortCode: code },
    });

    res.status(200).json({ message: "Deleted successfully" });

  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

export { optionalAuth, loginCheck, generateUrl, redirectUrl, getUserLinks, deleteUrl };
