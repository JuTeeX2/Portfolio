const express = require('express');
const router = express.Router();
const site_postController = require('../controllers/site_postController');

router.post('/posts/init', site_postController.createTable);

router.get('/posts', site_postController.getAll);

router.post('/posts/single', site_postController.createSinglePost);
router.post('/posts/gallery', site_postController.createGalleryPost);
router.post('/posts', site_postController.createPost);

router.get('/posts/type/:type', site_postController.getPostsByType);
router.put('/posts/:id', site_postController.updatePost);
router.delete('/posts/:id', site_postController.deletePost);

module.exports = router;