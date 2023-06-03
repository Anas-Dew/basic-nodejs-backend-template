const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
// ROUTE : 1 -> CREATE A NEW USER IN DB.
router.post('/signup', [
  // validate if values exists in the body.
  body('name', 'Name must be present.').isLength({ min: 1 }),
  body('email', 'Email is invalid!').isEmail(),
  body('password', 'Password must be atleast 5 characters long!').isLength({ min: 5 }),
  body('age', 'age must be present').isLength({ min: 1 }),

], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      statusCode: 200,
      data: {},
      error: {//if any exists
        message: errors.array()
      }
    });
  }
  let user = await User.findOne({ email: req.body.email })

  if (user) {
    return res.status(400).json({
      statusCode: 400,
      data: {
      },
      error: {//if any exists
        message: "Email already exists."
      }
    })
  }

  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(req.body.password, salt)


  user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: hashPass,
    age: req.body.age,
  })
    .then(user => {
      const data = {
        user: {
          id: user.id
        }
      }
      const authToken = jwt.sign(data, 's39d3EwetUdRl7ech$C7');

      return res.status(200).json({
        statusCode: 200,
        data: {
          authToken: authToken
        },
        error: {//if any exists
          message: "null"
        }
      })
    })

    .catch(error => {
      console.log(error.message);
      res.status(400).json({
        statusCode: 500,
        data: {

        },
        error: {//if any exists
          message: "Internal Server Error."
        }
      })
    });
})

// ROUTE : 2 -> USER LOGIN 
router.post('/login', [
  // get these values from request body
  body('email', 'Email is invalid!').isLength({ min: 1 }),
  body('password', 'Password cannot be blank!').isLength({ min: 1 }),

], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      statusCode: 400,
      data: {},
      error: {//if any exists
        message: errors.array()
      }
    });
  }
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        statusCode: 400,
        data: {},
        error: {//if any exists
          message: "Email or password is incorrect!"
        }
      })
    }
    let passwordCompare = await bcrypt.compare(password, user.password)

    if (!passwordCompare) {
      return res.status(400).json({
        statusCode: 400,
        data: {},
        error: {//if any exists
          message: "Email or password is incorrect!"
        }
      })

    }
    const data = {
      user: {
        id: user.id
      }
    }

    const authToken = jwt.sign(data, 's39d3EwetUdRl7ech$C7');
    return res.status(200).json({
      statusCode: 200,
      data: {
        authToken: authToken
      },
      error: {//if any exists
        message: "null"
      }
    })
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      data: {},
      error: {//if any exists
        message: "Internal Server Error."
      }
    })
  }
})

// ROUTE : 3-> UPDATE USER
router.post('/users/:userId', fetchuser, async (req, res) => {
  try {
    if (!req.body.name && !req.body.age) {
      return res.status(400).json({
        statusCode: 400,
        data: {},
        error: {//if any exists
          message: "Name and age are required."
        }
      })
    }

    const name = { "name": req.body.name };
    const age = { "age": req.body.age };
    const filter = { _id: req.user.id };
    const user = await User.updateOne(filter, { $set: { ...name, ...age } });
    return res.status(200).json({
      statusCode: 200,
      data: {
        message: "Update success."
      },
      error: {//if any exists
        message: "null"
      }
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      statusCode: 500,
      data: {},
      error: {//if any exists
        message: "Failed to update."
      }
    });
  }
});

module.exports = router