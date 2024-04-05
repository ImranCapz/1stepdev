import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { fetchParent } from '../controllers/parent.controllers.js';

const router = express.Router();


router.get('/getparent/:id',verifyToken,fetchParent);


export default router;