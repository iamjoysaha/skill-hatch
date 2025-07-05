import { useState } from "react"

export default function Profile() {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    userid: "demo_user",
    email: "demo@example.com",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [imagePreview, setImagePreview] = useState("https://instaily.com/_next/static/media/test.b3910688.jpg");

  const userProfile = {
    name: "Demo User",
    userid: "demo_user",
    email: "demo@example.com",
    joined: "January 2025",
    currentLevel: "Intermediate",
    totalXP: 450,
    learningGoals: ["JavaScript", "React", "Node.js"],
    badges: ["HTML Master", "CSS Wizard"],
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    setEditMode(false);
  };

  const toggleEditMode = () => setEditMode(!editMode);
  const setActiveTab = () => console.log("Back to dashboard");

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-md">
        <div className="flex justify-center mb-6">
          <img src={imagePreview} alt="Avatar" className="w-24 h-24 rounded-full object-cover shadow" />
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{userProfile.name}</h2>
          <p className="text-sm text-gray-500">@{userProfile.userid}</p>
          <p className="text-sm text-gray-500">{userProfile.email}</p>
        </div>

        <div className="space-y-8">
          <div className="p-6 bg-gray-100 border border-cyan-100 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Profile Details</h3>

            {editMode ? (
              <div className="space-y-4">
                <input type="file" accept="image/*" onChange={handleImageChange} />
                <input
                  type="text"
                  name="userid"
                  value={formData.userid}
                  onChange={handleChange}
                  placeholder="User ID"
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Current Password"
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="New Password"
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={formData.confirmNewPassword}
                  onChange={handleChange}
                  placeholder="Confirm New Password"
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
                <div className="flex gap-4">
                  <button onClick={handleSubmit} className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-2 rounded-md">
                    Save
                  </button>
                  <button onClick={toggleEditMode} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded-md">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-700">Joined: {userProfile.joined}</p>
                <p className="text-sm text-gray-700">Current Level: {userProfile.currentLevel}</p>
                <p className="text-sm text-gray-700">Total XP: {userProfile.totalXP}</p>
                <button
                  onClick={toggleEditMode}
                  className="mt-4 w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-2 rounded-md"
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>

          <div className="p-6 bg-gray-100 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Learning Goals</h3>
            <div className="flex flex-wrap gap-2">
              {userProfile.learningGoals.map((goal, idx) => (
                <span key={idx} className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-medium">
                  {goal}
                </span>
              ))}
            </div>
          </div>

          <div className="p-6 bg-gray-100 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Achievements</h3>
            <div className="flex flex-wrap gap-2">
              {userProfile.badges.map((badge, idx) => (
                <span key={idx} className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <i className={`fas ${badge === "HTML Master" ? "fa-code" : "fa-paint-brush"}`}></i>
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={setActiveTab}
          className="mt-8 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded-md transition"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
