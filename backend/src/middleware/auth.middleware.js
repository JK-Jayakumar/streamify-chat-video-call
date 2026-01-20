import User from "../models/User.js";
import jwt from "jsonwebtoken"


export const protectRoute = async (req, res, next) => {
try {
    const token = req.cookies.jwt
    //Don't have a token 
    if (!token){
        return res.status(401).json({message : "Unauthorized - no token provided"})
    }
    // If they jhave token then verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    //If token was invalid 
    if(!decoded) {
        return res.status(401).json({message : "Unauthorized - Invalid token"})
    }

    //No user in the Database
    const user = await User.findById(decoded.userId).select ("-password");

    if(!user){
        return res.status(401).json({message : "Unauthorized - user not found"})
    }
    
    req.user = user

    next()

} catch (error) {
    console.log("Error in protectRoute middleware", error)
    res.status(500).json({message : " Internal server error"})
}
}