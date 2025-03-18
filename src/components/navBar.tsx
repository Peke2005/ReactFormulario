import React from "react";
import { Link } from "react-router-dom"; // Para enlaces internos
import { useTranslation } from "react-i18next";
import "../style/navBar.css";

const NavBar: React.FC = () => {
  const { i18n } = useTranslation();

  // Funciones para cambiar el idioma
  const changeToSpanish = () => i18n.changeLanguage("es");
  const changeToEnglish = () => i18n.changeLanguage("en");

  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/formulario">Formularios</Link>
          </li>
          <li>
            <Link to="/resumen">Resultados</Link>
          </li>
        </ul>
      </nav>
      <ul className="language-selector">
        <li className="language-item">
          <button
            onClick={changeToSpanish}
            className="language-button"
          >
            Español
          </button>
        </li>
        <li className="language-item">
          <button
            onClick={changeToEnglish}
            className="language-button"
          >
            Inglés
          </button>
        </li>
      </ul>
    </>
  );
};

export default NavBar;