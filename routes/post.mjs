
import express from 'express';
import { client } from '../monogoDB.mjs';
import { ObjectId } from 'mongodb';
const db = client.db('cruddb');
const col = db.collection('posts');
let router = express.Router();

router.post('/post', async (req, res) => {
  try {
    const post = {
      title: req.body.title,
      text: req.body.text,
      date: req.body.timestamp
    };
    const result = await col.insertOne(post);
    res.send("post created"); // Sending the inserted post object
  } catch (err) {
    console.log('Error inserting post:', err);
    res.status(500).json({ error: 'Server error, please try later.' });
  }
});

router.get('/posts', async (req, res) => {
  try {
    const posts = await col.find({}).toArray();
    res.json(posts);
  } catch (err) {
    console.log('Error getting posts:', err);
    res.status(500).json({ error: 'Server error, please try later.' });
  }
});

router.get('/post/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    
    const post = await col.findOne({ _id: new ObjectId(postId) });
    if (post) {
      res.send(post);
    } else {
      res.status(404).send({ error: 'Post not found.' });
    }
  } catch (err) {
    console.log('Error getting post:', err);
    res.status(500).send({ error: 'Server error, please try later.' });
  }
});

router.put('/post/:postId', async (req, res, next) => {

  if (!ObjectId.isValid(req.params.postId)) {
      res.status(403).send(`Invalid post id`);
      return;
  }

  if (!req.body.text
      && !req.body.title) {
      res.status(403).send(`required parameter missing, atleast one key is required.
      example put body: 
      PUT     /api/v1/post/:postId
      {
          title: "updated title",
          text: "updated text"
      }
      `)
  }

  let dataToBeUpdated = {};

  if (req.body.title) { dataToBeUpdated.title = req.body.title }
  if (req.body.text) { dataToBeUpdated.text = req.body.text }

  try {
      const updateResponse = await col.updateOne(
          {
              _id: new ObjectId(req.params.postId)
          },
    
          {
              $set: dataToBeUpdated
          });
      console.log("updateResponse: ", updateResponse);
 
      res.send('post updated');
  } catch (e) {
      console.log("error inserting mongodb: ", e);
      res.status(500).send('server error, please try later');
  }
})

// DELETE  /api/v1/post/:userId/:postId
router.delete('/post/:postId', async (req, res, next) => {

  if (!ObjectId.isValid(req.params.postId)) {
      res.status(403).send(`Invalid post id`);
      return;
  }

  try {
    const validId = postId

      const deleteResponse = await col.deleteOne({ _id: new ObjectId(validId) });
      console.log("deleteResponse: ", deleteResponse);
      res.send('post deleted');
  } catch (e) {
      console.log("error deleting mongodb: ", e);
      res.status(500).send('server error, please try later');
  }
})

export default router
