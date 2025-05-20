import z from "zod";

const TestValidator = {
  validateCreateTest: z.object({
    name: z.string()
  })
}

export type ValidateCreateTest = z.infer <typeof TestValidator["validateCreateTest"]>
export default TestValidator
