import { z } from "zod"

const ValidateComment = {
  validateCreateComment: z.object({
    comment: z.string(),
    postID: z.string()
  }),
  validateUpdateComment: z.object({
    comment: z.string(),
  }),
}

export type ValidateUpdateComment = z.infer <typeof ValidateComment["validateUpdateComment"]>
export type ValidateCreateComment = z.infer <typeof ValidateComment["validateCreateComment"]>
export default ValidateComment