import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { IoMdArrowDropdown } from "react-icons/io";

const DashboardLayout = () => {
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const navigate = useNavigate();
  const defaultProfilePic = "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png";

  useEffect(() => {
    refreshToken();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/v1/token", { withCredentials: true });
      const decoded = jwtDecode(response.data.accessToken);
      
      // Ambil data user berdasarkan NIS
      fetchUserData(decoded.NIS, response.data.accessToken);
    } catch (error) {
      navigate("/");
    }
  };

  const fetchUserData = async (NIS, token) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/users/${NIS}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });

      const user = response.data;
      setName(user.nama);
      setProfilePic(user.profilePic || defaultProfilePic);
    } catch (error) {
      console.error("Failed to fetch user data", error);
      setProfilePic(defaultProfilePic);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.delete("http://localhost:5000/api/v1/logout", { withCredentials: true });
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-5">
        <h2 className="text-xl font-bold mb-5">Dashboard</h2>
        <ul>
          <li className="mb-3">
            <Link to="/dashboard" className="hover:underline">Home</Link>
          </li>
          <li className="mb-3">
            <Link to="/dashboard/users" className="hover:underline">Users</Link>
          </li>
          <li>
            <Link to="/dashboard/candidates" className="hover:underline">Candidates</Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Navbar */}
        <div className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Welcome Back, {name || "..."}</h1>

          {/* Profile Section */}
          <div className="relative group flex items-center space-x-3">
            {/* Profile Image */}
            {profilePic && (
              <img
                src={profilePic}
                alt="Profile"
                className="w-10 h-10 rounded-full border border-gray-300 object-cover"
              />
            )}
            
            {/* Nama User */}
            <span className="text-gray-700 font-medium flex items-center gap-[2px]">{name} <IoMdArrowDropdown/></span>

            {/* Dropdown */}
            <div className="absolute right-0 mt-40 w-40 bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <ul className="py-2">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">My Profile</li>
                <li
                  onClick={handleLogout}
                  className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer"
                >
                  Logout
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Outlet untuk menampilkan konten dari setiap halaman */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
