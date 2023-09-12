const { User, Thought } = require('../models');





// get all the users in DB



getUser = (req, res) => {
    User.find()
      .select("-__v") // Excludes the __v field
      .then((allUsers) => {
        if (!allUsers.length) {
          return res.status(404).json({ message: "No users found." });
        }
        res.json(allUsers);
      })
      .catch((err) => {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: "An error occurred while fetching users.", error: err.message });
      });
  };



  getSingleUser = (req, res) => {
    const userId = req.params.userId;
  
    User.findOne({ _id: userId })
      .select('-__v')
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user found with that ID!' });
        }
  
        return res.json(user);
      })
      .catch((err) => {
        console.error(err); // Log the error for debugging
        return res.status(500).json({ message: 'An error occurred while fetching the user.', error: err.message });
      });
  };