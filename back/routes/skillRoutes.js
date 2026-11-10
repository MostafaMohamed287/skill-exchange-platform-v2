const express = require("express");
const router = express.Router();

const {
  createSkill,
  getSkills,
  deleteSkill,
  getSkillById,
  updateSkill,
} = require("../controllers/skillController");

router.post("/", createSkill);
router.get("/", getSkills);
router.get("/:id", getSkillById);
router.put("/:id", updateSkill);
router.delete("/:id", deleteSkill);

module.exports = router;