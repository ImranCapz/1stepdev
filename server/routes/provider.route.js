import express from 'express';
import { createProvider,deleteProvider,updateProvider, getProvider, getProviders,getAdminProviders } from '../controllers/provider.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();


router.post('/create',verifyToken,createProvider);
router.delete('/delete/:id',verifyToken,deleteProvider);
router.post('/update/:id',verifyToken,updateProvider);
router.get('/get/:id',getProvider);
router.get('/get', getProviders);
router.get('/getproviders',getAdminProviders);

export default router;