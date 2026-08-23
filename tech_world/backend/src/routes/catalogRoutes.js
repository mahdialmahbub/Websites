const express = require("express");
const router = express.Router();

const { listCategories } = require("../controllers/catalogController");

// Public — the storefront's search/filter dropdown needs this without being logged in as anything.
// (Admin management of categories still lives at /api/admin/categories.)
router.get("/", listCategories);

module.exports = router;
