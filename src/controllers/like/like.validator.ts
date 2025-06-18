import { z } from "zod"

const ValidateLike = {
  validateCreateLike: z.object({
    postID: z.string(),
    userID: z.string()
  }),
}

export type ValidateCreateLike = z.infer <typeof ValidateLike["validateCreateLike"]>
export default ValidateLike