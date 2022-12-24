import PostModel from '../models/Post.js'

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(','),
      user: req.userId
    });

    const post = await doc.save();

    res.json(post);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: 'Failed to create a post',
    })
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();

    res.json(posts);
  } catch (e) {
    console.log(e);
    req.status(500).json({
      message: 'Сouldn\'t get the posts'
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 }
      },
      {
        returnDocument: 'after'
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          res.status(500).json({
            message: 'failed to return the post'
          });
        }
        if (!doc) {
         return res.status(404).json({
           message: 'Post not found'
         });
        }
        res.json(doc);
      },
    ).populate('user');

  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "failed to get a post"
    })
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete(
      {
        _id: postId
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'couldn\'t delete the article'
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'The post not find'
          });
        }

        res.json({
          success: true
        });
      }
    );

  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "failed to get a post"
    })
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    await PostModel.updateOne(
      {
        _id: postId
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUtl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags.split(','),
      }
    );

    res.json({
      success: true,
    })
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: 'Failed to update the article'
    })
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts.map(obj => obj.tags).flat().slice(0,5);

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'failed to get tags'
    })
  }
}