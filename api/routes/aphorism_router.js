const express = require("express");
const passport = require("passport");

const Speaker = require("../models/speaker");
const Aphorism = require("../models/aphorism");
const {retErrorMessages, calcLimitAndSkip} = require("./routes_helper");

const aphorismRouter = express.Router();

const generateTags = (content) => {
  let hashtagRegex = /#[A-z]*/g;
  let tagsArr = content.match(hashtagRegex);
  tagsArr = tagsArr ? tagsArr : [];
  return tagsArr;
}

aphorismRouter.post("/new",
  passport.authenticate("jwt", {session: false}),
  async (req, res) => {
    if(req.body.content.length < 150) {
      newAphorism = new Aphorism({
        content: req.body.content,
        voters: [],
        tags: generateTags(req.body.content),
        speaker_id: req.user.id,
        speaker_name: req.user.name
      });
      let savedAphorism = await newAphorism.save();
      res.json(savedAphorism);
    } else {
      retErrorMessages(res, ["Content of aphorism is not valid."]);
    }
});

aphorismRouter.post("/tag/:tag_name",
  async (req, res) => {
    let {limitVal, skipVal} = calcLimitAndSkip(req.body.limit, req.body.skip);

    let aphorisms = await Aphorism.find(
      {tags: "#" + req.params.tag_name},
      null,
      {limit: limitVal, skip: skipVal, sort: {date: -1}}
    );

    res.json(aphorisms);
});

aphorismRouter.get("/id/:aphorism_id", async (req, res) => {
  let aphorism = await Aphorism.findById(req.params.aphorism_id);
  res.json(aphorism);
});

aphorismRouter.delete("/id/:aphorism_id",
  passport.authenticate("jwt", {session: false}),
  async (req, res) => {
    let aphorism = await Aphorism.findById(req.params.aphorism_id);

    if(!aphorism) {
      retErrorMessages(res, ["Aphorism not found."]);
    }

    if(String(aphorism.speaker_id) === req.user.id) {
      let deleteAphorism = await Aphorism.findByIdAndRemove(req.params.aphorism_id);
      res.json(aphorism);
    } else {
      retErrorMessages(res, ["Not authorized."]);
    }
});

aphorismRouter.post("/id/:aphorism_id/vote",
  passport.authenticate("jwt", {session: false}),
  async (req, res) => {
    let aphorism = await Aphorism.findById(req.params.aphorism_id);
    let voter = req.user;
    if(!aphorism.voters.includes(voter.id)) {
      aphorism.voters.push(voter.id);
      aphorism.votes = aphorism.voters.length;
    }
    let savedAphorism = await aphorism.save();
    res.json(savedAphorism);
});

aphorismRouter.post("/id/:aphorism_id/unvote",
  passport.authenticate("jwt", {session: false}),
  async (req, res) => {
    let aphorism = await Aphorism.findById(req.params.aphorism_id);
    let unvoter = req.user;
    if(aphorism.voters.includes(unvoter.id)) {
      aphorism.voters = aphorism.voters.filter(ele => ele != unvoter.id);
      aphorism.votes = aphorism.voters.length;
    }
    let savedAphorism = await aphorism.save();
    res.json(savedAphorism);
});

module.exports = aphorismRouter;
