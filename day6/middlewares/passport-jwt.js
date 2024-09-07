// npm install passport passport-jwt

const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const usecases = require('../domain/usecases/user_usecase'); // Adjust the path to your user repository

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET, // Use your secret key from environment variables or config
    expiresIn: '30m' // Set token expiration to 30 minutes
  };
  
  passport.use(new Strategy(options, async (jwt, done) => {
    try {
      const user = await usecases.getOneByUserId(jwt.userId); // Adjust to match your method of finding a user by ID
      if (user) {
        return done(null, user);
      }
      return done(null, false, { message: 'Token has expired' });
    } catch (error) {
      return done(error, false, { message: 'Failed to authenticate token' });
    }
  }));
  
  const initializePassport = () => {
    return passport.initialize();
  };
  
  const authenticatePassportJwt = () => {
    return passport.authenticate('jwt', { session: false });
  };
  
  module.exports = {
    initializePassport,
    authenticatePassportJwt
  };