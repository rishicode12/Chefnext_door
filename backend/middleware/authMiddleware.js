const jwt = require("jsonwebtoken");
const Provider = require("../providers/provider.model");
const User = require("../models/user.model");
const config = require("../config/config");

// Protect routes for providers only
exports.protectProvider = async (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith("Bearer")) {
    try {
      token = token.split(" ")[1];
      const decoded = jwt.verify(token, config.jwtSecret);
      
      // Check if the token belongs to a provider
      if (decoded.role !== 'provider') {
        return res.status(403).json({ message: "Not authorized as a provider" });
      }
      
      req.provider = await Provider.findById(decoded.id).select("-password");
      
      if (!req.provider) {
        return res.status(404).json({ message: "Provider not found" });
      }
      
      next();
    } catch (err) {
      res.status(401).json({ message: "Token failed or expired" });
    }
  } else {
    res.status(401).json({ message: "No token provided" });
  }
};

// Protect routes for users only
exports.protectUser = async (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith("Bearer")) {
    try {
      token = token.split(" ")[1];
      const decoded = jwt.verify(token, config.jwtSecret);
      
      // Check if the token belongs to a user
      if (decoded.role !== 'user') {
        return res.status(403).json({ message: "Not authorized as a user" });
      }
      
      req.user = await User.findById(decoded.id).select("-password");
      
      if (!req.user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      next();
    } catch (err) {
      res.status(401).json({ message: "Token failed or expired" });
    }
  } else {
    res.status(401).json({ message: "No token provided" });
  }
};

// Protect routes for both users and providers
exports.protectAny = async (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith("Bearer")) {
    try {
      token = token.split(" ")[1];
      const decoded = jwt.verify(token, config.jwtSecret);
      
      if (decoded.role === 'user') {
        req.user = await User.findById(decoded.id).select("-password");
        if (!req.user) {
          return res.status(404).json({ message: "User not found" });
        }
        req.role = 'user';
      } else if (decoded.role === 'provider') {
        req.provider = await Provider.findById(decoded.id).select("-password");
        if (!req.provider) {
          return res.status(404).json({ message: "Provider not found" });
        }
        req.role = 'provider';
      } else {
        return res.status(403).json({ message: "Invalid role" });
      }
      
      next();
    } catch (err) {
      res.status(401).json({ message: "Token failed or expired" });
    }
  } else {
    res.status(401).json({ message: "No token provided" });
  }
};