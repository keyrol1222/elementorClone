import bcrypt from "bcryptjs";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const defaultPageContent = {
  version: 1,
  root: [
    {
      id: "section-home-hero",
      type: "section",
      props: { fullWidth: true },
      style: {
        desktop: {
          paddingTop: "80px",
          paddingBottom: "80px",
          backgroundColor: "#f8fafc",
        },
      },
      children: [
        {
          id: "container-home-hero",
          type: "container",
          props: { maxWidth: "1200px" },
          style: { desktop: { textAlign: "center" } },
          children: [
            {
              id: "heading-home",
              type: "heading",
              props: { text: "Welcome to PageCraft", tag: "h1" },
              style: {
                desktop: {
                  fontSize: "48px",
                  fontWeight: "700",
                  marginBottom: "16px",
                },
              },
              children: [],
            },
            {
              id: "text-home",
              type: "text",
              props: {
                text: "Start building your website with our visual editor.",
              },
              style: {
                desktop: {
                  fontSize: "18px",
                  color: "#64748b",
                  marginBottom: "24px",
                },
              },
              children: [],
            },
            {
              id: "button-home",
              type: "button",
              props: { text: "Get Started", href: "#" },
              style: {
                desktop: {
                  backgroundColor: "#4f46e5",
                  color: "#ffffff",
                  padding: "12px 24px",
                  borderRadius: "8px",
                },
              },
              children: [],
            },
          ],
        },
      ],
    },
  ],
};

async function main() {
  const passwordHash = await bcrypt.hash("password123", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@pagecraft.dev" },
    update: {},
    create: {
      email: "demo@pagecraft.dev",
      name: "Demo User",
      passwordHash,
      role: "USER",
    },
  });

  const project = await prisma.project.upsert({
    where: {
      userId_slug: {
        userId: user.id,
        slug: "demo-website",
      },
    },
    update: {},
    create: {
      name: "Demo Website",
      slug: "demo-website",
      description: "A sample project to explore PageCraft",
      userId: user.id,
    },
  });

  const homePage = await prisma.page.upsert({
    where: {
      projectId_slug: {
        projectId: project.id,
        slug: "home",
      },
    },
    update: {},
    create: {
      projectId: project.id,
      title: "Home",
      slug: "home",
      status: "DRAFT",
      content: defaultPageContent,
      meta: {
        title: "Home — Demo Website",
        description: "Welcome to the demo website built with PageCraft",
      },
      sortOrder: 0,
    },
  });

  await prisma.page.upsert({
    where: {
      projectId_slug: {
        projectId: project.id,
        slug: "about",
      },
    },
    update: {},
    create: {
      projectId: project.id,
      title: "About",
      slug: "about",
      status: "DRAFT",
      content: { version: 1, root: [] },
      meta: {
        title: "About — Demo Website",
        description: "About our demo website",
      },
      sortOrder: 1,
    },
  });

  await prisma.template.upsert({
    where: { id: "seed-hero-template" },
    update: {},
    create: {
      id: "seed-hero-template",
      userId: user.id,
      name: "Hero Section",
      description: "A simple hero section with heading, text, and button",
      type: "SECTION",
      content: defaultPageContent.root[0],
      isPublic: true,
    },
  });

  await prisma.revision.upsert({
    where: {
      pageId_version: {
        pageId: homePage.id,
        version: 1,
      },
    },
    update: {},
    create: {
      pageId: homePage.id,
      userId: user.id,
      version: 1,
      content: defaultPageContent,
      message: "Initial seed revision",
    },
  });

  console.log("Seed completed successfully");
  console.log("Demo user: demo@pagecraft.dev / password123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
