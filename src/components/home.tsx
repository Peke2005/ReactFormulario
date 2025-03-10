import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold">{t("inicio.titulo")}</h1>
      <p className="mt-2">{t("inicio.descripcion")}</p>
      <button
        onClick={() => navigate("/formulario")}
        className="mt-4 bg-blue-500 text-black py-2 px-4 rounded"
      >
        {t("inicio.comenzar")}
      </button>
    </div>
  );
}

export default home;