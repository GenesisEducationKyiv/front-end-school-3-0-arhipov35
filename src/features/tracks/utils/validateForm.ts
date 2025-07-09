import { z } from "zod";
import { Result, ok, err } from "neverthrow";
import { FormDataSchema } from "../schemas/trackFormSchema";

export type FormData = z.infer<typeof FormDataSchema>;

export interface FormErrors {
  title?: string;
  artist?: string;
  album?: string;
  genres?: string;
  coverImage?: string;
}

export const validateForm = (formData: FormData): Result<FormData, FormErrors> => {
  const result = FormDataSchema.safeParse(formData);
  
  if (result.success) {
    return ok(result.data);
  }

  const zodErrors = result.error.flatten().fieldErrors;
  const newErrors = Object.entries(zodErrors).reduce(
    (acc, [key, messages]) => {
      if (messages?.length) {
        acc[key as keyof FormErrors] = messages[0];
      }
      return acc;
    },
    {} as FormErrors
  );

  return err(newErrors);
};