import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';



async function main() {
  console.log('🌱 Seeding database...');

  // Create initial admin user
  const adminEmail = 'admin@scipi.ro';
  const adminPassword = 'admin123'; // Change this in production!
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: passwordHash,
      name: 'SCIPI Admin',
    },
  });

  console.log('✅ Created admin user:', {
    email: admin.email,
    name: admin.name,
    password: adminPassword,
  });

  // Create second admin user
  const adminEmail2 = 'web.scipi@yahoo.com';
  const adminPassword2 = 'Scipiweb2025*';
  const passwordHash2 = await bcrypt.hash(adminPassword2, 10);

  const admin2 = await prisma.admin.upsert({
    where: { email: adminEmail2 },
    update: {},
    create: {
      email: adminEmail2,
      passwordHash: passwordHash2,
      name: 'SCIPI Web Admin',
    },
  });

  console.log('✅ Created second admin user:', {
    email: admin2.email,
    name: admin2.name,
    password: adminPassword2,
  });

  // Create some sample partners
  const partners = await Promise.all([
    prisma.partner.upsert({
      where: { id: 'sample-institutional-1' },
      update: {},
      create: {
        id: 'sample-institutional-1',
        name: 'Sample Institutional Partner',
        logoUrl: '/placeholder-logo.png',
        type: 'institutional',
        websiteUrl: 'https://example.com',
        displayOrder: 1,
        isActive: true,
      },
    }),
    prisma.partner.upsert({
      where: { id: 'sample-international-1' },
      update: {},
      create: {
        id: 'sample-international-1',
        name: 'Sample International Society',
        logoUrl: '/placeholder-logo.png',
        type: 'international',
        websiteUrl: 'https://example.com',
        displayOrder: 2,
        isActive: true,
      },
    }),
    prisma.partner.upsert({
      where: { id: 'sample-sponsor-1' },
      update: {},
      create: {
        id: 'sample-sponsor-1',
        name: 'Sample Sponsor',
        logoUrl: '/placeholder-logo.png',
        type: 'sponsor',
        websiteUrl: 'https://example.com',
        displayOrder: 3,
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ Created ${partners.length} sample partners`);

  // Create a sample project
  const project = await prisma.project.upsert({
    where: { id: 'sample-project-1' },
    update: {},
    create: {
      id: 'sample-project-1',
      title: 'Sample Research Project',
      slug: 'sample-research-project',
      shortDescription: 'This is a sample research project short description for the card view.',
      detailedDescription: '<p>This is a sample research project detailed description. Replace with actual project details.</p>',
      status: 'ongoing',
      startDate: new Date('2024-01-01'),
      isActive: true,
    },
  });

  console.log('✅ Created sample project:', project.title);

  // Create a sample event
  const event = await prisma.event.upsert({
    where: { id: 'sample-event-1' },
    update: {},
    create: {
      id: 'sample-event-1',
      title: 'Sample Medical Conference',
      slug: 'sample-medical-conference',
      type: 'conference',
      shortDescription: 'This is a sample event short description for the card view.',
      detailedDescription: '<p>This is a sample event detailed description. Replace with actual event details including committees, program, location, etc.</p>',
      imageUrl: null,
      eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      isActive: true,
    },
  });

  console.log('✅ Created sample event:', event.title);

  // Create a sample resource
  const resource = await prisma.resource.upsert({
    where: { id: 'sample-resource-1' },
    update: {},
    create: {
      id: 'sample-resource-1',
      title: 'Sample Medical Guide',
      slug: 'sample-medical-guide',
      description: 'This is a sample resource description. Replace with actual resource details.',
      url: 'https://example.com/guide.pdf',
      type: 'guide',
      isActive: true,
    },
  });

  console.log('✅ Created sample resource:', resource.title);

  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📝 Admin credentials:');
  console.log(`   Admin 1 - Email: ${adminEmail}`);
  console.log(`   Admin 1 - Password: ${adminPassword}`);
  console.log(`   Admin 2 - Email: ${adminEmail2}`);
  console.log(`   Admin 2 - Password: ${adminPassword2}`);
  console.log('\n⚠️  Remember to change the admin password in production!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

