const PostModel = require('../models/postModels');

exports.createTable = async (req, res) => {
  try {
    await PostModel.createTable();
    res.status(200).json({ message: "Posts table created successfully" });
  } catch (error) {
    console.error('Error creating table:', error);
    res.status(500).json({ 
      error: error.message,
      detail: error.detail
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    const posts = await PostModel.getAll();

    const processedPosts = posts.map(post => {
      if (post.post_type === 'gallery' && post.picture) {
        try {
          post.picture = JSON.parse(post.picture);
        } catch (e) {
          console.warn(`Invalid JSON in picture field for post ${post.id}`);
          post.picture = [];
        }
      }
      return post;
    });
    
    res.status(200).json(processedPosts);
  } catch (error) {
    console.error('Error getting posts:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.createSinglePost = async (req, res) => {
  try {
    const { number, picture, title, content } = req.body;
    
    if (!picture || !title) {
      return res.status(400).json({ 
        error: "Picture and title are required for single posts" 
      });
    }
    
    const post = await PostModel.createSinglePost({
      number,
      picture,
      title,
      content
    });
    
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating single post:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.createGalleryPost = async (req, res) => {
  try {
    const { number, pictures, title } = req.body;
    
    if (!pictures || !Array.isArray(pictures) || pictures.length === 0) {
      return res.status(400).json({ 
        error: "Pictures array is required for gallery posts" 
      });
    }
    
    if (!title) {
      return res.status(400).json({ 
        error: "Title is required for gallery posts" 
      });
    }
    
    const post = await PostModel.createGalleryPost({
      number,
      pictures,
      title
    });
    
    post.picture = pictures;
    
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating gallery post:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { number, picture, pictures, title, content } = req.body;

    if (pictures && Array.isArray(pictures)) {
      return exports.createGalleryPost(req, res);
    } else {
      return exports.createSinglePost(req, res);
    }
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { number, picture, pictures, title, content, post_type } = req.body;
    
    let pictureValue = picture;
    let finalPostType = post_type;
    
    if (!finalPostType) {
      finalPostType = pictures ? 'gallery' : 'single';
    }
    
    if (finalPostType === 'gallery' && pictures) {
      pictureValue = pictures;
    }
    
    const post = await PostModel.update(id, {
      number,
      picture: pictureValue,
      title,
      content,
      post_type: finalPostType
    });
    
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    
    if (post.post_type === 'gallery' && post.picture) {
      try {
        post.picture = JSON.parse(post.picture);
      } catch (e) {
        post.picture = [];
      }
    }
    
    res.status(200).json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await PostModel.delete(id);
    
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    
    res.status(200).json({ 
      message: "Post deleted successfully",
      deletedPost: post
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getPostsByType = async (req, res) => {
  try {
    const { type } = req.params;
    
    if (!['single', 'gallery'].includes(type)) {
      return res.status(400).json({ 
        error: "Invalid post type. Use 'single' or 'gallery'" 
      });
    }
    
    const posts = await PostModel.getByType(type);
    
    const processedPosts = posts.map(post => {
      if (post.post_type === 'gallery' && post.picture) {
        try {
          post.picture = JSON.parse(post.picture);
        } catch (e) {
          post.picture = [];
        }
      }
      return post;
    });
    
    res.status(200).json(processedPosts);
  } catch (error) {
    console.error('Error getting posts by type:', error);
    res.status(500).json({ error: error.message });
  }
};