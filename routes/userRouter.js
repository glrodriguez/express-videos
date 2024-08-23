import { Router } from "express";
import { getUsers, getUser, getHome, register, login, logout, updateUser, deleteUser } from "../controllers/userController.js";
import authMiddleware from "../auth/authMiddleware.js";


const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:id', getUser);
userRouter.get('/index/home', /*authMiddleware,*/ getHome);

userRouter.post('/', register);
userRouter.post('/login', login);
userRouter.post('/logout', logout);

userRouter.patch('/:id', updateUser);

userRouter.delete('/:id', deleteUser);

export default userRouter;
