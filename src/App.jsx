import Login from "./pages/Login";
import Missing from "./pages/Missing";
import Register from "./pages/Register";
import Swnlist from "./pages/Swnlist";
import Clublist from "./pages/Clublist"

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      {/* public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/swnlist" element={<Swnlist />} />
      <Route path="/swn/:swn_id" element={<Clublist />} />
      {/* catch all */}
      <Route path="*" element={<Missing />} />
    </Routes>
  );
}

export default App;
