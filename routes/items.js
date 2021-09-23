import express from 'express';
import Items from '../models/items.model.js';

const router = express.Router();

// create an item
router.post('/addItem', (req, res) => {
  Items.findOne({ name: req.body.name }).then((data) => {
    if (!data) {
      let newItem = new Items(req.body);
      newItem.save().then((data) => {
        res.send({ message: 'Item added Successfully' });
      });
    } else {
      res.send({ error: 'Item is already in the shop' });
    }
  });
});

// Get all Items
router.get('/', (req, res) => {
  Items.find().then((data) => {
    res.send(data);
  });
});

// Get one item
router.get('/:id', (req, res) => {
  Items.findOne({ _id: req.params.id }).then((data) => {
    res.send(data);
  });
});

// update an item
router.put('/editItem', (req, res) => {
  Items.findByIdAndUpdate(req.body._id, req.body).then((data) => {
    res.send({ message: 'Item has been updated' });
  });
});

// delete an item
router.delete('/deleteItem/:id', (req, res) => {
  Items.findByIdAndDelete(req.params.id).then((data) => {
    res.send({ message: 'Item has been deleted' });
  });
});

export default router;
