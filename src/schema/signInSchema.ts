import { z } from "zod";

export const sigIn= z.object({
    Identifier:z.string(),
    password:z.string()
})