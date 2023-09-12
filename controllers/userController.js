const { User, Thought } = require('../models');





// get all the users from DB

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
        console.error(err); // Log error for debugging
        res.status(500).json({ message: "An error occurred while fetching users.", error: err.message });
      });
  };




  


//   getting a single user from DB

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
        console.error(err); // Log error for debugging
        return res.status(500).json({ message: 'An error occurred while fetching the user.', error: err.message });
      });
  };




//   create a new user 

  createUser = (req, res) => {
    // Extract request body
    const newUserData = req.body;
    
    // Attempt to create a new user
    User.create(newUserData)
        .then((createdUser) => {
            // Send back the created user as JSON
            res.json(createdUser);
        })
        .catch((error) => {
            console.error("Error creating user:", error);
            res.status(500).json(error);
        });
}






// update a user 

updateUser = (req, res) => {
    // Extract user ID and update data from the request
    const userId = req.params.userId;
    const updateData = req.body;
    
    // Configuration options for the update
    const options = {
        runValidators: true,
        new: true
    };
    
    // Attempt to find and update the user
    User.findOneAndUpdate({ _id: userId }, { $set: updateData }, options)
        .then((updatedUser) => {
            if (!updatedUser) {
                // If user not found, send 404 status
                res.status(404).json({ message: 'No User found with this ID!' });
            } else {
                // If user found and updated, send back updated version
                res.json(updatedUser);
            }
        })
        .catch((error) => {
            console.error("Error updating user:", error);
            res.status(500).json(error);
        });
}









// delete a user 


deleteUser = (req, res) => {
    try {
        const userId = req.params.userId;

        // Attempt to find and delete the user
        const userToDelete = await User.findOneAndDelete({ _id: userId });

        if (!userToDelete) {
            // If user not found, send 404 status
            res.status(404).json({ message: 'No User found with this ID!' });
            return;
        }

        // If user found, delete associated thoughts
        await Thought.deleteMany({ _id: { $in: userToDelete.thoughts } });

        // Send confirmation 
        res.json({ message: 'User and Thoughts deleted!' });
        
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json(error);
    }
}

