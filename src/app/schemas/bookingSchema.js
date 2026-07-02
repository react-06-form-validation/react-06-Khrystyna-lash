import { z } from 'zod';


export const createBookingSchema = (availableTimeSlots = []) =>
  z.object({
    bookerName: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters'),

    // Optional: empty string is allowed, but a non-empty value must be a valid email.
    bookerEmail: z
      .string()
      .trim()
      .email('Please enter a valid email address')
      .optional()
      .or(z.literal('')),

    eventName: z
      .string()
      .trim()
      .min(2, 'Event name must be at least 2 characters'),

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
      .max(10, 'There can be at most 10 guests'),

    
    timeSlot:
      availableTimeSlots.length > 0
        ? z.enum(availableTimeSlots, {
            errorMap: () => ({
              message: 'Please select one of the available time slots',
            }),
          })
        : z.string().min(1, 'Please select a time slot'),

    eventLink: z
      .string()
      .trim()
      .min(1, 'Event link is required')
      .url('Please enter a valid URL'),
  });

export default createBookingSchema;
