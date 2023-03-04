const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'zohaibisagoodb$oy';

// create a user using Post "/api/auth/createuser". no login required
router.post(
  "/createuser",
  [
    body("name", "enter valid name").isLength({ min: 3 }),
    body("email", "enter valid email").isEmail(),
    body("password", "enter valid password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    //if there is error, return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // check weather the user with this email exists already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          error:
            "sorry a user with this email is already exist. Please try another email!",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const secPassword = await bcrypt.hash(req.body.password, salt);
      // create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPassword,
      });
     const data = {
      user:{
        id: user.id
      }
     }
     const authToken = jwt.sign(data, JWT_SECRET);
     res.json({authToken});
     // res.json(user);

    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured");
    }
    console.log(req.body);
  }
);

module.exports = router;
