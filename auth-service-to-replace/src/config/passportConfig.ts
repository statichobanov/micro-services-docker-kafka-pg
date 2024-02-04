import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import UserRepository from "../repositories/UserRepository";

function initPassport() {
  passport.use(
    new LocalStrategy(
      { usernameField: "username", passwordField: "password" },
      async (username: string, password: string, done: any) => {
        console.log(username, password);
        try {
          const userRepository = new UserRepository();
          const user = await userRepository.findUserByUsername(username);
          if (!user || !(await user.isValidPassword(password))) {
            return done(null, false, {
              message: "Incorrect username or password",
            });
          }
          return done(null, user);
        } catch (error) {
          console.log("initPassport error", error);
          return done(error);
        }
      }
    )
  );
}

export default initPassport;
