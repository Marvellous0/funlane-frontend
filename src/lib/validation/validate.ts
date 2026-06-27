import * as yup from 'yup';

export type FieldErrors<T> = Partial<Record<keyof T & string, string>>;

export interface ValidationResult<T> {
  values?: T;
  errors?: FieldErrors<T>;
}

/**
 * Validate `data` against a yup schema, collecting *all* failures into a flat
 * `{ field: message }` map (first message per field) for inline display.
 * Returns `{ values }` on success or `{ errors }` on failure.
 */
export async function validateSchema<T extends object>(
  schema: yup.Schema<T>,
  data: unknown,
): Promise<ValidationResult<T>> {
  try {
    const values = (await schema.validate(data, { abortEarly: false, stripUnknown: true })) as T;
    return { values };
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      const errors: FieldErrors<T> = {};
      for (const issue of err.inner.length ? err.inner : [err]) {
        const path = issue.path as (keyof T & string) | undefined;
        if (path && !errors[path]) errors[path] = issue.message;
      }
      return { errors };
    }
    throw err;
  }
}
