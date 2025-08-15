import { z } from "zod";

export const messageSchema = z.object({
    content : z.string().min(10, "Message should contain minimum 10 characters.").max(300, "Message should be under 300 charaters.")
})