import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [candidateCount, setCandidateCount] = useState(0);
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await refreshToken();
      getDashboardData();
    };
    fetchData();
  }, []);
  
  const refreshToken = async () => {
    try {
      const response = await axiosJWT.get("http://localhost:5000/api/v1/token", { withCredentials: true });
      setToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
      setExpire(decoded.exp);
    } catch (error) {
      console.error("Failed to refresh token:", error);
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
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  const getDashboardData = async () => {
    try {
      const userRes = await axiosJWT.get("http://localhost:5000/api/v1/users/count", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const candidateRes = await axiosJWT.get("http://localhost:5000/api/v1/candidates/count", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserCount(userRes.data.totalUsers);
      setCandidateCount(candidateRes.data.totalCandidate);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    }
  };
  

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Dashboard Overview</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="text-3xl font-bold">{userCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold">Total Candidates</h3>
          <p className="text-3xl font-bold">{candidateCount}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
