import { ZodSchema, ZodIssue } from 'zod'

export const zodResolver =
  <T extends Record<string, unknown>>(schema: ZodSchema<T>) =>
  async (values: T) => {
    const result = schema.safeParse(values)
    if (result.success) {
      return { values: result.data, errors: {} }
    }

    const errors = result.error.errors.reduce(
      (
        acc: Record<string, { type: string; message: string }>,
        current: ZodIssue
      ) => {
        const path = current.path.join('.')
        acc[path] = {
          type: current.code,
          message: current.message,
        }
        return acc
      },
      {}
    )

    return { values: {}, errors }
  }
