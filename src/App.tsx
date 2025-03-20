// Importa componentes personalizados
import NavBar from "./components/header"; // Barra de navegación
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Herramientas de enrutamiento
import Home from "./components/home"; // Componente de la página de inicio
import Formulario from "./components/formularios"; // Componente de formularios
import Resumen from "./components/resumen"; // Componente de resumen
import "./i18n/i18n"; // Importa la configuración de internacionalización (i18n)
import Footer from "./components/footer"; // Pie de página

// Define el componente principal "App"
function App() {
  return (
    <>
      {" "}
      {/* Fragmento para agrupar elementos sin agregar un nodo extra */}
      <Router>
        {" "}
        {/* Configura el enrutamiento de la aplicación */}
        <div className="flex flex-col min-h-screen">
          {" "}
          {/* Contenedor principal con flexbox y altura mínima */}
          <NavBar />{" "}
          {/* Renderiza la barra de navegación en la parte superior */}
          <main className="flex-grow">
            {" "}
            {/* Contenido principal que ocupa el espacio disponible */}
            <Routes>
              {" "}
              {/* Define las rutas de la aplicación */}
              {/* Ruta para la página de inicio */}
              <Route path="/" element={<Home />} />
              {/* Ruta para la página de formularios */}
              <Route path="/formulario" element={<Formulario />} />
              {/* Ruta para la página de resumen */}
              <Route path="/resumen" element={<Resumen />} />
            </Routes>
          </main>
          <Footer /> {/* Renderiza el pie de página en la parte inferior */}
        </div>
      </Router>
    </>
  );
}

export default App; // Exporta el componente principal para usarlo como raíz de la aplicación
