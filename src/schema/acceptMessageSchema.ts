import { z } from "zod";

export const sigIn= z.object({
    acceptMessage:z.boolean()
})