import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-hot-toast";

const EditUser = () => {
  const { NIS } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({ nama: "", NIS: "", kelas: "", role: "" });
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState(0);

  useEffect(() => {
    refreshToken();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/v1/token", { withCredentials: true });
      setToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
      setExpire(decoded.exp);
      getUser(response.data.accessToken);
    } catch (error) {
      navigate("/");
    }
  };

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get("http://localhost:5000/api/v1/token", { withCredentials: true });
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decoded = jwtDecode(response.data.accessToken);
        setExpire(decoded.exp);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  const getUser = async (accessToken) => {
    try {
      const response = await axiosJWT.get(`http://localhost:5000/api/v1/users/${NIS}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user", error);
      Swal.fire("Error!", "Failed to fetch user data.", "error");
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosJWT.patch(`http://localhost:5000/api/v1/users/${NIS}`, user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire("Success!", "User updated successfully.", "success").then(() => {
        toast.success("Data berhasil diubah!", { duration: 3000 });
        setTimeout(() => {
            navigate("/dashboard/users");
        }, 1000);
      });
    } catch (error) {
      Swal.fire("Error!", "Failed to update user.", "error");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Edit User</h2>
      <form onSubmit={handleSubmit} className="max-w-lg bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block font-semibold">NIS</label>
          <input type="text" name="NIS" value={user.NIS} className="w-full p-2 border border-gray-400 rounded bg-gray-200" disabled />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Name</label>
          <input type="text" name="nama" value={user.nama} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Kelas</label>
          <input type="text" name="kelas" value={user.kelas} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Role</label>
          <select name="role" value={user.role} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Update
          </button>
          <button type="button" onClick={() => navigate("/dashboard/users")} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );  
};

export default EditUser;
