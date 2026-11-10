const Skill = require("../models/Skill");

const createSkill = async (req, res) => {
  try {
    const skill = await Skill.create(req.body);

    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().populate("owner");

    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    res.status(200).json({ message: "Skill deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSkillById = async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);

        if (!skill) {
            return res.status(404).json({
                message: "Skill not found"
            });
        }

        res.status(200).json(skill);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateSkill = async (req, res) => {
    try {
        const skill = await Skill.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!skill) {
            return res.status(404).json({
                message: "Skill not found"
            });
        }

        res.status(200).json(skill);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
module.exports = {
  createSkill,
  getSkills,
  deleteSkill,
  getSkillById,
  updateSkill,
};