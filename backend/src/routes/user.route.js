import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { 
    acceptFriendRequest,
     getFriendRequests,
     getMyFriends,
      getOutgoingFriendReqs,
      getRecommendedUsers,
       sendFriendRequest } from '../controller/user.controller.js';

const router = express.Router();

router.use(protectRoute); //apply auth middleware to all the user routes

router.get("/friends", getMyFriends);
router.get("/", getRecommendedUsers);

router.post("/friend-request/:id", sendFriendRequest)
router.put("/friend-request/:id/accept", acceptFriendRequest)

router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendReqs)


export default router;