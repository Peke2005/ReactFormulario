import { useNavigate } from "react-router-dom"; // Importa hook para navegación programática
import { useTranslation } from "react-i18next"; // Importa hook para manejar traducciones

// Define un componente funcional llamado "home" (nota: por convención debería empezar con mayúscula: "Home")
function home() {
  // Obtiene la función "t" para traducir textos
  const { t } = useTranslation();

  // Obtiene la función "navigate" para redirigir a otras rutas
  const navigate = useNavigate();

  // Renderiza el componente
  return (
    <div className="p-6 text-center mt-[50%]">
      {" "}
      {/* Contenedor con padding, centrado y margen superior del 50% */}
      {/* Título traducido, con estilo de texto grande y negrita */}
      <h1 className="text-2xl font-bold">{t("inicio.titulo")}</h1>
      {/* Descripción traducida, con margen superior */}
      <p className="mt-2">{t("inicio.descripcion")}</p>
      {/* Botón para navegar a "/formulario" */}
      <button
        onClick={() => navigate("/formulario")} // Al hacer clic, redirige a la ruta "/formulario"
        className="mt-4 bg-blue-500 text-black py-2 px-4 rounded" // Estilos del botón
      >
        {t("inicio.comenzar")} {/* Texto del botón traducido */}
      </button>
    </div>
  );
}

export default home; // Exporta el componente para usarlo en otros archivos
