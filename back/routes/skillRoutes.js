const express = require("express");
const router = express.Router();

const {
  createSkill,
  getSkills,
  deleteSkill,
  getSkillById,
  updateSkill,
} = require("../controllers/skillController");
const { auth } = require("../middleware/authMiddleware");

// القراءة متاحة للكل
router.get("/", getSkills);
router.get("/:id", getSkillById);

// الإضافة والتعديل والمسح لازم تسجيل دخول
router.post("/", auth, createSkill);
router.put("/:id", auth, updateSkill);
router.delete("/:id", auth, deleteSkill);

module.exports = router;
