const User = require("../Models/UserModel")

const isOwner = async (req, res, next) => {
  const owner = await User.findById(req.params.id);
  if (!owner){
      return res.send("Data not found");
  }

  if (owner.createdBy.toString() !== req.user._id.toString()) {
    return res.send("ohh Noo! sorry are u not owner");
  }

  next();
};

module.exports = isOwner;
