const User = require('../../database/models/user');

const updateUser = async (req, res) => {
  try {
    const { email, updates } = req.body;

    // Validate that email and updates are provided
    if (!email || !updates) {
      return res.status(400).json({
        ok: false,
        message: 'Email and updates are required to update a user',
      });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        ok: false,
        message: `No user found with email: ${email}`,
      });
    }

    // Update the user
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: updates },
      { new: true } // Return the updated document
    );

    // Return success response
    return res.status(200).json({
      ok: true,
      message: `User with email (${email}) has been updated successfully`,
      user: updatedUser, // Optional: include updated user data
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: `Server error, ${error.message}`,
    });
  }
};

module.exports = updateUser;
