const passportJwt = require("passport-jwt");
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const jwtSecretOrKey = require("./secrets/jwt_key").secretOrKey;

const mongoose = require("mongoose");
const Speaker = require("../models/speaker");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecretOrKey
}

module.exports = (passport) => {
  passport.use(new JwtStrategy(options, (payload, done) => {
    Speaker.findById(payload.id, (err, speaker) => {
      if(err) {
        return done(err, false);
      } else {
        if(speaker) {
          return done(null, speaker);
        } else {
          return done(null, false);
        }
      }
    });
  }));
}
