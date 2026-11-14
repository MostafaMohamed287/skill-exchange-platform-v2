const Skill = require("../models/Skill");

const OWNER_FIELDS = "name profileImage bio location";

const isOwnerOrAdmin = (skill, user) =>
  user.role === "Admin" || skill.owner.toString() === user.id;

const handleError = (res, error) => {
  const status = error.name === "ValidationError" ? 400 : 500;
  res.status(status).json({ message: error.message });
};

const createSkill = async (req, res) => {
  try {
    const { title, description, category, level } = req.body;

    // الـ owner بييجي من التوكن مش من الـ body
    const skill = await Skill.create({
      title,
      description,
      category,
      level,
      owner: req.user.id,
    });

    res.status(201).json(skill);
  } catch (error) {
    handleError(res, error);
  }
};

const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find()
      .sort({ createdAt: -1 })
      .populate({ path: "owner", select: OWNER_FIELDS });

    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id).populate({
      path: "owner",
      select: OWNER_FIELDS,
    });

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    res.status(200).json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    if (!isOwnerOrAdmin(skill, req.user)) {
      return res
        .status(403)
        .json({ message: "You can only edit your own skills" });
    }

    // الـ owner مينفعش يتغير
    const { title, description, category, level } = req.body;

    if (title !== undefined) skill.title = title;
    if (description !== undefined) skill.description = description;
    if (category !== undefined) skill.category = category;
    if (level !== undefined) skill.level = level;

    await skill.save();

    res.status(200).json(skill);
  } catch (error) {
    handleError(res, error);
  }
};

const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    if (!isOwnerOrAdmin(skill, req.user)) {
      return res
        .status(403)
        .json({ message: "You can only delete your own skills" });
    }

    await skill.deleteOne();

    res.status(200).json({ message: "Skill deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSkill,
  getSkills,
  deleteSkill,
  getSkillById,
  updateSkill,
};
