import { useLocation } from "react-router-dom"; // Importa hook para acceder al estado de la ubicación actual
import { useTranslation } from "react-i18next"; // Importa hook para manejar traducciones
import "../style/resumen.css"; // Importa estilos CSS para el componente

// Define un componente funcional llamado "Resumen"
function Resumen() {
  // Obtiene la función "t" para traducir textos
  const { t } = useTranslation();

  // Obtiene el objeto "location" que contiene información sobre la ruta actual
  const location = useLocation();

  // Extrae las respuestas del estado de la ubicación, con un valor por defecto de objeto vacío
  // Se tipa como un objeto con claves y valores de tipo string
  const respuestas = (location.state?.respuestas || {}) as Record<
    string,
    string
  >;

  // Renderiza el componente
  return (
    <div className="p-6 text-center mt-[50%]">
      {" "}
      {/* Contenedor con padding, centrado y margen superior */}
      {/* Título traducido, con estilo de texto grande y negrita */}
      <h2 className="text-2xl font-bold">{t("resumen.titulo")}</h2>
      {/* Contenedor para mostrar las respuestas */}
      <div className="bg-gray-100 p-4 rounded mt-4 text-left">
        {/* Mapea las entradas del objeto "respuestas" a elementos <p> */}
        {Object.entries(respuestas).map(([pregunta, respuesta]) => (
          <p key={pregunta} className="mb-2 text-black">
            {" "}
            {/* Párrafo por cada par pregunta-respuesta */}
            {/* Pregunta en negrita y color azul */}
            <strong className="text-blue-600">{pregunta}:</strong> {respuesta}{" "}
            {/* Respuesta */}
          </p>
        ))}
      </div>
    </div>
  );
}

export default Resumen; // Exporta el componente para usarlo en otros archivos
