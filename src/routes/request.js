const express = require("express");
const { adminAuth } = require("../middlewares/auth");
const connectionRequestModel = require("../models/connectionRequest");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
const requestRouter = express.Router();

//sendConnection api to send connection with another user
requestRouter.post("/request/:status/:userId", adminAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.userId;
    const status = req.params.status;
    const allowedStatus = ["interested", "ignored"];

    const requestedUser = await User.findById(toUserId);
    if (!requestedUser) {
      throw new Error("No such user exists");
    }
    // if (fromUserId == toUserId) {
    //   throw new Error("Cannot send connection request to yourself");
    // }

    if (!allowedStatus.includes(status)) {
      throw new Error("Invalid status:" + status);
    }

    const existingConnectionRequest = await ConnectionRequestModel.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnectionRequest) {
      throw new Error("connection request already exists");
    }

    const request = new connectionRequestModel({
      fromUserId,
      toUserId,
      status,
    });

    const data = await request.save();
    res.json({
      message: "request added successfully",
      data,
    });
  } catch (err) {
    res.status(404).send("ERROR: " + err.message);
  }
});

module.exports = requestRouter;
