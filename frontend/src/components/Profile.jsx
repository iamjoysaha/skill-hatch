import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

export default function Profile() {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  const [formData, setFormData] = useState({
    userid: "",
    email: "",
    first_name: "",
    last_name: "",
    college_name: "",
    roll_no: "",
  });

  const [initialFormData, setInitialFormData] = useState(null);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [userMeta, setUserMeta] = useState({
    joined: "",
    level: "Beginner",
    total_badges: 0,
    badges: [],
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const user_id = localStorage.getItem("userId");
      if (!user_id) return;

      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/user-data`, {
          params: { user_id },
        });

        if (data.success) {
          const user = data.user;
          console.log("User data fetched successfully:", user);

          const initial = {
            userid: user.username || "",
            email: user.email || "",
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            college_name: user.college_name || "",
            roll_no: user.roll_no || "",
          };

          setFormData(initial);
          setInitialFormData(initial);
          setImagePreview(user.profile_image || "https://instaily.com/_next/static/media/test.b3910688.jpg");

          setUserMeta({
            joined: new Date(user.createdAt).toLocaleDateString(),
            level: user?.badge_count > 10 ? "Intermediate" : user?.badge_count > 20 ? "Advanced" : "Beginner",
            total_badges: user.badge_count || 0,
            badges: user.badges || [],
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load profile data.");
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const toggleVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async () => {
    const user_id = localStorage.getItem("userId");
    if (!user_id) return;

    const { currentPassword, newPassword, confirmNewPassword } = passwordData;

    if (newPassword && newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    try {
      const payload = {
        user_id,
        email: formData.email,
        username: formData.userid,
        first_name: formData.first_name,
        last_name: formData.last_name,
        roll_no: formData.roll_no,
        currentPassword,
        password: newPassword || undefined,
      };

      const { data } = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/user/update`, payload);

      if (!data.success) {
        toast.error(data.message || "Update failed");
        return;
      }

      if (selectedImageFile) {
        const imgForm = new FormData();
        imgForm.append("image", selectedImageFile);
        imgForm.append("user_id", user_id);

        const imgRes = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/user/update-image`,
          imgForm,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (imgRes.data.success) {
          setImagePreview(imgRes.data.imageUrl);
          toast.success(imgRes.data.message);
        } else {
          toast.error(imgRes.data.message || "Image upload failed");
        }
      }

      setEditMode(false);
      setInitialFormData(formData);
      setPasswordData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
      setSelectedImageFile(null);
      toast.success(data.message);
    } catch (error) {
      console.error("Failed to update profile:", error);
      const message = error.response?.data?.message || "Something went wrong while updating the profile.";
      toast.error(message);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmDelete) return;

    const user_id = localStorage.getItem("userId");

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/delete`, { user_id });

      if (data.success) {
        localStorage.removeItem("userId");
        toast.success(data.message || "Account deleted successfully.");
        navigate("/");
      } else {
        toast.error(data.message || "Failed to delete account.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("An error occurred while deleting the account.");
    }
  };

  const cancelEdit = () => {
    setFormData(initialFormData);
    setPasswordData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    setSelectedImageFile(null);
    setEditMode(false);
  };

  const goBack = () => {
    navigate("/user/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex justify-center mb-8">
          {imagePreview && (
            <img 
              src={imagePreview} 
              alt="Avatar" 
              className="w-28 h-28 rounded-full object-cover shadow-md transition-transform hover:scale-105 border-2 border-gray-200" 
            />
          )}
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            {formData.first_name} {formData.last_name}
          </h2>
          <p className="text-sm text-gray-600 mt-1">@{formData.userid}</p>
          <p className="text-sm text-gray-600">{formData.email}</p>
          <p className="text-sm text-gray-600">{formData.college_name}</p>
          <p className="text-sm text-gray-600">Roll No: {formData.roll_no}</p>
        </div>

        <div className="space-y-8">
          <div className="p-6 bg-white rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Profile Details</h3>

            {editMode ? (
              <div className="space-y-4">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:text-gray-800 file:bg-yellow-400 hover:file:bg-yellow-500 transition-colors file:cursor-pointer" 
                />
                <input
                  name="first_name" 
                  value={formData.first_name} 
                  onChange={handleChange} 
                  placeholder="First Name" 
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors" 
                />
                <input 
                  name="last_name" 
                  value={formData.last_name} 
                  onChange={handleChange} 
                  placeholder="Last Name" 
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors" 
                />
                <input 
                  name="userid" 
                  value={formData.userid} 
                  onChange={handleChange} 
                  placeholder="Username" 
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors" 
                />
                <input 
                  name="roll_no" 
                  value={formData.roll_no} 
                  onChange={handleChange} 
                  placeholder="Roll No" 
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors" 
                />
                <input 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="Email" 
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors" 
                />

                <hr className="my-6 border-gray-300" />
                <h4 className="text-lg font-semibold text-gray-800">Change Password</h4>

                {["currentPassword", "newPassword", "confirmNewPassword"].map((field) => (
                  <div className="relative" key={field}>
                    <input
                      type={showPassword[field === "currentPassword" ? "current" : field === "newPassword" ? "new" : "confirm"] ? "text" : "password"}
                      name={field}
                      value={passwordData[field]}
                      onChange={handlePasswordChange}
                      placeholder={field === "currentPassword" ? "Current Password" : field === "newPassword" ? "New Password" : "Confirm New Password"}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => toggleVisibility(field === "currentPassword" ? "current" : field === "newPassword" ? "new" : "confirm")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-800 transition-colors"
                    >
                      <i className={`fas ${showPassword[field === "currentPassword" ? "current" : field === "newPassword" ? "new" : "confirm"] ? "fa-eye-slash" : "fa-eye"}`}></i>
                    </button>
                  </div>
                ))}

                <div className="flex gap-4 mt-6">
                  <button 
                    onClick={handleSubmit} 
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-2 rounded-md transition-colors shadow-md"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit} 
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-md transition-colors shadow-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-700 mb-2">Joined: {userMeta.joined}</p>
                <p className="text-sm text-gray-700 mb-2">Your Level: {userMeta.level}</p>
                <p className="text-sm text-gray-700 mb-4">Total Badges: {userMeta.total_badges}</p>
                <button 
                  onClick={() => setEditMode(true)} 
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-2 rounded-md transition-colors shadow-md"
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>

          <div className="p-6 bg-white rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Achievements</h3>
            <div className="flex flex-wrap gap-2">
              {userMeta?.badges && userMeta.badges?.length > 0 ? (
                userMeta.badges.map((badge, idx) => (
                  <span 
                    key={idx} 
                    className="bg-yellow-400 text-gray-800 px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer"
                  >
                    {badge}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">No badges earned yet</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <button 
            onClick={goBack} 
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-md transition-colors shadow-md"
          >
            Back to Home
          </button>
          <button 
            onClick={handleDeleteAccount} 
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-md transition-colors shadow-md"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}