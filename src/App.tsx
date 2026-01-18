import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route element={<div>Hello World</div>} path="/" />
    </Routes>
  );
}

export default App;
