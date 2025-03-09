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

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-left" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
