import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { fetchParent, updateParent } from '../controllers/parent.controllers.js';

const router = express.Router();


router.get('/getparent/:id',verifyToken,fetchParent);
router.post('/updateparent/:id',verifyToken, updateParent);


export default router;