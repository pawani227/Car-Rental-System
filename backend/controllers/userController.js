const bcrypt = require("bcryptjs");
const User = require("../models/User");

const registerUser = async (req, res) => {
  try {
    const {
      username,
      name,
      email,
      password,
      role = "customer",
      nicNumber = null,
      address = null,
      phoneNumber = null,
      profileImage = null,
      isVerified = false,
      createdAt,
    } = req.body;

    const finalUsername = username || name;

    if (!finalUsername || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      username: finalUsername,
      name: finalUsername,
      email,
      password: hashedPassword,
      role,
      nicNumber,
      address,
      phoneNumber,
      profileImage,
      isVerified: !!isVerified,
    };

    if (createdAt) userData.createdAt = new Date(createdAt);

    const user = await User.create(userData);

    return res.status(201).json({
      message: "Account created successfully",
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please enter email and password" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select(
      "name email phoneNumber address username profileImage nicNumber role",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
      username: user.username,
      profileImage: user.profileImage,
      nicNumber: user.nicNumber,
      role: user.role,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, name, phoneNumber, address, nicNumber, profileImage } =
      req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (typeof username === "string" && username.trim()) {
      user.username = username.trim();
      user.name = username.trim();
    }

    if (typeof name === "string" && name.trim()) {
      user.name = name.trim();
    }

    if (typeof phoneNumber === "string") {
      user.phoneNumber = phoneNumber.trim() || null;
    }

    if (typeof address === "string") {
      user.address = address.trim() || null;
    }

    if (typeof nicNumber === "string") {
      user.nicNumber = nicNumber.trim() || null;
    }

    if (typeof profileImage === "string") {
      // Reject extremely large data URLs to avoid storing huge blobs in DB
      const maxChars = 2_000_000; // ~2MB of characters (base64 will be larger than binary)
      if (profileImage.length > maxChars) {
        return res
          .status(413)
          .json({ message: "Profile image too large (max ~2MB)." });
      }

      user.profileImage = profileImage || null;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        address: user.address,
        nicNumber: user.nicNumber,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  updateUserProfile,
};
