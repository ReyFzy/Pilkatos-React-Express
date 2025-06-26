import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import UsersDashboard from "./pages/Dashboard/UsersDashboard";
import EditUser from "./pages/Dashboard/EditUser";
import DashboardLayout from "./layouts/DashboardLayout";
import CandidatesDashboard from "./pages/Dashboard/CandidatesDashboard";
import Dashboard from "./Pages/Dashboard";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import AddCandidate from "./pages/Dashboard/AddCandidates";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import NextTopLoader from 'nextjs-toploader';

function App() {
  return (
    <BrowserRouter>
    <NextTopLoader
      color="#2299DD"
      initialPosition={0.08}
      crawlSpeed={200}
      height={3}
      crawl={true}
      showSpinner={true}
      easing="ease"
      speed={200}
      shadow="0 0 10px #2299DD,0 0 5px #2299DD"
      template='<div class="bar" role="bar"><div class="peg"></div></div> 
      <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
      zIndex={1600}
      showAtBottom={false}
    />
      <Toaster position="top-left" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UsersDashboard />} />
          <Route path="candidates" element={<CandidatesDashboard />} />
          <Route path="candidates/create" element={<AddCandidate />} />
          <Route path="users/edit/:NIS" element={<EditUser />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
