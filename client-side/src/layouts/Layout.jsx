import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { IoMdArrowDropdown } from "react-icons/io";

const Layout = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
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
      setRole(decoded.role);
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
    <div className="bg-neutral-50">
      {/* Main Content */}
      <div className="flex flex-col">
        {/* Navbar */}
        <div className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-50">
          <img src="/logo.png" alt="Logo" />
          <ul className="flex gap-12">
            <li className="text-[18px] font-semibold hover:scale-110 transition-all duration-500"><Link to={"/home#"}>Home</Link></li>
            <li className="text-[18px] font-semibold hover:scale-110 transition-all duration-500"><Link to={"/home#about"}>About</Link></li>
            <li className="text-[18px] font-semibold hover:scale-110 transition-all duration-500"><Link t0={"/home#candidates"}>Candidates</Link></li>
          </ul>
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
                <div className="absolute right-0 mt-44 w-40 bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <ul className="py-2">
                    <Link to="/profile">
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"><Link className="w-full">My Profile</Link></li>
                    </Link>
                    {role === "ADMIN" && (
                    <Link to="/dashboard">
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                            Dashboard
                        </li>
                    </Link>
                    )}
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
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
