const express = require("express");
const { userRegister, loginUser, findUser, getUsers } = require("../Controllers/userController");

const router = express.Router();

router.post("/register", userRegister);
router.post("/login", loginUser);
router.get("/find/:userId", findUser);
router.get("/", getUsers);

module.exports = router