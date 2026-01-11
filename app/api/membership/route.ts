import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { validateSession } from '@/lib/auth';

// GET /api/membership - List all membership applications (admin only)
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await validateSession(token);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status) where.status = status;

    const applications = await prisma.membershipApplication.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching membership applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch membership applications' },
      { status: 500 }
    );
  }
}

// POST /api/membership - Create a new membership application (public)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      professionalGrade,
      otherProfessionalGrade,
      medicalSpecialty,
      academicDegree,
      institutionalAffiliation,
      membershipType,
      researchInterests,
      gdprConsent,
      feeConsent,
      newsletterConsent,
    } = body;

    // Validation
    if (!firstName || !lastName || !email || !professionalGrade || !medicalSpecialty || !institutionalAffiliation || !membershipType || !researchInterests) {
      return NextResponse.json(
        { error: 'Toate câmpurile obligatorii trebuie completate' },
        { status: 400 }
      );
    }

    // Validate consents
    if (!gdprConsent || !feeConsent) {
      return NextResponse.json(
        { error: 'Acordurile obligatorii trebuie bifate' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Adresa de email nu este validă' },
        { status: 400 }
      );
    }

    // Check if email already exists in pending/approved applications
    const existingApplication = await prisma.membershipApplication.findFirst({
      where: {
        email,
        status: {
          in: ['pending', 'approved']
        }
      }
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'Există deja o cerere activă pentru acest email' },
        { status: 400 }
      );
    }

    const application = await prisma.membershipApplication.create({
      data: {
        firstName,
        lastName,
        email,
        professionalGrade,
        otherProfessionalGrade: professionalGrade === 'alta' ? otherProfessionalGrade : null,
        medicalSpecialty,
        academicDegree: academicDegree || null,
        institutionalAffiliation,
        membershipType,
        researchInterests,
        gdprConsent,
        feeConsent,
        newsletterConsent: newsletterConsent || false,
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error('Error creating membership application:', error);
    return NextResponse.json(
      { error: 'Eroare la trimiterea cererii' },
      { status: 500 }
    );
  }
}

// PUT /api/membership - Update membership application status (admin only)
export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await validateSession(token);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, reviewNotes } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID și status sunt obligatorii' },
        { status: 400 }
      );
    }

    const application = await prisma.membershipApplication.update({
      where: { id },
      data: {
        status,
        reviewNotes: reviewNotes || null,
        reviewedAt: new Date(),
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error updating membership application:', error);
    return NextResponse.json(
      { error: 'Failed to update membership application' },
      { status: 500 }
    );
  }
}

// DELETE /api/membership - Delete a membership application (admin only)
export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await validateSession(token);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }

    await prisma.membershipApplication.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting membership application:', error);
    return NextResponse.json(
      { error: 'Failed to delete membership application' },
      { status: 500 }
    );
  }
}
