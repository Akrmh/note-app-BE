const bcrypt = require('bcrypt');
const User = require('../../database/models/user');

const updateUser = async (req, res) => {
  try {
    const { id } = req.params; // Assuming user ID is passed as a route parameter
    const { firstName, lastName, email, age, password } = req.body;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'User not found'
      });
    }

    // Validate email uniqueness if email is being updated
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          ok: false,
          message: `Email ${email} is already in use`
        });
      }
    }

    // Update fields if provided
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (age) user.age = age;

    // Hash the new password if provided
    if (password) {
      user.password = bcrypt.hashSync(password, parseInt(process.env.SALT_NUMBER));
    }

    // Save the updated user
    await user.save();

    // Return success response
    return res.status(200).json({
      ok: true,
      message: `User (${user.firstName}) updated successfully`,
      user // Optionally return the updated user
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: `Server error, ${error.message}`
    });
  }
};

module.exports = updateUser;
