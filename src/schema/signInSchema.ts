import { z } from "zod";

export const sigInschema= z.object({
    Identifier:z.string(),
    password:z.string()
})