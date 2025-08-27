import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface JsonPlaceholderUser {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

interface JsonPlaceholderPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

async function seedUsers() {
  console.log("Seeding users...");

  try {
    // Fetch users from the given api
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const users: JsonPlaceholderUser[] = await response.json();

    // Insert users if they don't exist
    for (const user of users) {
      const existingUser = await prisma.user.findUnique({
        where: { username: user.username },
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            address: user.address,
            phone: user.phone,
            website: user.website,
            company: user.company,
          },
        });
        console.log(`Created user: ${user.name}`);
      } else {
        console.log(`User already exists: ${user.name}`);
      }
    }

    console.log("Users seeding completed");
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
}

async function seedPosts() {
  console.log("Seeding posts...");

  try {
    // Fetch posts from JSONPlaceholder
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const posts: JsonPlaceholderPost[] = await response.json();

    // Insert posts if they don't exist
    for (const post of posts) {
      // Check if the user exists
      const userExists = await prisma.user.findUnique({
        where: { id: post.userId },
      });

      if (!userExists) {
        console.log(
          `Skipping post ${post.id}: User ${post.userId} doesn't exist`
        );
        continue;
      }

      // Check if post already exists (by title and userId combination)
      const existingPost = await prisma.post.findFirst({
        where: {
          title: post.title,
          userId: post.userId,
        },
      });

      if (!existingPost) {
        await prisma.post.create({
          data: {
            title: post.title,
            body: post.body,
            userId: post.userId,
          },
        });
        console.log(`Created post: ${post.title.substring(0, 30)}...`);
      } else {
        console.log(
          `Post already exists: ${post.title.substring(0, 30)}...`
        );
      }
    }

    console.log("Posts seeding completed");
  } catch (error) {
    console.error("Error seeding posts:", error);
    throw error;
  }
}

async function main() {
  console.log("Starting database seeding...");

  try {
    // Seed users first (posts depend on users)
    await seedUsers();
    // Then seed posts
    await seedPosts();

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Database seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the seed
main();
