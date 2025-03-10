import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import questionsData from "../data/questions.json";
import "../style/formulario.css";

function Formulario() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});

  const formulario = questionsData[index];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRespuestas({ ...respuestas, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (index < questionsData.length - 1) {
      setIndex(index + 1);
    } else {
      navigate("/resumen", { state: { respuestas } });
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">{t(formulario.titulo)}</h2>
      <form className="mt-4">
        {formulario.preguntas.map((pregunta) => (
          <div key={pregunta.id} className="mb-4">
            <label className="block font-medium">{t(pregunta.pregunta)}</label>
            <input
              type={pregunta.tipo}
              name={pregunta.id}
              value={respuestas[pregunta.id] || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1 "
              required
            />
          </div>
        ))}
        <button
          type="button"
          onClick={handleNext}
          className="mt-4 bg-green-500 text-black py-2 px-4 rounded"
        >
          {index < questionsData.length - 1 ? t("formulario.siguiente") : t("formulario.finalizar")}
        </button>
      </form>
    </div>
  );
}

export default Formulario;