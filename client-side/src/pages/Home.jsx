import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { TailSpin } from 'react-loader-spinner';

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState(0);

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
      console.error("Error refreshing token: ", error);
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
    try {
      setIsLoading(true);
      const response = await axiosJWT.get("http://localhost:5000/api/v1/candidates", {
        headers: { Authorization: `Bearer ${authToken || token}` },
      });
      setCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center h-screen">
      {/* Header */}
      <section className='flex items-center justify-between w-full px-[84px]'>
        <div className='flex flex-col w-[600px] font-inter gap-5'>
          <h1 className='font-bold text-5xl'>Bingung nentuin pilihan kamu siapa?</h1>
          <p className='font-medium text-xl'>Cek <span className='font-bold text-blue-500'>PILKATOS.</span> dulu aja!, biar kamu ga salah pilih siapa calon ketua OSIS yang cocok di hati kamu 😋</p>
          <a href="#candidates" className='border-blue-500 border-2 text-center text-blue-500 w-fit text-xl font-medium px-16 py-2 hover:bg-blue-500 hover:text-white transition-all duration-700 rounded'>Cek Kandidatnya</a>
        </div>
        <img src="/illustrations.png" alt="Illustration" className='h-[600px]'/>
      </section>

      {/* About Section */}
      <section className='w-full bg-gray-100 py-10 px-[60px] text-center'>
        <h2 className='text-3xl font-bold'>Tentang PILKATOS</h2>
        <p className='text-lg mt-4'>Aplikasi ini bertujuan untuk memberikan informasi mengenai calon ketua dan calon wakil OSIS dari SMK XXY. Dengan PILKATOS, kamu bisa mengenal lebih jauh visi, misi, dan program kerja dari setiap pasangan calon.</p>
      </section>

      {/* Candidate Section */}
      <section id="candidates" className="w-full py-10 px-[60px] text-center">
        <h2 className="text-3xl font-bold mb-6">Kandidat Ketua & Wakil OSIS</h2>
        {isLoading ? (
          <div className='flex justify-center items-center h-[400px]'>
            <TailSpin
            visible={true}
            height="80"
            width="80"
            color="#6389FF"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            />
          </div>
        ): (
          <div className="flex flex-col gap-10 items-center">
            {candidates.map((candidate, index) => (
              <div 
                key={candidate.id} 
                className="w-full max-w-[800px] bg-white shadow-lg rounded-lg p-6 flex flex-col items-center"
              >
              {/* Gambar di atas */}
              <div className="w-full">
                <img 
                  src={candidate.banner} 
                  alt="Candidate Banner" 
                  className="w-full aspect-[16/9] object-cover rounded-md"
                />
              </div>

              {/* Keterangan di bawah */}
              <div className="w-full text-center">
                <h1 className="text-3xl font-black">PASLON {index + 1}</h1>
                <h3 className="text-2xl font-bold">
                  {candidate.ketua?.nama} ({candidate.ketua?.kelas}) & {candidate.wakil?.nama} ({candidate.wakil?.kelas})
                </h3>
                <p className="text-gray-500">{candidate.tahun}</p>
                <p className="mt-2 text-lg"><strong>Visi:</strong> {candidate.visi}</p>
                <p className="mt-2 text-lg"><strong>Misi:</strong> {candidate.misi}</p>
                <p className="mt-2 text-lg"><strong>Program:</strong> {candidate.program}</p>
              </div>
            </div>
          ))}
        </div>
        )}
      </section>
    </main>
  );
}

export default Home;
