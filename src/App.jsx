import Login from "./pages/Login";
import Missing from "./pages/Missing";
import Register from "./pages/Register";
import Swnlist from "./pages/Swnlist";
import Clublist from "./pages/Clublist";
import ResetPassword from "./pages/ResetPassword";
import Activity from "./pages/Activity";
import TeacherSearch from "./pages/Teachersearch"
import ActivityDetail from "./pages/ActivityDetail";

import "./css/App.css"

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      {/* public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* private routes */}
      <Route path="/swnlist" element={<Swnlist />} />
      <Route path="/swn/:swn_id" element={<Clublist />} />
      <Route path="/club/:club_id" element={<Activity />} />
      <Route path="/activity/:activity_id" element={<ActivityDetail />} />
      <Route path="/teachersearch" element={<TeacherSearch />} />
      
      {/* catch all */}
      <Route path="*" element={<Missing />} />
    </Routes>
  );
}

export default App;
