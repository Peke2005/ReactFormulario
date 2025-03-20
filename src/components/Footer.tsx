import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../style/footer.css"; // Asegúrate de crear este archivo para los estilos

function Footer() {
  const {} = useTranslation();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Actualiza la hora cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Limpia el intervalo cuando el componente se desmonta
    return () => clearInterval(timer);
  }, []);

  // Formatea la fecha y hora
  const formattedDateTime = currentTime.toLocaleString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <footer className="footer">
      <div className="footer-content p-6">
        <span className="footer-name">Stucom</span>
        <span className="footer-time">{formattedDateTime}</span>
      </div>
    </footer>
  );
}

export default Footer;
