import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const Register = () => {
    const [user, setUser] = useState({
        nama: "",
        NIS: "",
        kelas: "",
        password: "",
        confPassword: ""
    });
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/v1/register", user);

            // Menampilkan alert sukses
            toast.success("Berhasil Registrasi!", { duration: 3000 });

            setTimeout(() => {
                navigate("/");
            }, 1000);

        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
                
                // Menampilkan alert error
                toast.error("Registrasi Gagal!", { duration: 3000 });
            }
        }
    };

    return (
        <section className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center mb-4">Register</h2>
                {msg && <p className="text-red-500 text-center mb-4">{msg}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">NIS</label>
                        <input type="text" name="NIS" value={user.NIS} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200" placeholder="NIS kamu" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Nama</label>
                        <input type="text" name="nama" value={user.nama} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200" placeholder="Nama kamu" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Kelas</label>
                        <input type="text" name="kelas" value={user.kelas} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200" placeholder="Kelas kamu" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Password</label>
                        <input type="password" name="password" value={user.password} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200" placeholder="Password kamu" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Confirm Password</label>
                        <input type="password" name="confPassword" value={user.confPassword} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200" placeholder="Konfirmasi Password kamu" required />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">Register</button>
                </form>
                <p className="text-center text-neutral-700 mt-3">Udah punya akun? <Link to="/" className="text-blue-500 hover:underline transition-all duration-700 italic">Kesini</Link></p>
            </div>
        </section>
    );
};

export default Register;
