import "../style/navBar.css";

function App() {
  return (
    <>
      <nav>
        <ul>
          <li>
            <a href="http://localhost:5173/resumen">Home</a>
          </li>
          <li>
            <a href="">Formularios</a>
          </li>
          <li>
            <a href="">Resultados</a>
          </li>
        </ul>
      </nav>
      <ul className="language-selector">
        <li className="language-item">Español</li>
        <li className="language-item">Inglés</li>
      </ul>
    </>
  );
}

export default App;