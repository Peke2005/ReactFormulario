import { useState, useEffect } from "react"; // Importa hooks de React
import { useTranslation } from "react-i18next"; // Importa hook para internacionalización
import "../style/footer.css"; // Importa estilos CSS para el footer

function Footer() {
  // Obtiene las funciones de traducción y el objeto i18n para manejar idiomas
  const { t, i18n } = useTranslation();

  // Estado para almacenar la hora actual, inicializado con la fecha actual
  const [currentTime, setCurrentTime] = useState(new Date());

  // Hook useEffect para actualizar la hora cada segundo
  useEffect(() => {
    // Crea un intervalo que actualiza currentTime cada 1000ms (1 segundo)
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Función de limpieza que se ejecuta al desmontar el componente
    return () => clearInterval(timer); // Detiene el intervalo para evitar memory leaks
  }, []); // Array vacío significa que solo se ejecuta al montar/desmontar

  // Determina el formato de fecha según el idioma actual (español o inglés)
  const locale = i18n.language === "es" ? "es-ES" : "en-US";

  // Formatea la fecha y hora usando las opciones especificadas
  const formattedDateTime = currentTime.toLocaleString(locale, {
    weekday: "long", // Día de la semana completo (ej: "lunes")
    year: "numeric", // Año en números (ej: "2025")
    month: "long", // Mes completo (ej: "marzo")
    day: "numeric", // Día del mes (ej: "20")
    hour: "2-digit", // Hora en formato 2 dígitos
    minute: "2-digit", // Minutos en formato 2 dígitos
    second: "2-digit", // Segundos en formato 2 dígitos
  });

  // Renderiza el componente footer
  return (
    <footer className="footer">
      {" "}
      {/* Contenedor principal con clase CSS */}
      <div className="footer-content p-6">
        {" "}
        {/* Div interno con padding */}
        {/* Nombre traducido desde el archivo de traducciones */}
        <span className="footer-name">{t("footer.nombre")}</span>
        {/* Fecha y hora formateada */}
        <span className="footer-time">{formattedDateTime}</span>
      </div>
    </footer>
  );
}

export default Footer; // Exporta el componente para usarlo en otros archivos
