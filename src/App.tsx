import NavBar from "./components/header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Formulario from "./components/formularios";
import Resumen from "./components/resumen";
import "./i18n/i18n"; // Importar configuración de idiomas
import Footer from "./components/footer";

function App() {
  return (
    <>
      <Router>
        <div className="flex flex-col min-h-screen">
          <NavBar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/formulario" element={<Formulario />} />
              <Route path="/resumen" element={<Resumen />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </>
  );
}

export default App;
