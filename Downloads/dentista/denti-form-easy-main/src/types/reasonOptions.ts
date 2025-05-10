
export type ReasonOption = {
  value: string;
  label: string;
};

export const reasonOptions = [
  { value: "checkup", label: "Consulta de rotina" },
  { value: "pain", label: "Dor" },
  { value: "aesthetic", label: "Estética" },
  { value: "cleaning", label: "Limpeza" },
  { value: "other", label: "Outro motivo" },
] as const;
