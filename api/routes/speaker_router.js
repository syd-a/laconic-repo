const bcryptjs = require("bcryptjs");
const SALT_WORK_FACTOR = 10;

const jwt = require("jsonwebtoken");
const secretOrKey = require("../config/secrets/jwt_key").secretOrKey;
const TIMESPAN_MINUTES = 100;

const passport = require("passport");

const Speaker = require("../models/speaker");
const Aphorism = require("../models/aphorism");
const {retErrorMessages, calcLimitAndSkip} = require("./routes_helper");

const express = require("express");
const speakerRouter = express.Router();

speakerRouter.post("/index", async (req, res) => {
  let {limitVal, skipVal} = calcLimitAndSkip(req.body.limit, req.body.skip);

  let speakers = await Speaker.find(
    {},
    "name following followers",
    {limit: limitVal, skip: skipVal, sort: {name: 1}}
  );

  res.json(speakers);
});

speakerRouter.post("/new", async (req, res) => {
  let speaker = await Speaker.findOne({name: req.body.name}, "name");

  if(speaker) {
    retErrorMessages(res, ["This username is in use."]);
  } else {
    let salt = await bcryptjs.genSalt(SALT_WORK_FACTOR);
    let hashedPassword = await bcryptjs.hash(req.body.password, salt);
    newSpeaker = new Speaker({
      name: req.body.name,
      password: hashedPassword,
      following: [],
      followers: []
    });

    let savedSpeaker = await newSpeaker.save();
    return res.json(savedSpeaker);
  }
});

speakerRouter.post("/login", async (req, res) => {
  let speaker = await Speaker.findOne({name: req.body.name}, "name password");

  if(!speaker) {
    retErrorMessages(res, ["Username does not exit."]);
  } else {
    samePassword = await bcryptjs.compare(req.body.password, speaker.password)

    if(samePassword) {
      const expDate = new Date(Date.now() + 60000 * TIMESPAN_MINUTES);
      const data = {id: speaker.id, name: speaker.name, expDate: expDate};
      token = await jwt.sign(data, secretOrKey, {expiresIn: (480 * TIMESPAN_MINUTES)});
      return res.json({data: data, token: "Bearer " + token});
    } else {
      retErrorMessages(res, ["Password is not correct."]);
    }
  }
});

speakerRouter.post("/follow",
  passport.authenticate("jwt", {session: false}),
  async (req, res) => {
    let toFollow = await Speaker.findOne({name: req.body.name}, "name followers");
    if(!toFollow) {
      retErrorMessages(res, ["Username does not exit."]);
    } else {
        let requester = req.user;

        if(!toFollow.followers.includes(requester.id)) {
          toFollow.followers.push(requester.id);
        }
        if(!requester.following.includes(toFollow.id)) {
          requester.following.push(toFollow.id);
        }
        savedToFollow = await toFollow.save();
        savedRequester = await requester.save();
        return res.json({savedRequester});
    }
});

speakerRouter.post("/unfollow",
  passport.authenticate("jwt", {session: false}),
  async (req, res) => {
    let toUnfollow = await Speaker.findOne({name: req.body.name}, "name followers");
    if(!toUnfollow) {
      retErrorMessages(res, ["Username does not exit."]);
    } else {
      let requester = req.user;

      if(toUnfollow.followers.includes(requester.id)) {
        toUnfollow.followers = toUnfollow.followers.filter(ele => ele != requester.id);
      }
      if(requester.following.includes(toUnfollow.id)) {
        requester.following = requester.following.filter(ele => ele != toUnfollow.id);
      }
      savedToUnfollow = await toUnfollow.save();
      savedRequester = await requester.save();
      return res.json({savedRequester});
    }
});

speakerRouter.post("/name/:speaker_name", async (req, res) => {
  let {limitVal, skipVal} = calcLimitAndSkip(req.body.limit, req.body.skip);

  let aphorisms = await Aphorism.find(
    {speaker_name: req.params.speaker_name},
    null,
    {limit: limitVal, skip: skipVal, sort: {date: -1}},
  );

  res.json(aphorisms);
});

speakerRouter.get("/name/:speaker_name/following", async (req, res) => {
  let speaker = await Speaker
  .findOne({name: req.params.speaker_name})
  .populate("following");

  res.json(speaker.following);
});

speakerRouter.get("/name/:speaker_name/followers", async (req, res) => {
  let speaker = await Speaker
  .findOne({name: req.params.speaker_name})
  .populate("followers");

  res.json(speaker.followers);
});

speakerRouter.post("/feed",
  passport.authenticate("jwt", {session: false}),
  async (req, res) => {
    let {limitVal, skipVal} = calcLimitAndSkip(req.body.limit, req.body.skip);

    let speaker = await Speaker.findById(req.user.id);
    let feedAphorisms = await Aphorism.find(
      {speaker_id: {$in: speaker.following}},
      null,
      {limit: limitVal, skip: skipVal, sort: {date: -1}},
    );

    return res.json(feedAphorisms);
});

speakerRouter.post("/self",
  passport.authenticate("jwt", {session: false}),
  async (req, res) => {
    let {limitVal, skipVal} = calcLimitAndSkip(req.body.limit, req.body.skip);

    let speaker = await Speaker.findById(req.user.id);
    let selfAphorisms = await Aphorism.find(
      {speaker_id: speaker.id},
      null,
      {limit: limitVal, skip: skipVal, sort: {date: -1}},
    );

    return res.json(selfAphorisms);
});

speakerRouter.get("/self/following",
  passport.authenticate("jwt", {session: false}),
  async (req, res) => {
    let speaker = await Speaker
    .findById(req.user.id)
    .populate("following");

    return res.json(speaker.following);
});

speakerRouter.get("/self/info",
  passport.authenticate("jwt", {session: false}),
  async (req, res) => {
    let speaker = await Speaker
    .findById(req.user.id)

    return res.json(speaker);
});

module.exports = speakerRouter;
