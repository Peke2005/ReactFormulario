import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../style/footer.css";

function Footer() {
  const { t, i18n } = useTranslation();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Actualiza la hora cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Limpia el intervalo cuando el componente se desmonta
    return () => clearInterval(timer);
  }, []);

  // Formatea la fecha y hora según el idioma actual
  const locale = i18n.language === "es" ? "es-ES" : "en-US";
  const formattedDateTime = currentTime.toLocaleString(locale, {
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
        <span className="footer-name">{t("footer.nombre")}</span>
        <span className="footer-time">{formattedDateTime}</span>
      </div>
    </footer>
  );
}

export default Footer;