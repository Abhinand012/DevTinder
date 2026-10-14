const express = require("express");
const { adminAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
const requestRouter = express.Router();

//request api to send connection with another user
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

    const request = new ConnectionRequestModel({
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

requestRouter.post(
  "/review/:status/:requestId",
  adminAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid Status");
      }
      const connectionRequest = await ConnectionRequestModel.findOne({
        fromUserId: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        throw new Error("connection request not found!");
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({ message: "connection request " + status, data });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  },
);

module.exports = requestRouter;
