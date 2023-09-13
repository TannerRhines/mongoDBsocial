const { User, Thought } = require('../models');

module.exports = {

  // Get all thoughts in DB
  getThought(req, res) {
    Thought.find({})
      .then(thought => res.json(thought))
      .catch(err => res.status(500).json(err));
  },

  // Get a single thought by its ID
  async getSingleThought(req, res) {
    try {
      const thoughtId = req.params.thoughtId;
      const thought = await Thought.findOne({ _id: thoughtId }).select('-__v');

      if (!thought) {
        res.status(404).json({ message: 'No thought found with this ID!' });
        return;
      }

      res.json(thought);

    } catch (error) {
      console.error("Error getting single thought:", error);
      res.status(500).json(error);
    }
  },

  // Create a new thought
  createThought(req, res) {
    Thought.create(req.body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((thought) => {
        if (!thought) {
            return res.status(404).json({ message: "No User found with this ID!" });
        }
        return res.json(thought);
    })
    .catch((err) => {
        return res.status(500).json(err);
    });
  },
  

  // Update an existing thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
    .then(thought => {
      if (!thought) {
        res.status(404).json({ message: 'No thought found with this ID!' });
      } else {
        res.json(thought);
      }
    })
    .catch(err => res.status(500).json(err));
  },

  // Delete a thought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought find with this ID!" })
          : User.findOneAndUpdate(
              { thoughts: req.params.thoughtId },
              { $pull: { thoughts: req.params.thoughtId } },
              { new: true }
            )
      )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'Thought deleted, but no user found'})
          : res.json({ message: 'Thought successfully deleted' })
      )
      .catch((err) => res.status(500).json(err));
  },  

  // Create a reaction
  createReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
    .then(thought => {
      if (!thought) {
        res.status(404).json({ message: 'No thought found with this ID!' });
      } else {
        res.json(thought);
      }
    })
    .catch(err => res.status(500).json(err));
  },

  // Delete a reaction
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
    .then(thought => {
      if (!thought) {
        res.status(404).json({ message: 'No thought found with this ID!' });
      } else {
        res.json(thought);
      }
    })
    .catch(err => res.status(500).json(err));
  }
};
