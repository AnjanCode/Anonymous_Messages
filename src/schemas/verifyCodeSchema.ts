import { z } from "zod";

export const verifyCodeSchema = z.object({
    code : z.string().length(6, "Code length should be 6 digit.")
})