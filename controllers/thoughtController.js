

const { User, Thought } = require('../models');
const { json } = require("express/lib/response");







// get all thoughts in DB

getThought = (req,res) => {
    Thought.find({})
    .then((thought) => res.json(thought))
    .catch((err) => res.status(500).json(err));
}



getSingleThought = (req, res) => {
    try {
        const thoughtId = req.params.thoughtId;
        
        // find thought by its ID
        const thought = await Thought.findOne({ _id: thoughtId }).select('-__v');

        if (!thought) {
            // if thought not found, return 404 
            res.status(404).json({ message: 'No thought found with this ID!' });
            return;
        }

        // if successful, return thought
        res.json(thought);
        
    } catch (error) {
        // send 500 status code
        console.error("Error getting single thought:", error);
        res.status(500).json(error);
    }
}



// create thought


createThought = (req, res) => {

    // create  new Thought 
    Thought.create(req.body)
      .then(({ _id }) => {
        // Once the Thought is created, update the User with the new Thought's ID
        return User.findOneAndUpdate(
          { _id: req.params.userId },  // Find user by ID
          { $push: { thoughts: _id } },  // push the new Thought ID into the user's thoughts array
          { new: true }  // Return the updated User object
        );
      })
      .then((thought) => {
        // check if the user was found and updated
        if (!thought) {
          res.status(404).json({ message: 'No User found with this ID!' });
        } else {
          res.json(thought);
        }
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  };

  
  






// update thought





// delete thought






// create reaction






// delete reaction

