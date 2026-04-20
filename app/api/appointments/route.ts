import { NextRequest, NextResponse } from 'next/server';
import type { Appointment } from '@/lib/types';

const appointments: Appointment[] = [];

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body?.type || !body?.date || !body?.time || !body?.email) {
    return NextResponse.json(
      { success: false, error: 'Missing required fields: type, date, time, email' },
      { status: 400 }
    );
  }

  // Check for conflicts (simple check in production use calendar API)
  const conflict = appointments.find(
    a => a.date === body.date && a.time === body.time && a.status !== 'cancelled'
  );

  if (conflict) {
    return NextResponse.json(
      { success: false, error: 'This time slot is already booked. Please choose another.' },
      { status: 409 }
    );
  }

  const appointment: Appointment = {
    id: `appt-${Date.now()}`,
    type: body.type,
    date: body.date,
    time: body.time,
    firstName: body.firstName ?? '',
    lastName: body.lastName ?? '',
    email: body.email,
    phone: body.phone ?? '',
    notes: body.notes,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  appointments.push(appointment);

  // In production: send confirmation email, add to Google Calendar
  // await sendAppointmentConfirmation(appointment);

  return NextResponse.json({
    success: true,
    data: appointment,
    message: 'Appointment confirmed! You will receive a confirmation email shortly.',
  }, { status: 201 });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (date) {
    // Return booked time slots for a specific date
    const bookedSlots = appointments
      .filter(a => a.date === date && a.status !== 'cancelled')
      .map(a => a.time);

    return NextResponse.json({ success: true, data: { date, bookedSlots } });
  }

  return NextResponse.json({ success: true, data: appointments });
}
