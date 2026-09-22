import { Router } from 'express';
import {
  uploadPhoto,
  getAllPhotosUnprotected,
  getAllUploadedPhotos,
  saveAPhoto,
  getAllSavedPhoto,
  getPhotosByCategory,
  getAllCategories,
  deleteAPhoto
} from '../controllers/photoController.js';
import authMiddleware from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = Router();

router.post('/upload-photo', authMiddleware, upload.single('image'), uploadPhoto);
router.get('/getAllPhotosUnprotected', getAllPhotosUnprotected);
router.get('/getAllUploadedPhotos', authMiddleware, getAllUploadedPhotos);
router.post('/saveAPhoto', authMiddleware, saveAPhoto);
router.get('/getAllSavedPhoto', authMiddleware, getAllSavedPhoto);
router.get('/getPhotosByCategory', getPhotosByCategory);
router.get('/getPhotosByCategory/:category', getPhotosByCategory);
router.get('/getAllCategories', getAllCategories);
router.delete('/deleteAPhoto', authMiddleware, deleteAPhoto);
router.delete('/deleteAPhoto/:photoId', authMiddleware, deleteAPhoto);

export default router;
