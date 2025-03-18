import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import questionsData from "../data/questions.json";
import "../style/formulario.css";

type Respuestas = Record<string, string | string[]>;

interface Pregunta {
  id: string;
  tipo: "text" | "select" | "check" | "textarea";
  pregunta: string;
  opciones?: string[];
}

interface FormularioData {
  titulo: string;
  preguntas: Pregunta[];
}

function Formulario() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [respuestas, setRespuestas] = useState<Respuestas>({});

  const formulario = questionsData[index] as FormularioData;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setRespuestas((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setRespuestas((prevState) => {
      const current = Array.isArray(prevState[name])
        ? (prevState[name] as string[])
        : [];
      if (checked) {
        return { ...prevState, [name]: [...current, value] };
      } else {
        return { ...prevState, [name]: current.filter((v) => v !== value) };
      }
    });
  };

  const isFormValid = () => {
    return formulario.preguntas.every((pregunta) => {
      const respuesta = respuestas[pregunta.id];
      if (pregunta.tipo === "check") {
        return Array.isArray(respuesta) && respuesta.length > 0;
      }
      return (
        respuesta &&
        (typeof respuesta === "string" ? respuesta.trim() !== "" : true)
      );
    });
  };

  // Función para reiniciar los textarea del formulario actual
  const resetTextareas = (newIndex: number) => {
    const newFormulario = questionsData[newIndex] as FormularioData;
    const resetValues: Respuestas = {};
    newFormulario.preguntas.forEach((pregunta) => {
      if (pregunta.tipo === "textarea") {
        resetValues[pregunta.id] = ""; // Reinicia solo los textarea
      }
    });
    setRespuestas((prev) => ({ ...prev, ...resetValues }));
  };

  const handleNext = () => {
    if (!isFormValid()) {
      alert(t("formulario.completaTodos"));
      return;
    }
    if (index < questionsData.length - 1) {
      const newIndex = index + 1;
      setIndex(newIndex);
      resetTextareas(newIndex); // Reinicia los textarea del siguiente formulario
    } else {
      navigate("/resumen", { state: { respuestas } });
    }
  };

  const handlePrevious = () => {
    if (index > 0) {
      const newIndex = index - 1;
      setIndex(newIndex);
      resetTextareas(newIndex); // Reinicia los textarea del formulario anterior
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">{t(formulario.titulo)}</h2>
      <form className="mt-4" onSubmit={(e) => e.preventDefault()}>
        {formulario.preguntas.map((pregunta) => {
          switch (pregunta.tipo) {
            case "text":
              return (
                <div key={pregunta.id} className="mb-4">
                  <label className="block font-medium">
                    {t(pregunta.pregunta)}
                  </label>
                  <input
                    type="text"
                    name={pregunta.id}
                    value={(respuestas[pregunta.id] as string) || ""}
                    onChange={handleChange}
                    className="w-full border p-2 rounded mt-1"
                    required
                  />
                </div>
              );
            case "select":
              return (
                <div key={pregunta.id} className="mb-4">
                  <label className="block font-medium">
                    {t(pregunta.pregunta)}
                  </label>
                  <select
                    name={pregunta.id}
                    value={(respuestas[pregunta.id] as string) || ""}
                    onChange={handleChange}
                    className="w-full border p-2 rounded mt-1"
                    required
                  >
                    <option value="" disabled className="bg-black">
                      {t("formulario.selecciona")}
                    </option>
                    {pregunta.opciones && Array.isArray(pregunta.opciones)
                      ? pregunta.opciones.map((opcion, idx) => (
                          <option
                            key={idx}
                            value={opcion.toString()}
                            className="bg-black"
                          >
                            {t(opcion.toString())}
                          </option>
                        ))
                      : null}
                  </select>
                </div>
              );
            case "check":
              return (
                <div key={pregunta.id} className="mb-4">
                  <label className="block font-medium">
                    {t(pregunta.pregunta)}
                  </label>
                  {pregunta.opciones?.map((opcion, idx) => (
                    <div key={idx} className="flex items-center">
                      <input
                        type="checkbox"
                        name={pregunta.id}
                        value={opcion}
                        onChange={handleCheckboxChange}
                        checked={
                          Array.isArray(respuestas[pregunta.id]) &&
                          (respuestas[pregunta.id] as string[]).includes(opcion)
                        }
                        className="mr-2"
                        required={
                          !Array.isArray(respuestas[pregunta.id]) ||
                          (respuestas[pregunta.id] as string[]).length === 0
                        }
                      />
                      <label>{t(opcion)}</label>
                    </div>
                  ))}
                </div>
              );
            case "textarea":
            
              return (
                <div key={pregunta.id} className="mb-4">
                  <label className="block font-medium">
                    {t(pregunta.pregunta)}
                  </label>
                  <textarea
                  
                    name={pregunta.id}
                    value={(respuestas[pregunta.id] as string) || ""}
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
        <div className="mt-4 flex space-x-4">
          {index > 0 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="bg-gray-500 text-white py-2 px-4 rounded"
            >
              {t("formulario.anterior")}
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            className="bg-green-500 text-white py-2 px-4 rounded"
          >
            {index < questionsData.length - 1
              ? t("formulario.siguiente")
              : t("formulario.finalizar")}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Formulario;
