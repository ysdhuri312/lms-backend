import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

export const userRepository = new UserRepository();
export const userService = new UserService(userRepository);
export const userController = new UserController(userService);
