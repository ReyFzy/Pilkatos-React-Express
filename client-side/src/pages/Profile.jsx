import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { FiEdit } from "react-icons/fi";

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const defaultProfilePic = "https://via.placeholder.com/150";

  const [user, setUser] = useState({ nama: "", NIS: "", kelas: "", profilePic: defaultProfilePic });
  const [token, setToken] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(defaultProfilePic);

  useEffect(() => {
    refreshToken();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/v1/token", { withCredentials: true });
      const decoded = jwtDecode(response.data.accessToken);
      setToken(response.data.accessToken);

      fetchUserData(decoded.NIS, response.data.accessToken);
    } catch (error) {
      navigate("/");
    }
  };

  const fetchUserData = async (NIS, token) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/users/${NIS}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      const userData = response.data;
      setUser({
        nama: userData.nama || "",
        NIS: userData.NIS || "",
        kelas: userData.kelas || "",
        profilePic: userData.profilePic || defaultProfilePic,
      });
      setPreview(userData.profilePic || defaultProfilePic);
    } catch (error) {
      console.error("Failed to fetch user data", error);
      setUser((prev) => ({ ...prev, profilePic: defaultProfilePic }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nama", user.nama);
    formData.append("kelas", user.kelas);
    if (image) formData.append("profilePic", image);
  
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/v1/users/${user.NIS}`,
        formData,
        {
          headers: {
            "Authorization": `Bearer ${token}`, // Pastikan token dikirim
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // Pastikan cookie dikirim jika backend menggunakannya
        }
      );
      
      Swal.fire("Success!", "Profile updated successfully.", "success");
      fetchUserData(user.NIS, token);
    } catch (error) {
      console.error("Failed to update profile:", error.response?.data || error);
      Swal.fire("Error!", error.response?.data?.message || "Failed to update profile.", "error");
    }
  };
  

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-center text-2xl font-semibold mb-6">Edit Profile</h2>

      {/* Foto Profil */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-32 h-32">
          <img
            src={preview}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border border-gray-300 cursor-pointer"
            onClick={handleImageClick}
          />
          {/* Ikon Edit */}
          <div 
            className="absolute bottom-2 right-2 bg-black bg-opacity-70 p-2 rounded-full cursor-pointer"
            onClick={handleImageClick}
          >
            <FiEdit className="text-white w-5 h-5" />
          </div>
        </div>
        <button 
          className="text-blue-500 mt-2 text-sm font-semibold cursor-pointer hover:scale-105 transition-all duration-500" 
          onClick={handleImageClick}
        >
          Change Profile Photo
        </button>
      </div>

      {/* Input File (Tersembunyi) */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden"
        accept="image/*"
      />

      {/* Form Edit */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-600">Nama</label>
          <input
            type="text"
            name="nama"
            value={user.nama}
            onChange={(e) => setUser({ ...user, nama: e.target.value })}
            className="block w-full p-2 border rounded"
            placeholder="Name"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-600">Kelas</label>
          <input
            type="text"
            name="kelas"
            value={user.kelas}
            onChange={(e) => setUser({ ...user, kelas: e.target.value })}
            className="block w-full p-2 border rounded"
            placeholder="Kelas"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 cursor-pointer duration-500 transition-all"
        >
          Save Changes
        </button>
      </form>

      {/* Logout & Back to Home */}
      <div className="flex flex-col items-center mt-6 space-y-2">
        <button 
          onClick={() => navigate("/")} 
          className="text-red-500 font-semibold w-full text-center cursor-pointer hover:scale-110 transition-all duration-500"
        >
          Log Out
        </button>
        <button 
          onClick={() => navigate("/home")} 
          className="text-blue-500 font-semibold w-full text-center cursor-pointer hover:scale-110 transition-all duration-500"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Profile;
