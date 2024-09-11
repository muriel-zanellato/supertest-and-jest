const express = require('express');
const router = express.Router();
const auth = require('../middleware/authorization');
const { check, validationResult } = require('express-validator');
const Product = require('../models/Product');

router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is Required').not().isEmpty(),
      check('description', 'Description is Required').not().isEmpty(),
      check('category', 'Category is Required').not().isEmpty(),
      check('price', 'Price is Required').not().isEmpty(),
      check('quantity', 'Quantity is Required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { name, description, category, price, brand, quantity } = req.body;
      const newProduct = new Product({
        userId: req.user.id,
        name,
        description,
        category,
        price,
        brand,
        quantity,
      });
      const product = await newProduct.save();
      res.json({ product });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);

//get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(400).json({ msg: 'Product was not found' });
    }
    res.json(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.get('/merchants/:id', auth, async (req, res) => {
  try {
    const products = await Product.find({ userId: req.params.id });
    res.json(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

router.patch('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.body);
    console.log(id);
    const product = await Product.findOneAndUpdate(
      { _id: id },
      { $set: { ...req.body } },
      {
        new: true,
      }
    );
    res.json(product);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(
      { _id: id },
      { strict: true }
    );
    res.status(200).json({ msg: 'product succesfully deleted' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
