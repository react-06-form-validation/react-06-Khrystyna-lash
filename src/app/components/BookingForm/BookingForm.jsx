'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { createBookingSchema } from '../../schemas/bookingSchema';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import styles from './BookingForm.module.css';

export default function BookingForm() {
  const [timeSlots, setTimeSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const response = await fetch('/api/time-slots');
        const slots = await response.json();
        setTimeSlots(slots);
      } catch (error) {
        console.error('Error fetching time slots:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTimeSlots();
  }, []);

  const resolver = useMemo(() => zodResolver(createBookingSchema(timeSlots)), [timeSlots]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver });

  const onSubmit = (data) => {
    alert('Booking successful!');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.inputGroup}>
        <label htmlFor="bookerName" className={styles.label}>
          Booker Name
        </label>
        <input {...register('bookerName')} id="bookerName" className={styles.input} />
        <ErrorMessage message={errors.bookerName?.message?.toString()} />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="bookerEmail" className={styles.label}>
          Booker Email
        </label>
        <input {...register('bookerEmail')} id="bookerEmail" className={styles.input} type="email" />
        <ErrorMessage message={errors.bookerEmail?.message?.toString()} />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="eventName" className={styles.label}>
          Event Name
        </label>
        <input {...register('eventName')} id="eventName" className={styles.input} />
        <ErrorMessage message={errors.eventName?.message?.toString()} />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="eventDate" className={styles.label}>
          Event Date
        </label>
        <input {...register('eventDate')} id="eventDate" className={styles.input} type="date" />
        <ErrorMessage message={errors.eventDate?.message?.toString()} />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="numberOfGuests" className={styles.label}>
          Number of Guests
        </label>
        <input {...register('numberOfGuests')} id="numberOfGuests" className={styles.input} type="number" />
        <ErrorMessage message={errors.numberOfGuests?.message?.toString()} />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="timeSlot" className={styles.label}>
          Time Slot
        </label>
        <select {...register('timeSlot')} id="timeSlot" className={styles.input}>
          <option value="">-- Select a time slot --</option>
          {timeSlots.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
        {isLoading && <p>Loading time slots...</p>}
        {!isLoading && timeSlots.length === 0 && <p>No time slots available.</p>}
        <ErrorMessage message={errors.timeSlot?.message?.toString()} />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="eventLink" className={styles.label}>
          Event Link (Online)
        </label>
        <input {...register('eventLink')} id="eventLink" className={styles.input} type="url" />
        <ErrorMessage message={errors.eventLink?.message?.toString()} />
      </div>

      <button className={styles.button} type="submit">
        Book Event
      </button>
    </form>
  );
}
