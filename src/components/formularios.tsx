// Importaciones necesarias para React, navegación, internacionalización y datos
import React, { useState } from "react"; // React y el hook useState para manejar el estado
import { useNavigate } from "react-router-dom"; // Hook para navegar entre rutas
import { useTranslation } from "react-i18next"; // Hook para manejar traducciones
import questionsData from "../data/questions.json"; // Datos del formulario desde un archivo JSON
import "../style/formulario.css"; // Estilos CSS para el componente

// Tipo para las respuestas: un objeto donde las claves son strings y los valores son string o array de strings
type Respuestas = Record<string, string | string[]>;

// Interfaz para restricciones de longitud mínima y máxima (opcional)
interface Restricciones {
  min?: number; // Longitud mínima del texto
  max?: number; // Longitud máxima del texto
}

// Interfaz para reglas de validación específicas (opcional)
interface Validacion {
  min_edad?: number; // Edad mínima para fechas
  formato?: string; // Formato esperado (ej. "email")
  dominio?: string; // Dominio requerido para emails
  max_seleccionados?: number; // Máximo de opciones seleccionables en checkboxes
}

// Interfaz para una pregunta del formulario
interface Pregunta {
  id: string; // Identificador único de la pregunta
  tipo: "text" | "select" | "check" | "textarea"; // Tipo de campo
  pregunta: string; // Texto de la pregunta
  opciones?: string[]; // Opciones para select o check (opcional)
  restricciones?: Restricciones; // Restricciones de longitud (opcional)
  validacion?: Validacion; // Reglas de validación (opcional)
}

// Interfaz para los datos de un formulario completo
interface FormularioData {
  titulo: string; // Título del formulario
  preguntas: Pregunta[]; // Lista de preguntas
}

