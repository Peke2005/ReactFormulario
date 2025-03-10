import { useLocation } from "react-router-dom";
import "../style/resumen.css";

function Resumen() {
  const location = useLocation();
  const respuestas = (location.state?.respuestas || {}) as Record<string, string>;

  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold">Resumen de Respuestas</h2>
      <div className="bg-gray-100 p-4 rounded mt-4 text-left">
        {Object.entries(respuestas).map(([pregunta, respuesta]) => (
          <p key={pregunta} className="mb-2 text-black">
            <strong className="text-blue-600">{pregunta}:</strong> {respuesta}
          </p>
        ))}
      </div>
    </div>
  );
}

export default Resumen;