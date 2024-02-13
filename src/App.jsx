import Login from "./pages/Login";
import Missing from "./pages/Missing";
import Register from "./pages/Register";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      {/* public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* catch all */}
      <Route path="*" element={<Missing />} />
    </Routes>
  );
}

export default App;
