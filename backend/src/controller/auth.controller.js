import { upsertStreamUser } from "../lib/stream.js";
import user from "../models/User.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export async function signup (req, res) {
    const { fullName, email, password } = req.body

    try {
        if(!fullName || !email || !password) {
            return res.status(400).json({message : 'All are required Fields'})
        }

        if(password < 6) {
            return res.status(400).json({message : "Password must be atleast 6 or above"})
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({email})
        if(existingUser) {
            return res.status(400).json({message : "User already exist, please use a different email"})
        }

        const idx = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://api.dicebear.com/7.x/micah/png?seed=${idx}`

        const newUser = await User.create({
            fullName,
            email,
            password,
            profilePic: randomAvatar,
        })

        try {
            await upsertStreamUser ({
            id:newUser._id.toString(),
            name:newUser.fullName,
            image:newUser.profilePic || "",
        })
        console.log(`Stream user created for ${newUser.fullName}`);
        } catch (error) {
            console.log("Error createing stream user:" , error);
        }
        
        const token = jwt.sign({userId:newUser._id},process.env.JWT_SECRET_KEY,{
                expiresIn:"5d"
            })

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60* 1000,
            httpOnly : true, //prevent XSS attacks,
            sameSite: "strict", //prevent CSRF attacks,
            secure: process.env.NODE_ENV === "production",
        })

        res.status(201).json({success:true,user:newUser})

    } catch (error) {
        console.log("Error in signUp", error);
        res.status(500).json({ message : "Internal server error"})
    }
}

export async function login (req, res) {
    try {
        const {email, password} = req.body;

        if( !email || !password) {
            return res.status(400).json({message : 'All are required Fields'})
        }

        const user = await User.findOne({email})
        if(!user) return res.status(401).json({message : "Invalid email or password"})

        const isPasswordCorrect = await user.matchPassword(password)
        if(!isPasswordCorrect) return res.status(401).json({message : "Invalid email or passsword"})

        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{
                expiresIn:"5d"
            })

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60* 1000,
            httpOnly : true, //prevent XSS attacks,
            sameSite: "strict", //prevent CSRF attacks,
            secure: process.env.NODE_ENV === "production",
        })
        res.status(201).json({success:true,user})
        
    } catch (error) {
        console.log("Error in login", error.message);
        res.status(500).json({message:"Internal server error"})
    }
}

export async function logout (req, res) {
    res.clearCookie("jwt")
    res.status(200).json({success: true, message :"Logout Successful"})
}

export async function onboard (req, res) {
    try {
        const userId = req.user._id;

        const {fullName, bio, nativeLanguage, learningLanguage, location} = req.body

        if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location){
            return res.status(400).json({
                message : 'All fields are required',
                missingFields: [
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location"
                ].filter(Boolean)
            });
        }

        const UpdatedUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded: true,
        }, {new:true})
        
        if (!UpdatedUser)  res.status(404).json({message : "User not found"})

            try {
                await upsertStreamUser({
                    id:UpdatedUser._id.toString(),
                    name:UpdatedUser.fullName,
                    image:UpdatedUser.profilePic || ""
                })
                console.log(`stream user updated for after onboard ${UpdatedUser.fullName}`);
                
            } catch (streamError) {
                console.error("stream user error update on onboarding :", streamError.message);
                
            }

            res.status(200).json({ success: true, user: UpdatedUser})
    } catch (error) {
        console.error(" Onboarding error ", error);
        res.status(500).json({ message : "Internal server error"})
    }
}