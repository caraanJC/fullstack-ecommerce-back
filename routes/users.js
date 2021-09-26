import express from 'express';
import verify from './verifyToken.js';
import Users from '../models/users.model.js';

const router = express.Router();

router.get('/', verify, (req, res) => {
  Users.findById(req.user).then((data) => {
    if (data.roles.includes('admin'))
      Users.find().then((data) => res.send(data));
  });
});

router.get('/:id', verify, (req, res) => {
  Users.findById(req.user).then((data) => {
    if (data.roles.includes('admin'))
      Users.findOne({ _id: req.params.id }).then((data) => res.send(data));
  });
});

router.get('/currentUser', verify, (req, res) => {
  Users.findOne({ _id: req.user }).then((data) => res.send(data));
});

router.delete('/:id', verify, (req, res) => {
  Users.findById(req.user).then((data) => {
    if (data.roles.includes('admin'))
      Users.findByIdAndDelete(req.params.id).then((data) =>
        res.send({ message: 'User deleted' })
      );
  });
});

// suspend user
router.put('/:id/suspend', verify, (req, res) => {
  Users.findById(req.user).then((data) => {
    if (data.roles.includes('admin'))
      Users.findByIdAndUpdate(req.params.id, {
        $push: { roles: req.body.role },
      }).then((data) => res.send({ data, message: 'User suspended' }));
  });
});

// remove suspension
router.put('/:id/lift', verify, (req, res) => {
  Users.findById(req.user).then((data) => {
    if (data.roles.includes('admin'))
      Users.findByIdAndUpdate(req.params.id, {
        $pull: { roles: req.body.role },
      }).then((data) => res.send({ data, message: 'User suspension lifted' }));
  });
});

// CART ITEMS

// addToCart
router.put('/cart/addToCart', verify, (req, res) => {
  Users.findByIdAndUpdate(req.user, {
    $addToSet: { cartItems: req.body },
  }).then((data) => res.send({ message: 'Item Added To Cart' }));
});

// increaseCount
router.put('/cart/increaseCount', verify, (req, res) => {
  Users.updateOne(
    { _id: req.user, 'cartItems._id': req.body._id },
    {
      $inc: { 'cartItems.$.count': req.body.count },
    }
  ).then((data) => res.send({ message: 'Cart Item Count Increased' }));
});

// delete cart Item
router.put('/cart/deleteCartItem', verify, (req, res) => {
  Users.findByIdAndUpdate(req.user, {
    $pull: { cartItems: { _id: req.body._id } },
  }).then((data) => res.send({ message: 'cart Item deleted' }));
});

// empty cart
router.put('/cart/emptyCart', verify, (req, res) => {
  Users.findByIdAndUpdate(req.user, {
    $set: { cartItems: [] },
  }).then((data) => res.send({ message: 'cart Item deleted' }));
});

// Orders
// Add order
router.put('/order/addOrder', verify, (req, res) => {
  Users.findByIdAndUpdate(req.user, {
    $push: { orders: req.body },
  }).then((data) => res.send('Order complete'));
});

// Edit Order
// needs {_id: String, status: String}
router.put('/order/editOrder', verify, (req, res) => {
  Users.findById(req.user).then((data) => {
    if (data.roles.includes('admin')) {
      Users.updateOne(
        { _id: req.body.userID, 'orders._id': req.body._id },
        {
          $set: { 'orders.$.status': req.body.status },
        }
      ).then((data) => res.send('Order Status Updated'));
    }
  });
});

// cancel order
router.put('/order/cancelOrder', verify, (req, res) => {
  Users.findByIdAndUpdate(req.user, {
    $pull: { orders: { _id: req.body._id } },
  }).then((data) => res.send({ message: 'cart Item deleted' }));
});

//edit Profile
router.put('/profile/editProfile', verify, (req, res) => {
  Users.findByIdAndUpdate(req.user, req.body).then((data) =>
    res.send('User Profile Updated')
  );
});

// change lastAddress
router.put('/profile/changeLastAddress', verify, (req, res) => {
  Users.findByIdAndUpdate(req.user, {
    $set: { lastAddress: req.body.lastAddress },
  }).then((data) => res.send('Changed Last Address'));
});

export default router;
