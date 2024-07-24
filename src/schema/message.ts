import { z } from "zod";

export const message= z.object({
content:z.string().min(6,"Content should be of atleast 6 character").max(300,"Content should be no more than 300 characters")
})