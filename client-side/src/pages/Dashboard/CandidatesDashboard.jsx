import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const CandidatesDashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState(null);
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
      fetchCandidates(newToken);
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
        const newToken = response.data.accessToken;
        setToken(newToken);
        const decoded = jwtDecode(newToken);
        setExpire(decoded.exp);
        config.headers.Authorization = `Bearer ${newToken}`;
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  const fetchCandidates = async (authToken) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosJWT.get("http://localhost:5000/api/v1/candidates", {
        headers: { Authorization: `Bearer ${authToken || token}` },
      });
      setCandidates(response.data);
    } catch (error) {
      setError("Gagal mengambil data kandidat.");
      console.error("Error fetching candidates: ", error);
    } finally {
      setLoading(false);
    }
  };

  const updateCandidate = async (id, field, value) => {
    if (!value.trim()) return;
    try {
      await axiosJWT.patch(`http://localhost:5000/api/v1/candidates/${id}`, { [field]: value }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCandidates();
      toast.success("Data kandidat berhasil diperbarui!", { duration: 3000 });
    } catch (error) {
      console.error("Error updating candidate: ", error);
      toast.error("Gagal memperbarui data kandidat.");
    }
  };

  const deleteCandidate = async (id) => {
    Swal.fire({
      title: "Apakah kamu yakin?",
      text: "Data kandidat bakal dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yez, hapus aja!",
      cancelButtonText: "Gajadi",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosJWT.delete(`http://localhost:5000/api/v1/candidates/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          fetchCandidates();
          Swal.fire("Deleted!", "Kandidat telah dihapus.", "success");
          toast.success("Data kandidat berhasil dihapus!", { duration: 3000 });
        } catch (error) {
          console.error("Error deleting candidate: ", error);
          Swal.fire("Error!", "Gagal menghapus kandidat.", "error");
          toast.error("Gagal menghapus data kandidat.");
        }
      }
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Candidates Dashboard</h2>
      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="mb-4 flex items-center gap-2">
            <Link to="/dashboard/candidates/create" className="bg-green-500 text-white px-4 py-2 rounded">
              Add Candidate
            </Link>
            <button onClick={() => setEditMode(!editMode)} className="bg-blue-500 text-white px-4 py-2 rounded">
              {editMode ? "Disable Edit Mode" : "Enable Edit Mode"}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border">Nomor</th>
                  <th className="px-4 py-2 border">Tahun</th>
                  <th className="px-4 py-2 border">Visi</th>
                  <th className="px-4 py-2 border">Misi</th>
                  <th className="px-4 py-2 border">Program Kerja</th>
                  <th className="px-4 py-2 border">Ketua</th>
                  <th className="px-4 py-2 border">Wakil</th>
                  <th className="px-4 py-2 border">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((candidate, index) => (
                  <tr key={candidate.id} className="text-center">
                    <td className="px-4 py-2 border">Paslon {index + 1}</td>
                    {["tahun", "visi", "misi", "program"].map(field => (
                      <td
                        key={field}
                        className="px-4 py-2 border"
                        contentEditable={editMode}
                        suppressContentEditableWarning={true}
                        onBlur={(e) => updateCandidate(candidate.id, field, e.target.innerText)}
                      >
                        {candidate[field]}
                      </td>
                    ))}
                    <td className="px-4 py-2 border">
                      {candidate.ketua ? `${candidate.ketua.nama} (${candidate.ketua.kelas})` : "-"}
                    </td>
                    <td className="px-4 py-2 border">
                      {candidate.wakil ? `${candidate.wakil.nama} (${candidate.wakil.kelas})` : "-"}
                    </td>
                    <td className="px-4 py-2 border">
                      <button onClick={() => deleteCandidate(candidate.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default CandidatesDashboard;
