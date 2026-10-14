const express = require("express");
const { adminAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName age gender skills photoUrl";

userRouter.get("/user/requests/received", adminAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (error) {
    res.status(400).send("ERROR " + error.message);
  }
});

userRouter.get("/user/connections", adminAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      status: "accepted",
    }).populate("fromUserId toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.equals(loggedInUser._id)) {
        return row.toUserId;
      }

      return row.fromUserId;
    });

    res.json({
      data,
    });

    // const connectionRequestsReceived = await ConnectionRequestModel.find({
    //   toUserId: loggedInUser._id,
    //   status: "accepted",
    // }).populate("fromUserId", USER_SAFE_DATA);

    // const connectionRequestsSend = await ConnectionRequestModel.find({
    //   fromUserId: loggedInUser._id,
    //   status: "accepted",
    // }).populate("toUserId", USER_SAFE_DATA);

    // const dataReceived = connectionRequestsReceived.map(
    //   (row) => row["fromUserId"],
    // );

    // const dataSend = connectionRequestsSend.map((row) => row["toUserId"]);

    // res.json({
    //   message: "Data fetched successfully",
    //   data: {
    //     send: dataSend,
    //     received: dataReceived,
    //   },
    // });
  } catch (error) {
    res.status(400).send("ERROR " + error.message);
  }
});

module.exports = userRouter;
