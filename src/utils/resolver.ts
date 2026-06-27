import { ZodSchema } from 'zod'

export const zodResolver = (schema: ZodSchema) => async (values: any) => {
  const result = schema.safeParse(values)
  if (result.success) {
    return { values: result.data, errors: {} }
  }

  const errors = result.error.errors.reduce((acc: any, current: any) => {
    const path = current.path.join('.')
    acc[path] = {
      type: current.code,
      message: current.message,
    }
    return acc
  }, {})

  return { values: {}, errors }
}
