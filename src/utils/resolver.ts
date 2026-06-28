import { ZodSchema, ZodIssue } from 'zod'

export const zodResolver =
  (schema: ZodSchema) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (values: any): Promise<any> => {
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
