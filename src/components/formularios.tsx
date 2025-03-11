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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        {formulario.preguntas.map((pregunta) => {
          switch (pregunta.tipo) {
            case 'text':
              return (
                <div key={pregunta.id} className="mb-4">
                  <label className="block font-medium">{t(pregunta.pregunta)}</label>
                  <input
                    type="text"
                    name={pregunta.id}
                    value={respuestas[pregunta.id] || ""}
                    onChange={handleChange}
                    className="w-full border p-2 rounded mt-1"
                    required
                  />
                </div>
              );
            case 'select':
              return (
                <div key={pregunta.id} className="mb-4">
                  <label className="block font-medium">{t(pregunta.pregunta)}</label>
                  <select
                    name={pregunta.id}
                    value={respuestas[pregunta.id] || ""}
                    onChange={handleChange}
                    className="w-full border p-2 rounded mt-1"
                    required
                  >
                    {pregunta.opciones.map((opcion, idx) => (
                      <option key={idx} value={opcion}>
                        {t(opcion)}
                      </option>
                    ))}
                  </select>
                </div>
              );
            case 'check':
              return (
                <div key={pregunta.id} className="mb-4">
                  <label className="block font-medium">{t(pregunta.pregunta)}</label>
                  {pregunta.opciones.map((opcion, idx) => (
                    <div key={idx} className="flex items-center">
                      <input
                        type="checkbox"
                        name={pregunta.id}
                        value={opcion}
                        onChange={(e) => {
                          const { name, value, checked } = e.target;
                          setRespuestas((prevState) => {
                            const current = prevState[name] || [];
                            if (checked) {
                              return { ...prevState, [name]: [...current, value] };
                            } else {
                              return {
                                ...prevState,
                                [name]: current.filter((v) => v !== value),
                              };
                            }
                          });
                        }}
                        checked={respuestas[pregunta.id]?.includes(opcion) || false}
                        className="mr-2"
                      />
                      <label>{t(opcion)}</label>
                    </div>
                  ))}
                </div>
              );
            case 'textarea':
              return (
                <div key={pregunta.id} className="mb-4">
                  <label className="block font-medium">{t(pregunta.pregunta)}</label>
                  <textarea
                    name={pregunta.id}
                    value={respuestas[pregunta.id] || ""}
                    onChange={handleChange}
                    className="w-full border p-2 rounded mt-1"
                    required
                    rows={4}
                  />
                </div>
              );
            default:
              return null;
          }
        })}
        <button
          type="button"
          onClick={handleNext}
          className="mt-4 bg-green-500 text-white py-2 px-4 rounded"
        >
          {index < questionsData.length - 1 ? t("formulario.siguiente") : t("formulario.finalizar")}
        </button>
      </form>
    </div>
  );
}

export default Formulario;
