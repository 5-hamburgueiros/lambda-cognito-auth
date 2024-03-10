import { z } from 'zod';

export const cpfSchema = z.object({
  cpf: z.string().min(11).max(11),
});

export type cpfSchemaType = z.infer<typeof cpfSchema>;
