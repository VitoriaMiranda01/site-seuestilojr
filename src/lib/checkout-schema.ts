import { z } from "zod";

export const cartItemSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().nullable(),
  name: z.string(),
  variantLabel: z.string().nullable(),
  unitPrice: z.number().positive(),
  quantity: z.number().int().positive(),
  imageUrl: z.string().nullable(),
  isKit: z.boolean().optional(),
});

export const addressSchema = z.object({
  recipientName: z.string().min(2),
  zipCode: z.string().min(8),
  street: z.string().min(2),
  number: z.string().min(1),
  complement: z.string().optional().nullable(),
  neighborhood: z.string().min(2),
  city: z.string().min(2),
  state: z.string().min(2).max(2),
});

export const checkoutSchema = z.object({
  items: z.array(cartItemSchema).min(1),
  address: addressSchema,
  couponCode: z.string().optional().nullable(),
  guestEmail: z.string().email().optional(),
  guestName: z.string().optional(),
  guestPhone: z.string().optional(),
  paymentMethod: z.enum(["card", "pix"]).default("card"),
});

export type CheckoutPayload = z.infer<typeof checkoutSchema>;
