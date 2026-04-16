const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  // ─── Clear existing data ──────────────────────────────────────────
  await prisma.booking.deleteMany();
  await prisma.eventType.deleteMany();
  await prisma.dateOverride.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.schedule.deleteMany();

  // ─── Seed Default Schedule ─────────────────────────────────────────
  const schedule = await prisma.schedule.create({
    data: {
      name: "Working hours",
      isDefault: true,
      timezone: "Asia/Kolkata",
    },
  });
  console.log(`✅ Created default schedule (id: ${schedule.id})`);

  // ─── Seed Event Types ─────────────────────────────────────────────
  const eventTypes = await Promise.all([
    prisma.eventType.create({
      data: { name: "Quick Chat", duration: 15, slug: "quick-chat", scheduleId: schedule.id },
    }),
    prisma.eventType.create({
      data: { name: "Standard Meeting", duration: 30, slug: "standard-meeting", scheduleId: schedule.id },
    }),
    prisma.eventType.create({
      data: { name: "Deep Dive", duration: 60, slug: "deep-dive", scheduleId: schedule.id },
    }),
  ]);
  console.log(`✅ Created ${eventTypes.length} event types`);

  // ─── Seed Availability (Mon-Fri, 9 AM – 5 PM) ────────────────────
  const availabilities = [];
  for (let day = 1; day <= 5; day++) {
    // Monday=1 through Friday=5
    availabilities.push(
      prisma.availability.create({
        data: {
          scheduleId: schedule.id,
          dayOfWeek: day,
          startTime: "09:00",
          endTime: "17:00",
          timezone: "Asia/Kolkata",
        },
      })
    );
  }
  const createdAvailabilities = await Promise.all(availabilities);
  console.log(`✅ Created ${createdAvailabilities.length} availability slots (Mon-Fri)`);

  // ─── Seed Sample Bookings ─────────────────────────────────────────
  const bookings = await Promise.all([
    prisma.booking.create({
      data: {
        eventTypeId: eventTypes[0].id,
        name: "Alice Johnson",
        email: "alice@example.com",
        date: new Date("2026-04-20"),
        time: "10:00",
      },
    }),
    prisma.booking.create({
      data: {
        eventTypeId: eventTypes[1].id,
        name: "Bob Smith",
        email: "bob@example.com",
        date: new Date("2026-04-21"),
        time: "14:00",
      },
    }),
    prisma.booking.create({
      data: {
        eventTypeId: eventTypes[2].id,
        name: "Carol Williams",
        email: "carol@example.com",
        date: new Date("2026-04-22"),
        time: "11:00",
      },
    }),
  ]);
  console.log(`✅ Created ${bookings.length} sample bookings`);

  console.log("\n🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
