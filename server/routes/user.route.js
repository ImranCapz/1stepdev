import  express  from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { test, updateUser, getUserProvider } from "../controllers/user.controller.js";


const router = express.Router();


router.get('/',test);
router.post("/update/:id", verifyToken, updateUser);
router.get('/providers/:id',verifyToken, getUserProvider);

export default router;