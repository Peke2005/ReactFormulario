import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../style/resumen.css";

function Resumen() {
  const { t } = useTranslation();
  const location = useLocation();
  const respuestas = (location.state?.respuestas || {}) as Record<string, string>;

  return (
    <div className="p-6 text-center mt-[50%]">
      <h2 className="text-2xl font-bold">{t("resumen.titulo")}</h2>
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