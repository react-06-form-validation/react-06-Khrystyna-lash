import { z } from 'zod';


export const createBookingSchema = (availableTimeSlots = []) =>
  z.object({
    bookerName: z
      .string()
      .trim()
      .min(2, 'Booker name must be at least 2 characters long'),

    // Optional: empty string is allowed, but a non-empty value must be a valid email.
    bookerEmail: z
      .string()
      .trim()
      .email('Invalid email address')
      .optional()
      .or(z.literal('')),

    eventName: z
      .string()
      .trim()
      .min(2, 'Event name must be at least 2 characters long'),

    eventDate: z
      .string()
      .min(1, 'Event date is required')
      .refine((value) => !Number.isNaN(new Date(value).getTime()), {
        message: 'Please enter a valid date',
      })
      .refine((value) => new Date(value).getTime() > Date.now(), {
        message: 'Event date must be in the future',
      }),

    numberOfGuests: z.coerce
      .number({ invalid_type_error: 'Number of guests is required' })
      .int('Number of guests must be a whole number')
      .min(1, 'There must be at least 1 guest')
      .max(10, 'Number of Guests must be less than or equal to 10'),

    
    timeSlot:
      availableTimeSlots.length > 0
        ? z.enum(availableTimeSlots, {
            errorMap: () => ({
              message: 'Selected time slot is unavailable',
            }),
          })
        : z.string().min(1, 'Please select a time slot'),

    eventLink: z
      .string()
      .trim()
      .min(1, 'Event link is required')
      .url('Invalid URL. Please enter a valid event link'),
  });

export default createBookingSchema;