// Componente principal del formulario
function Formulario() {
  const { t } = useTranslation(); // Hook para traducir textos
  const navigate = useNavigate(); // Hook para navegar a otras rutas
  const [index, setIndex] = useState(0); // Estado para el índice del formulario actual
  const [respuestas, setRespuestas] = useState<Respuestas>({}); // Estado para almacenar las respuestas

  const formulario = questionsData[index] as FormularioData; // Formulario actual basado en el índice

  // Maneja cambios en inputs de texto, select y textarea
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target; // Obtiene el nombre y valor del campo
    setRespuestas((prev) => ({
      ...prev,
      [name]: value, // Actualiza el estado con la nueva respuesta
    }));
  };

  // Maneja cambios en checkboxes (agrega o quita opciones)
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target; // Nombre, valor y estado del checkbox
    setRespuestas((prevState) => {
      const current = Array.isArray(prevState[name]) // Verifica si ya hay un array
        ? (prevState[name] as string[])
        : [];
      if (checked) {
        return { ...prevState, [name]: [...current, value] }; // Agrega la opción seleccionada
      } else {
        return { ...prevState, [name]: current.filter((v) => v !== value) }; // Quita la opción desmarcada
      }
    });
  };

  // Valida un campo según las reglas definidas
  const validateField = (
    pregunta: Pregunta,
    respuesta: string | string[] | undefined
  ) => {
    const restricciones = pregunta.restricciones || {}; // Restricciones por defecto vacías
    const validacion = pregunta.validacion || {}; // Validaciones por defecto vacías

    // Validación básica: campo requerido
    if (pregunta.tipo === "check") {
      if (!Array.isArray(respuesta) || respuesta.length === 0)
        return "Selecciona al menos una opción"; // Error si no hay selección
      if (
        validacion.max_seleccionados &&
        respuesta.length > validacion.max_seleccionados
      ) {
        return `Máximo ${validacion.max_seleccionados} opciones permitidas`; // Error si excede el máximo
      }
    } else if (
      !respuesta ||
      (typeof respuesta === "string" && respuesta.trim() === "")
    ) {
      return "Este campo es requerido"; // Error si el campo está vacío
    }

    // Validación de longitud para campos de texto
    if (
      typeof respuesta === "string" &&
      (pregunta.tipo === "text" || pregunta.tipo === "textarea")
    ) {
      if (restricciones.min && respuesta.length < restricciones.min) {
        return `Mínimo ${restricciones.min} caracteres`; // Error si es demasiado corto
      }
      if (restricciones.max && respuesta.length > restricciones.max) {
        return `Máximo ${restricciones.max} caracteres`; // Error si es demasiado largo
      }
    }

    // Validación específica para fecha de nacimiento (edad mínima)
    if (
      pregunta.id === "fecha_nacimiento" &&
      typeof respuesta === "string" &&
      validacion.min_edad
    ) {
      const birthDate = new Date(respuesta); // Convierte la fecha ingresada
      const today = new Date(); // Fecha actual
      let age = today.getFullYear() - birthDate.getFullYear(); // Calcula la edad
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--; // Ajusta la edad si aún no ha pasado el cumpleaños
      }
      if (age < validacion.min_edad) {
        return `Debes tener al menos ${validacion.min_edad} años`; // Error si es menor de edad
      }
    }

    // Validación específica para email
    if (pregunta.id === "email" && typeof respuesta === "string") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para email
      if (validacion.formato === "email" && !emailRegex.test(respuesta)) {
        return "Formato de email inválido"; // Error si no cumple el formato
      }
      if (validacion.dominio && !respuesta.endsWith(`@${validacion.dominio}`)) {
        return `El email debe ser del dominio ${validacion.dominio}`; // Error si no usa el dominio correcto
      }
    }

    return ""; // Sin errores
  };

  // Verifica si el formulario actual es válido
  const isFormValid = () => {
    return formulario.preguntas.every((pregunta) => {
      const error = validateField(pregunta, respuestas[pregunta.id]); // Valida cada pregunta
      return !error; // True si no hay errores
    });
  };

  // Resetea los campos textarea al cambiar de formulario
  const resetTextareas = (newIndex: number) => {
    const newFormulario = questionsData[newIndex] as FormularioData; // Nuevo formulario
    const resetValues: Respuestas = {};
    newFormulario.preguntas.forEach((pregunta) => {
      if (pregunta.tipo === "textarea") {
        resetValues[pregunta.id] = ""; // Resetea los textareas a vacío
      }
    });
    setRespuestas((prev) => ({ ...prev, ...resetValues })); // Actualiza el estado
  };

  // Maneja el botón "Siguiente" o "Finalizar"
  const handleNext = () => {
    if (!isFormValid()) {
      alert(t("formulario.completaTodos")); // Alerta si hay campos inválidos
      return;
    }
    if (index < questionsData.length - 1) {
      const newIndex = index + 1; // Avanza al siguiente formulario
      setIndex(newIndex);
      resetTextareas(newIndex); // Resetea textareas
    } else {
      navigate("/resumen", { state: { respuestas } }); // Navega al resumen si es el último
    }
  };

  // Maneja el botón "Anterior"
  const handlePrevious = () => {
    if (index > 0) {
      const newIndex = index - 1; // Retrocede al formulario anterior
      setIndex(newIndex);
      resetTextareas(newIndex); // Resetea textareas
    }
  };

  // Renderizado del componente
  return (
    <div className="p-6 mt-[20%]"> {/* Contenedor principal con padding y margen superior */}
      <h2 className="text-xl font-semibold">{t(formulario.titulo)}</h2> {/* Título traducido */}
      <form className="mt-4" onSubmit={(e) => e.preventDefault()}> {/* Formulario con prevención de envío */}
        {formulario.preguntas.map((pregunta) => {
          const respuesta = respuestas[pregunta.id]; // Respuesta actual para la pregunta
          const error = validateField(pregunta, respuesta); // Mensaje de error si lo hay

          // Renderiza el campo según su tipo
          switch (pregunta.tipo) {
            case "text":
              return (
                <div key={pregunta.id} className="mb-4"> {/* Contenedor del campo */}
                  <label className="block font-medium">{t(pregunta.pregunta)}</label> {/* Etiqueta traducida */}
                  <input
                    type={pregunta.id === "fecha_nacimiento" ? "date" : "text"} // Tipo dinámico
                    name={pregunta.id}
                    value={(respuesta as string) || ""} // Valor actual o vacío
                    onChange={handleChange} // Maneja cambios
                    className={`w-full border p-2 rounded mt-1 ${
                      error ? "border-red-500" : "" // Borde rojo si hay error
                    }`}
                    required // Campo obligatorio
                  />
                  {error && (
                    <span className="text-red-500 text-sm">{t(error)}</span> // Mensaje de error traducido
                  )}
                </div>
              );
            case "select":
              return (
                <div key={pregunta.id} className="mb-4">
                  <label className="block font-medium">{t(pregunta.pregunta)}</label>
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
                      {t("formulario.selecciona")} {/* Opción por defecto */}
                    </option>
                    {pregunta.opciones?.map((opcion, idx) => (
                      <option key={idx} value={opcion}>
                        {t(opcion)} {/* Opciones traducidas */}
                      </option>
                    ))}
                  </select>
                  {error && <span className="text-red-500 text-sm">{t(error)}</span>}
                </div>
              );
            case "check":
              return (
                <div key={pregunta.id} className="mb-4">
                  <label className="block font-medium">{t(pregunta.pregunta)}</label>
                  {pregunta.opciones?.map((opcion, idx) => (
                    <div key={idx} className="flex items-center"> {/* Checkbox individual */}
                      <input
                        type="checkbox"
                        name={pregunta.id}
                        value={opcion}
                        onChange={handleCheckboxChange}
                        checked={
                          Array.isArray(respuesta) && respuesta.includes(opcion) // Estado del checkbox
                        }
                        className="mr-2"
                      />
                      <label>{t(opcion)}</label> {/* Etiqueta traducida */}
                    </div>
                  ))}
                  {error && <span className="text-red-500 text-sm">{t(error)}</span>}
                </div>
              );
            case "textarea":
              return (
                <div key={pregunta.id} className="mb-4">
                  <label className="block font-medium">{t(pregunta.pregunta)}</label>
                  <textarea
                    name={pregunta.id}
                    value={(respuesta as string) || ""}
                    onChange={handleChange}
                    className={`w-full border p-2 rounded mt-1 ${
                      error ? "border-red-500" : ""
                    }`}
                    required
                    rows={4} // Altura fija
                  />
                  {error && <span className="text-red-500 text-sm">{t(error)}</span>}
                </div>
              );
            default:
              return null; // Caso no manejado
          }
        })}
        <div className="mt-4 flex space-x-4"> {/* Botones de navegación */}
          {index > 0 && ( // Botón "Anterior" solo si no es el primer formulario
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
            disabled={!isFormValid()} // Deshabilitado si el formulario no es válido
          >
            {index < questionsData.length - 1
              ? t("formulario.siguiente") // "Siguiente" si hay más formularios
              : t("formulario.finalizar")} // "Finalizar" si es el último
          </button>
        </div>
      </form>
    </div>
  );
}

export default Formulario; // Exporta el componente