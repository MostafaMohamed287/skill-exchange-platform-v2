const ExchangeRequest = require("../models/ExchangeRequest");
const Skill = require("../models/Skill");

const populateRequest = (query) =>
  query
    .populate("sender", "name")
    .populate("receiver", "name")
    .populate("offeredSkill", "title")
    .populate("requestedSkill", "title");

const isInvolved = (request, user) =>
  user.role === "Admin" ||
  request.sender.toString() === user.id ||
  request.receiver.toString() === user.id;

const handleError = (res, error) => {
  const status =
    error.name === "ValidationError" || error.name === "CastError" ? 400 : 500;
  res.status(status).json({ message: error.message });
};

// Get All Requests (الطلبات اللي تخص المستخدم بس، والأدمن يشوف الكل)
exports.getAllRequests = async (req, res) => {
  try {
    const filter =
      req.user.role === "Admin"
        ? {}
        : { $or: [{ sender: req.user.id }, { receiver: req.user.id }] };

    const requests = await populateRequest(
      ExchangeRequest.find(filter).sort({ createdAt: -1 })
    );

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Request By Id
exports.getRequestById = async (req, res) => {
  try {
    const request = await populateRequest(
      ExchangeRequest.findById(req.params.id)
    );

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const senderId = request.sender?._id?.toString();
    const receiverId = request.receiver?._id?.toString();

    if (
      req.user.role !== "Admin" &&
      senderId !== req.user.id &&
      receiverId !== req.user.id
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(request);
  } catch (error) {
    handleError(res, error);
  }
};

// Create Request (الـ sender هو المستخدم المسجل)
exports.createRequest = async (req, res) => {
  try {
    const { receiver, offeredSkill, requestedSkill, message } = req.body;
    const sender = req.user.id;

    if (!receiver || !offeredSkill || !requestedSkill) {
      return res.status(400).json({
        message: "Receiver, offered skill and requested skill are required",
      });
    }

    if (receiver === sender) {
      return res
        .status(400)
        .json({ message: "You can't send a request to yourself" });
    }

    const [offered, requested] = await Promise.all([
      Skill.findById(offeredSkill),
      Skill.findById(requestedSkill),
    ]);

    if (!offered || !requested) {
      return res.status(404).json({ message: "Skill not found" });
    }

    if (offered.owner.toString() !== sender) {
      return res
        .status(403)
        .json({ message: "You can only offer your own skills" });
    }

    if (requested.owner.toString() !== receiver) {
      return res.status(400).json({
        message: "The requested skill doesn't belong to the receiver",
      });
    }

    const request = await ExchangeRequest.create({
      sender,
      receiver,
      offeredSkill,
      requestedSkill,
      message,
    });

    res.status(201).json(request);
  } catch (error) {
    handleError(res, error);
  }
};

// Update Request (المستقبِل بس هو اللي يقبل أو يرفض)
exports.updateRequest = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Accepted", "Rejected"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Status must be Accepted or Rejected" });
    }

    const request = await ExchangeRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.receiver.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only the receiver can accept or reject a request" });
    }

    if (request.status !== "Pending") {
      return res
        .status(400)
        .json({ message: `This request was already ${request.status}` });
    }

    request.status = status;
    await request.save();

    res.json(request);
  } catch (error) {
    handleError(res, error);
  }
};

// Delete Request (المرسِل أو المستقبِل أو الأدمن)
exports.deleteRequest = async (req, res) => {
  try {
    const request = await ExchangeRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (!isInvolved(request, req.user)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await request.deleteOne();

    res.json({ message: "Request deleted successfully" });
  } catch (error) {
    handleError(res, error);
  }
};
