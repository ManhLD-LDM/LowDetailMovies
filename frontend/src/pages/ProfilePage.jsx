import { useEffect, useState } from 'react';
import { FiEdit2, FiEye, FiEyeOff, FiLock, FiSave, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { userApi } from '../services/api';
import useAuthStore from '../stores/authStore';

function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateProfile, isLoading, isAuthenticated } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [formData, setFormData] = useState({
    avatar: user?.avatar || '',
    bio: user?.bio || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setFormData({
        avatar: user.avatar,
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile(formData);
    if (result.success) {
      toast.success('Cập nhật profile thành công!');
      setIsEditing(false);
    } else {
      toast.error(result.message);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu mới không khớp!');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    try {
      await userApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Đổi mật khẩu thành công!');
      setShowChangePassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đổi mật khẩu thất bại');
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Profile Card */}
      <div className="bg-dark-200 rounded-2xl p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <img
              src={formData.avatar || 'https://via.placeholder.com/150'}
              alt={user.username}
              className="w-32 h-32 rounded-full object-cover border-4 border-primary-500"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150';
              }}
            />
          </div>

          {/* User Info */}
          <div className="flex-1 w-full text-center md:text-left">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Avatar URL */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-dark-300 border border-dark-400 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-dark-300 border border-dark-400 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    rows={3}
                    maxLength={500}
                    placeholder="Giới thiệu về bạn..."
                  />
                  <p className="text-gray-500 text-xs mt-1">{formData.bio.length}/500</p>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    <FiSave />
                    {isLoading ? 'Đang lưu...' : 'Lưu'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        avatar: user.avatar,
                        bio: user.bio || '',
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-dark-300 text-white rounded-lg hover:bg-dark-400 transition-colors"
                  >
                    <FiX />
                    Hủy
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-white mb-2">{user.username}</h1>
                <p className="text-gray-400 mb-4">{user.email}</p>
                {user.bio && (
                  <p className="text-gray-300 mb-4 whitespace-pre-wrap">{user.bio}</p>
                )}
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <FiEdit2 />
                    Chỉnh sửa Profile
                  </button>
                  <button
                    onClick={() => setShowChangePassword(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-dark-300 text-white rounded-lg hover:bg-dark-400 transition-colors"
                  >
                    <FiLock />
                    Đổi mật khẩu
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-dark-200 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Thông tin tài khoản</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-dark-400 pb-4">
            <div>
              <p className="text-gray-400 text-sm">Username</p>
              <p className="text-white font-medium">{user.username}</p>
            </div>
            <span className="text-gray-500 text-sm">Không thể thay đổi</span>
          </div>
          <div className="flex justify-between items-center border-b border-dark-400 pb-4">
            <div>
              <p className="text-gray-400 text-sm">Email</p>
              <p className="text-white font-medium">{user.email}</p>
            </div>
          </div>
          <div className="flex justify-between items-center pb-4">
            <div>
              <p className="text-gray-400 text-sm">Mật khẩu</p>
              <p className="text-white font-medium">••••••••</p>
            </div>
            <button
              onClick={() => setShowChangePassword(true)}
              className="text-primary-500 hover:text-primary-400 text-sm"
            >
              Thay đổi
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-200 rounded-2xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Đổi mật khẩu</h2>
              <button
                onClick={() => setShowChangePassword(false)}
                className="text-gray-400 hover:text-white"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Mật khẩu hiện tại
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 pr-12 bg-dark-300 border border-dark-400 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPasswords.current ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 pr-12 bg-dark-300 border border-dark-400 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPasswords.new ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Xác nhận mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 pr-12 bg-dark-300 border border-dark-400 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPasswords.confirm ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  Đổi mật khẩu
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowChangePassword(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="px-6 py-3 bg-dark-300 text-white rounded-lg hover:bg-dark-400 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
