import express from 'express';
import Users from '../models/users.model.js';
import bcrypt from 'bcrypt';

const router = express.Router();

//add User
router.post('/register', (req, res) => {
  Users.findOne({ username: req.body.username }).then((data) => {
    if (!data) {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.password, salt, function (err, hash) {
          let newUser = new Users({
            ...req.body,
            password: hash,
            roles: ['user'],
            email: '',
            firstName: '',
            lastName: '',
            fb: '',
            phone: '',
            cartItems: [],
          });
          newUser
            .save()
            .then((data) =>
              res.send({ message: 'User Registered Successfully' })
            );
        });
      });
    } else {
      res.send({ error: 'Username already taken' });
    }
  });
});

router.post('/login', (req, res) => {
  Users.findOne({ username: req.body.username }).then((data) => {
    if (data) {
      bcrypt.compare(req.body.password, data.password, function (err, result) {
        if (result) {
          res.send({ data, message: 'Successfully Logged In' });
        } else {
          res.send({ error: 'Invalid Credentials' });
        }
      });
    } else {
      res.send({ error: 'User does not exist' });
    }
  });
});

router.get('/', (req, res) => {
  Users.find().then((data) => res.send(data));
});

router.get('/:id', (req, res) => {
  Users.findOne({ _id: req.params.id }).then((data) => res.send(data));
});

router.delete('/:id', (req, res) => {
  Users.findByIdAndDelete(req.params.id).then((data) =>
    res.send({ message: 'User deleted' })
  );
});

// suspend user
router.put('/:id/suspend', (req, res) => {
  Users.findByIdAndUpdate(req.params.id, {
    $push: { roles: req.body.role },
  }).then((data) => res.send({ data, message: 'User suspended' }));
});

// remove suspension
router.put('/:id/lift', (req, res) => {
  Users.findByIdAndUpdate(req.params.id, {
    $pull: { roles: req.body.role },
  }).then((data) => res.send({ data, message: 'User suspension lifted' }));
});

// CART ITEMS

// addToCart
router.put('/:user_id/addToCart', (req, res) => {
  Users.findByIdAndUpdate(req.params.user_id, {
    $addToSet: { cartItems: req.body },
  }).then((data) => res.send({ message: 'Item Added To Cart' }));
});

// increaseCount
router.put('/:user_id/increaseCount', (req, res) => {
  Users.updateOne(
    { _id: req.params.user_id, 'cartItems._id': req.body._id },
    {
      $inc: { 'cartItems.$.count': req.body.count },
    }
  ).then((data) => res.send({ message: 'Cart Item Count Increased' }));
});

// delete cart Item
router.put('/:user_id/deleteCartItem', (req, res) => {
  Users.findByIdAndUpdate(req.params.user_id, {
    $pull: { cartItems: { _id: req.body._id } },
  }).then((data) => res.send({ message: 'cart Item deleted' }));
});

// empty cart
router.put('/:user_id/emptyCart', (req, res) => {
  Users.findByIdAndUpdate(req.params.user_id, {
    $set: { cartItems: [] },
  }).then((data) => res.send({ message: 'cart Item deleted' }));
});

//edit Profile
router.put('/:user_id/editProfile', (req, res) => {
  Users.findByIdAndUpdate(req.params.user_id, req.body).then((data) =>
    res.send('User Profile Updated')
  );
});

// Orders
// Add order
router.put('/:user_id/addOrder', (req, res) => {
  Users.findByIdAndUpdate(req.params.user_id, {
    $push: { orders: req.body },
  }).then((data) => res.send('Order complete'));
});

// Edit Order
// needs {_id: String, status: String}
router.put('/:user_id/editOrder', (req, res) => {
  Users.updateOne(
    { _id: req.params.user_id, 'orders._id': req.body._id },
    {
      $set: { 'orders.$.status': req.body.status },
    }
  ).then((data) => res.send('Order Status Updated'));
});

// cancel order
router.put('/:user_id/cancelOrder', (req, res) => {
  Users.findByIdAndUpdate(req.params.user_id, {
    $pull: { orders: { _id: req.body._id } },
  }).then((data) => res.send({ message: 'cart Item deleted' }));
});

// change lastAddress
router.put('/:user_id/changeLastAddress', (req, res) => {
  Users.findByIdAndUpdate(req.params.user_id, {
    $set: { lastAddress: req.body.lastAddress },
  }).then((data) => res.send('Changed Last Address'));
});

export default router;
