import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const CreateCandidate = () => {
    const { register, handleSubmit } = useForm();
    const [banner, setBanner] = useState(null);
    const [token, setToken] = useState("");
    const [expire, setExpire] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        refreshToken();
    }, []);

    const refreshToken = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/v1/token", { withCredentials: true });
            const newToken = response.data.accessToken;
            setToken(newToken);
            const decoded = jwtDecode(newToken);
            setExpire(decoded.exp);
        } catch (error) {
            navigate("/");
        }
    };

    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use(
        async (config) => {
            const currentDate = new Date();
            if (expire * 1000 < currentDate.getTime()) {
                await refreshToken();
                config.headers.Authorization = `Bearer ${token}`;
            } else {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    const onSubmit = async (data) => {
        if (!token) {
            toast.error("Unauthorized! Please login again.");
            return;
        }

        const formData = new FormData();
        formData.append("tahun", data.tahun);
        formData.append("visi", data.visi);
        formData.append("misi", data.misi);
        formData.append("userKetuaId", data.userKetuaId);
        formData.append("userWakilId", data.userWakilId);
        formData.append("program", data.program);
        if (banner) formData.append("banner", banner);

        try {
            const response = await axiosJWT.post("http://localhost:5000/api/v1/candidates", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": banner ? "multipart/form-data" : "application/json",
                },
            });

            toast.success(response.data.msg);
            navigate("/dashboard/candidates");
        } catch (error) {
            console.error("Error creating candidate:", error);
            toast.error(error.response?.data?.msg || "Gagal membuat kandidat");
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Tambah Kandidat</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input
                    {...register("tahun")}
                    type="text"
                    placeholder="Tahun"
                    className="w-full p-2 border rounded"
                    required
                />
                <input
                    {...register("userKetuaId")}
                    type="text"
                    placeholder="ID Ketua"
                    className="w-full p-2 border rounded"
                    required
                />
                <input
                    {...register("userWakilId")}
                    type="text"
                    placeholder="ID Wakil"
                    className="w-full p-2 border rounded"
                    required
                />
                <textarea
                    {...register("visi")}
                    placeholder="Visi"
                    className="w-full p-2 border rounded"
                    required
                />
                <textarea
                    {...register("misi")}
                    placeholder="Misi"
                    className="w-full p-2 border rounded"
                    required
                />
                <textarea
                    {...register("program")}
                    placeholder="Program Kerja"
                    className="w-full p-2 border rounded"
                    required
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setBanner(e.target.files[0])}
                    className="w-full p-2 border rounded"
                />

                <div className="flex gap-2 items-center">
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                        Tambah Kandidat
                    </button>
                    <Link to="/dashboard/candidates" className="w-full bg-gray-500 text-white text-center p-2 rounded">
                        Batal
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default CreateCandidate;
