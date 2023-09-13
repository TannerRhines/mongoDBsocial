

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







// update thought





// delete thought






// create reaction






// delete reaction

