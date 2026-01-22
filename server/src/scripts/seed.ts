import dotenv from "dotenv";
import { connectDB } from "../config/db";
import User from "../models/User";
import ORS from "../models/ORS";

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await ORS.deleteMany({});
    console.log("Cleared existing data");

    // Create users
    const admin = await User.create({
      username: "admin",
      email: "admin@ors.com",
      password: "admin123",
      role: "admin",
    });

    const inspector = await User.create({
      username: "inspector",
      email: "inspector@ors.com",
      password: "inspector123",
      role: "inspector",
    });

    const viewer = await User.create({
      username: "viewer",
      email: "viewer@ors.com",
      password: "viewer123",
      role: "viewer",
    });

    console.log("✓ Created 3 users (admin, inspector, viewer)");

    // Create 5 ORS plans distributed across user types
    const orsData = [
      // Admin created ORS plans (2 plans)
      {
        vehicle: "Truck-101",
        roadWorthinessScore: "85%",
        overallTrafficScore: "A",
        actionRequired: "Regular maintenance check scheduled for next month",
        inspector: admin._id,
        documents: [
          {
            textDoc: [
              {
                label: "Engine Inspection",
                description:
                  "Engine is in good condition. Oil changed recently.",
              },
            ],
            attachments: [],
          },
        ],
      },
      {
        vehicle: "Van-202",
        roadWorthinessScore: "55%",
        overallTrafficScore: "D",
        actionRequired:
          "URGENT: Major engine repair required. Vehicle grounded until fixed",
        inspector: admin._id,
        documents: [
          {
            textDoc: [
              {
                label: "Critical Engine Failure",
                description:
                  "Engine overheating. Coolant leak detected. Vehicle unsafe for operation.",
              },
            ],
            attachments: [],
          },
        ],
      },

      // Inspector created ORS plans (3 plans)
      {
        vehicle: "Truck-305",
        roadWorthinessScore: "91%",
        overallTrafficScore: "A",
        actionRequired:
          "No immediate action required. Vehicle in excellent condition",
        inspector: inspector._id,
        documents: [
          {
            textDoc: [
              {
                label: "Full Vehicle Inspection",
                description:
                  "All systems operational. Recent maintenance completed.",
              },
            ],
            attachments: [],
          },
        ],
      },
      {
        vehicle: "Bus-407",
        roadWorthinessScore: "68%",
        overallTrafficScore: "C",
        actionRequired:
          "Suspension system needs attention. Schedule repair within 1 week",
        inspector: inspector._id,
        documents: [
          {
            textDoc: [
              {
                label: "Suspension Assessment",
                description:
                  "Rear suspension showing signs of wear. Noise detected during test drive.",
              },
            ],
            attachments: [],
          },
        ],
      },
      {
        vehicle: "Van-512",
        roadWorthinessScore: "78%",
        overallTrafficScore: "B",
        actionRequired: "Replace windshield wipers and check electrical system",
        inspector: inspector._id,
        documents: [
          {
            textDoc: [
              {
                label: "Electrical and Safety Systems",
                description:
                  "Wipers worn out. Headlights functional but alignment needed.",
              },
            ],
            attachments: [],
          },
        ],
      },
    ];

    await ORS.insertMany(orsData);
    console.log(`✓ Created ${orsData.length} ORS plans`);

    console.log("\n=== Seed Complete ===");
    console.log("\nUser Credentials:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Admin:");
    console.log("  Email: admin@ors.com");
    console.log("  Password: admin123");
    console.log("\nInspector:");
    console.log("  Email: inspector@ors.com");
    console.log("  Password: inspector123");
    console.log("\nViewer:");
    console.log("  Email: viewer@ors.com");
    console.log("  Password: viewer123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
