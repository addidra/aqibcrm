import { z } from "zod";

export const CoordinatesSchema = z.object({
    lat: z.number(),
    lng: z.number(),
});

export const LocationSchema = z.object({
    emirate: z.string().min(1),
    city: z.string().min(1),
    buildingName: z.string().optional(),
    community: z.string().optional(),
    street: z.string().optional(),
    coordinates: CoordinatesSchema,
});

export const AgentSchema = z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
    email: z.email(),
    company: z.string().optional(),
});

export const PaymentPlanSchema = z.object({
    available: z.boolean(),
});
export const ListingSchema = z.object({
    _id: z.string().optional(),
    title: z.string().min(3),
    description: z.string().min(10),
    price: z.number().min(0),
    currency: z.string(),

    propertyType: z.enum(["apartment", "villa", "townhouse"]),
    purpose: z.enum(["sale", "rent"]),

    sizeSqFt: z.number(),
    bedrooms: z.number(),
    bathrooms: z.number(),
    parkingSpots: z.number().optional(),

    location: LocationSchema,

    status: z.enum(["draft", "published"]),
    isPublished: z.boolean(),

    amenities: z.array(z.string()).optional(),
    developer: z.string().optional(),
    completionStatus: z.enum(["ready", "off-plan"]).optional(),
    yearBuilt: z.number().optional(),

    paymentPlan: PaymentPlanSchema.optional(),
    ownership: z.enum(["freehold", "leasehold"]).optional(),
    agent: AgentSchema.optional(),

    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

// TypeScript type for use in components
export type Listing = z.infer<typeof ListingSchema>;
