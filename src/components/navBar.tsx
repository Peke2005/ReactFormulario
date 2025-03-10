import "../style/navBar.css";

function App() {
  return (
    <>
      <nav>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/formulario">Formularios</a>
          </li>
          <li>
            <a href="/resumen">Resultados</a>
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