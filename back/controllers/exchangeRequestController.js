const ExchangeRequest = require("../models/ExchangeRequest");


// Get All Requests
exports.getAllRequests = async (req,res)=>{

try{


const requests =
await ExchangeRequest.find()

.populate(
'sender',
'name'
)

.populate(
'receiver',
'name'
)

.populate(
'offeredSkill',
'title'
)

.populate(
'requestedSkill',
'title'
);



res.json(requests);



}catch(error){


res.status(500)
.json({
message:error.message
});


}



};


// Get Request By Id
exports.getRequestById = async (req, res) => {

  try {

    const request = await ExchangeRequest.findById(req.params.id);

    if (!request)
      return res.status(404).json({ message: "Request not found" });

    res.json(request);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


// Create Request
exports.createRequest = async (req, res) => {

  try {

    const request = await ExchangeRequest.create(req.body);

    res.status(201).json(request);

  } catch (error) {

    res.status(400).json({ message: error.message });

  }

};


// Update Request
exports.updateRequest = async (req, res) => {

  try {

    const request = await ExchangeRequest.findByIdAndUpdate(

      req.params.id,

      req.body,

      { new: true }

    );

    if (!request)
      return res.status(404).json({ message: "Request not found" });

    res.json(request);

  } catch (error) {

    res.status(400).json({ message: error.message });

  }

};


// Delete Request
exports.deleteRequest = async (req, res) => {

  try {

    const request = await ExchangeRequest.findByIdAndDelete(req.params.id);

    if (!request)
      return res.status(404).json({ message: "Request not found" });

    res.json({ message: "Request deleted successfully" });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};