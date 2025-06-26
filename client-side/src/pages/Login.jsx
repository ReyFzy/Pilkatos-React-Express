import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { TailSpin } from "react-loader-spinner";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [NIS, setNIS] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const Auth = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/v1/login", {
        NIS,
        password,
      }, { withCredentials: true });

      // Simpan accessToken di localStorage atau state management
      localStorage.setItem("accessToken", response.data.accessToken);

      toast.success("Yeay Berhasil Login!", { duration: 3000 });

      setTimeout(() => {
          navigate("/home");
      }, 1000);

    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
        toast.error("Login Gagal!", { duration: 3000 });
      }
    }finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>
        {msg && <p className="text-red-500 text-center mt-2">{msg}</p>}
        <form onSubmit={Auth} className="mt-4">
          <div className="mb-4">
            <label className="block text-gray-600 text-sm mb-1">NIS</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Masukkan NIS"
              value={NIS}
              onChange={(e) => setNIS(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Masukkan Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {loading ? (
            <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition flex items-center justify-center">
              <TailSpin
              visible={true}
              height="16"
              width="16"
              color="#FFFFFF"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{}}
              wrapperClass=""
              />
            </button>
          ) : (
            <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
              Login
            </button>
          )}
        </form>
        <p className="text-center text-neutral-700 mt-3">Belum punya akun? <Link to="/register" className="text-blue-500 hover:underline transition-all duration-700 italic">Bikin disini</Link></p>
      </div>
    </section>
  );
};

export default Login;
