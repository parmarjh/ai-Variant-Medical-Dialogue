import { db } from "@/db";
import { dbAppointmentValidator } from "@/lib/validators/db-appointment-validator";
import { AppointmentStatus, Severity } from "@prisma/client";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { patientId, doctorId, appointmentDate, ICD10Codes, condition, severity, status } = dbAppointmentValidator.parse(body);

        // Parse the appointmentDate string to a valid Date object
        const parsedDate = new Date(appointmentDate);

        // Check if the parsed date is valid
        if (isNaN(parsedDate.getTime())) {
            return new Response(JSON.stringify({ error: "Invalid appointment date" }), { status: 400 });
        }

        const appointment = await db.appointment.create({
            data: {
                patientId: patientId,
                doctorId: doctorId,
                icd10Codes: ICD10Codes,
                date: parsedDate.toISOString(), // Convert to ISO string for Prisma
                status: status as AppointmentStatus,
                condition: condition,
                severity: severity as Severity,
            },
            select: {
                id: true,
                date: true,
                status: true,
                severity: true,
            }   
        });

        return new Response(JSON.stringify({ appointment }), { status: 200 });
    } catch (error) {
        console.error('Error creating appointment:', error);
        return new Response(JSON.stringify({ error: 'Error creating appointment', details: error }), { status: 500 });
    }
}

// export async function POST(request: Request) {
// 	try {
// 		const body = await request.json();
// 		// Your appointment creation logic here
// 		const newAppointment = await db.appointment.create({
// 			data: body,
// 		});
// 		return new Response(JSON.stringify(newAppointment), { status: 200 });
// 	} catch (error) {
// 		console.error('Error creating appointment:', error);
// 		return new Response(JSON.stringify({ error: 'Error creating appointment' }), { status: 500 });
// 	}
// }