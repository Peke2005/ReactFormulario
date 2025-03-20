import React from "react"; // Importa React para definir el componente
import { Link } from "react-router-dom"; // Importa Link para navegación entre rutas
import { useTranslation } from "react-i18next"; // Importa hook para manejar traducciones
import "../style/navBar.css"; // Importa estilos CSS para la barra de navegación

// Define un componente funcional NavBar usando tipado React.FC (Function Component)
const NavBar: React.FC = () => {
  // Obtiene el objeto i18n para manejar cambios de idioma
  const { i18n } = useTranslation();

  // Función para cambiar el idioma a español
  const changeToSpanish = () => {
    i18n.changeLanguage("es"); // Cambia el idioma a español
    localStorage.setItem("idioma", "es"); // Guarda "es" en localStorage para persistencia
  };

  // Función para cambiar el idioma a inglés
  const changeToEnglish = () => {
    i18n.changeLanguage("en"); // Cambia el idioma a inglés
    localStorage.setItem("idioma", "en"); // Guarda "en" en localStorage para persistencia
  };

  // Renderiza el componente
  return (
    <>
      {" "}
      {/* Fragmento vacío para agrupar elementos sin agregar un nodo extra */}
      <nav>
        {" "}
        {/* Barra de navegación principal */}
        <ul>
          {" "}
          {/* Lista desordenada para los enlaces de navegación */}
          <li>
            <Link to="/">Home</Link>{" "}
            {/* Enlace a la ruta raíz (página principal) */}
          </li>
          <li>
            <Link to="/formulario">Formularios</Link>{" "}
            {/* Enlace a la página de formularios */}
          </li>
          <li>
            <Link to="/resumen">Resultados</Link>{" "}
            {/* Enlace a la página de resultados */}
          </li>
        </ul>
      </nav>
      <ul className="language-selector">
        {" "}
        {/* Lista para el selector de idioma */}
        <li className="language-item">
          {/* Botón para cambiar a español */}
          <button onClick={changeToSpanish} className="language-button">
            Español
          </button>
        </li>
        <li className="language-item">
          {/* Botón para cambiar a inglés */}
          <button onClick={changeToEnglish} className="language-button">
            Inglés
          </button>
        </li>
      </ul>
    </>
  );
};

export default NavBar; // Exporta el componente para usarlo en otros archivos
