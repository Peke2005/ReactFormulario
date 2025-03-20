import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import questionsData from "../data/questions.json";
import "../style/formulario.css";

type Respuestas = Record<string, string | string[]>;

interface Restricciones {
  min?: number;
  max?: number;
}

interface Validacion {
  min_edad?: number;
  formato?: string;
  dominio?: string;
  max_seleccionados?: number;
}

interface Pregunta {
  id: string;
  tipo: "text" | "select" | "check" | "textarea";
  pregunta: string;
  opciones?: string[];
  restricciones?: Restricciones;
  validacion?: Validacion;
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
    const { name, value } = e.target;
    setRespuestas((prev) => ({
      ...prev,
      [name]: value,
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

  const validateField = (
    pregunta: Pregunta,
    respuesta: string | string[] | undefined
  ) => {
    const restricciones = pregunta.restricciones || {};
    const validacion = pregunta.validacion || {};

    // Validación básica de campo requerido
    if (pregunta.tipo === "check") {
      if (!Array.isArray(respuesta) || respuesta.length === 0)
        return "formulario.error_selecciona_una_opcion";
      if (
        validacion.max_seleccionados &&
        respuesta.length > validacion.max_seleccionados
      ) {
        return {
          key: "formulario.error_max_seleccionados",
          values: { max: validacion.max_seleccionados },
        };
      }
    } else if (
      !respuesta ||
      (typeof respuesta === "string" && respuesta.trim() === "")
    ) {
      return "formulario.error_campo_requerido";
    }

    // Validación de longitud
    if (
      typeof respuesta === "string" &&
      (pregunta.tipo === "text" || pregunta.tipo === "textarea")
    ) {
      if (restricciones.min && respuesta.length < restricciones.min) {
        return {
          key: "formulario.error_min_caracteres",
          values: { min: restricciones.min },
        };
      }
      if (restricciones.max && respuesta.length > restricciones.max) {
        return {
          key: "formulario.error_max_caracteres",
          values: { max: restricciones.max },
        };
      }
    }

    // Validación específica
    if (
      pregunta.id === "fecha_nacimiento" &&
      typeof respuesta === "string" &&
      validacion.min_edad
    ) {
      const birthDate = new Date(respuesta);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      if (age < validacion.min_edad) {
        return {
          key: "formulario.error_min_edad",
          values: { min_edad: validacion.min_edad },
        };
      }
    }

    if (pregunta.id === "email" && typeof respuesta === "string") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (validacion.formato === "email" && !emailRegex.test(respuesta)) {
        return "formulario.error_email_invalido";
      }
      if (validacion.dominio && !respuesta.endsWith(`@${validacion.dominio}`)) {
        return {
          key: "formulario.error_dominio",
          values: { dominio: validacion.dominio },
        };
      }
    }

    return "";
  };

  const isFormValid = () => {
    return formulario.preguntas.every((pregunta) => {
      const error = validateField(pregunta, respuestas[pregunta.id]);
      return !error;
    });
  };

  const resetTextareas = (newIndex: number) => {
    const newFormulario = questionsData[newIndex] as FormularioData;
    const resetValues: Respuestas = {};
    newFormulario.preguntas.forEach((pregunta) => {
      if (pregunta.tipo === "textarea") {
        resetValues[pregunta.id] = "";
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
      resetTextareas(newIndex);
    } else {
      navigate("/resumen", { state: { respuestas } });
    }
  };

  const handlePrevious = () => {
    if (index > 0) {
      const newIndex = index - 1;
      setIndex(newIndex);
      resetTextareas(newIndex);
    }
  };

  return (
    <div className="p-6 mt-[20%]">
      <h2 className="text-xl font-semibold">{t(formulario.titulo)}</h2>
      <form className="mt-4" onSubmit={(e) => e.preventDefault()}>
        {formulario.preguntas.map((pregunta) => {
          const respuesta = respuestas[pregunta.id];
          const error = validateField(pregunta, respuesta);

          const errorMessage =
            typeof error === "string" ? t(error) : error ? t(error.key, error.values) : "";

          switch (pregunta.tipo) {
            case "text":
              return (
                <div key={pregunta.id} className="mb-4">
                  <label className="block font-medium">
                    {t(pregunta.pregunta)}
                  </label>
                  <input
                    type={pregunta.id === "fecha_nacimiento" ? "date" : "text"}
                    name={pregunta.id}
                    value={(respuesta as string) || ""}
                    onChange={handleChange}
                    className={`w-full border p-2 rounded mt-1 ${
                      error ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {error && (
                    <span className="text-red-500 text-sm">{errorMessage}</span>
                  )}
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
                    value={(respuesta as string) || ""}
                    onChange={handleChange}
                    className={`w-full border p-2 rounded mt-1 ${
                      error ? "border-red-500" : ""
                    }`}
                    required
                  >
                    <option value="" disabled>
                      {t("formulario.selecciona")}
                    </option>
                    {pregunta.opciones?.map((opcion, idx) => (
                      <option key={idx} value={opcion}>
                        {t(opcion)}
                      </option>
                    ))}
                  </select>
                  {error && (
                    <span className="text-red-500 text-sm">{errorMessage}</span>
                  )}
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
                          Array.isArray(respuesta) && respuesta.includes(opcion)
                        }
                        className="mr-2"
                      />
                      <label>{t(opcion)}</label>
                    </div>
                  ))}
                  {error && (
                    <span className="text-red-500 text-sm">{errorMessage}</span>
                  )}
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
                    value={(respuesta as string) || ""}
                    onChange={handleChange}
                    className={`w-full border p-2 rounded mt-1 ${
                      error ? "border-red-500" : ""
                    }`}
                    required
                    rows={4}
                  />
                  {error && (
                    <span className="text-red-500 text-sm">{errorMessage}</span>
                  )}
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
            disabled={!isFormValid()}
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