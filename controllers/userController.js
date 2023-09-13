const { User, Thought } = require('../models');

module.exports = {



// get all users
  getUser(req, res) {
    User.find({})
      .select("-__v") 
      .then((allUsers) => {
        if (!allUsers.length) {
          return res.status(404).json({ message: "No users found." });
        }
        res.json(allUsers);
      })
      .catch((err) => {
        console.error(err); 
        res.status(500).json({ message: "An error occurred while fetching users.", error: err.message });
      });
  },


// get a single user
  getSingleUser(req, res) {
    const userId = req.params.userId;

    User.findOne({ _id: userId })
      .populate('thoughts')
      .populate('friends')
      .select('-__v')
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'No user found with that ID!' });
        }
        return res.json(user);
      })
      .catch((err) => {
        console.error(err); 
        return res.status(500).json({ message: 'An error occurred while fetching the user.', error: err.message });
      });
  },




  // Create a new user
  createUser: (req, res) => {
    const newUserData = req.body;

    User.create(newUserData)
      .then((createdUser) => {
        res.json(createdUser);
      })
      .catch((error) => {
        console.error("Error creating user:", error);
        res.status(500).json(error);
      });
  },


// update an existing user
  updateUser(req, res) {
    const userId = req.params.userId;
    const updateData = req.body;

    const options = {
        runValidators: true,
        new: true
    };

    User.findOneAndUpdate({ _id: userId }, { $set: updateData }, options)
        .then((updatedUser) => {
            if (!updatedUser) {
                res.status(404).json({ message: 'No User found with this ID!' });
            } else {
                res.json(updatedUser);
            }
        })
        .catch((error) => {
            console.error("Error updating user:", error);
            res.status(500).json(error);
        });
  },

// delete a user
  async deleteUser(req, res) {
    try {
        const userId = req.params.userId;

        const userToDelete = await User.findOneAndDelete({ _id: userId });

        if (!userToDelete) {
            res.status(404).json({ message: 'No User found with this ID!' });
            return;
        }

        await Thought.deleteMany({ _id: { $in: userToDelete.thoughts } });

        res.json({ message: 'User and Thoughts deleted!' });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json(error);
    }
  },

//   add a friend

  addFriend(req, res) {
    User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
    )
    .then((friend) => {
      if (!friend) {
        res.status(404).json({ message: 'No User found with this ID!'});
      } else {
        res.json(friend);
      }
    })
    .catch((err) => res.status(500).json(err));
  },


// delete a friend 
  deleteFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId }},
      { new: true }
    )
    .then((friend) => {
      if (!friend) {
        res.status(404).json({ message: 'No User found with this ID!'});
      } else {
        res.json(friend);
      }
    })
    .catch((err) => res.status(500).json(err));
  }
};
