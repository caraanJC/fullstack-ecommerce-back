import express from 'express';
import Items from '../models/items.model.js';
import Users from '../models/users.model.js';
import verify from './verifyToken.js';

const router = express.Router();

// Get all Items
router.get('/', (req, res) => {
  Items.find().then((data) => {
    res.send(data);
  });
});

// create an item
router.post('/addItem', verify, (req, res) => {
  Users.findById(req.user._id).then((data) => {
    if (
      ['admin', 'employee', 'manager'].some((role) => data.roles.includes(role))
    ) {
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
    }
  });
});

// Get one item
router.get('/:id', (req, res) => {
  Items.findOne({ _id: req.params.id }).then((data) => {
    res.send(data);
  });
});

// update an item
router.put('/editItem', verify, (req, res) => {
  Users.findById(req.user._id).then((data) => {
    if (
      ['admin', 'employee', 'manager'].some((role) => data.roles.includes(role))
    ) {
      Items.findByIdAndUpdate(req.body._id, req.body).then((data) => {
        res.send({ message: 'Item has been updated' });
      });
    }
  });
});

// delete an item
router.delete('/deleteItem/:id', verify, (req, res) => {
  Users.findById(req.user._id).then((data) => {
    if (
      ['admin', 'employee', 'manager'].some((role) => data.roles.includes(role))
    ) {
      Items.findByIdAndDelete(req.params.id).then((data) => {
        res.send({ message: 'Item has been deleted' });
      });
    }
  });
});

export default router;
