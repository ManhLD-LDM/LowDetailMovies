import bcrypt from 'bcryptjs';
import User from '../models/User.js';

// @desc    Lấy thông tin profile user
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy user' });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi server',
      error: error.message,
    });
  }
};

// @desc    Cập nhật profile user
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy user' });
    }

    // Cập nhật các trường được cho phép
    user.username = req.body.username || user.username;
    user.avatar = req.body.avatar || user.avatar;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;

    // Kiểm tra username đã tồn tại chưa (nếu thay đổi)
    if (req.body.username && req.body.username !== user.username) {
      const usernameExists = await User.findOne({
        username: req.body.username,
        _id: { $ne: user._id },
      });

      if (usernameExists) {
        return res.status(400).json({
          message: 'Username đã được sử dụng',
        });
      }
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi server',
      error: error.message,
    });
  }
};

// @desc    Đổi mật khẩu user
// @route   PUT /api/users/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: 'Vui lòng cung cấp đầy đủ thông tin',
      });
    }

    // Check password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự',
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy user' });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: 'Mật khẩu hiện tại không đúng',
      });
    }

    // Check if new password is same as current
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        message: 'Mật khẩu mới không được trùng với mật khẩu hiện tại',
      });
    }

    // Hash new password and save
    user.password = newPassword;
    await user.save();

    res.json({
      message: 'Đổi mật khẩu thành công',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi server',
      error: error.message,
    });
  }
};
