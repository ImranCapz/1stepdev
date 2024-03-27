import  express  from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { test, updateUser, getUserProvider, getUser, getUsers } from "../controllers/user.controller.js";


const router = express.Router();


router.get('/',test);
router.post("/update/:id", verifyToken, updateUser);
router.get('/providers/:id',verifyToken, getUserProvider);
router.get('/:id',verifyToken, getUser)
router.get('/getusers', verifyToken, getUsers)

export default router;