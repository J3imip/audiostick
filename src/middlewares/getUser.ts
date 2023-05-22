import { User } from "../entities/User";
import { CustomSession } from "../interfaces/Session";
import { logger } from "../winston";

export const getUser = () => async(ctx: CustomSession, next: Function) => {
  try {
    let user: User = await User.findOneBy({
      id: ctx.from.id
    });

    if(!user) {
      try {
        user = await User.create({
          id: ctx.from.id,
          username: ctx.from.username
        }).save();
      } catch (error) {
        logger.error(error);
      }
    }

    ctx.session.user = user;
    return next();
  } catch (error) {
    return next();
  }
}
