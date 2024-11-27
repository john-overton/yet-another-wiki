const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const reviews = [
  {
    userId: 2,
    rating: 5,
    review: "This wiki platform is exactly what our team needed! The interface is clean and intuitive, making documentation a breeze. The search functionality is particularly impressive."
  },
  {
    userId: 3,
    rating: 4,
    review: "Great platform with lots of useful features. The markdown support is excellent, though I'd love to see more customization options for the editor."
  },
  {
    userId: 4,
    rating: 5,
    review: "Absolutely love the dark mode and the ability to customize themes. It's made our documentation process so much more enjoyable and efficient."
  },
  {
    userId: 5,
    rating: 4,
    review: "Solid wiki solution with good collaboration features. The real-time updates are smooth, and the permission system is well thought out."
  },
  {
    userId: 6,
    rating: 5,
    review: "The best documentation platform we've used so far. The ability to organize content hierarchically is fantastic, and the search is lightning fast."
  },
  {
    userId: 7,
    rating: 4,
    review: "Very impressed with the performance and reliability. The automatic backups give us peace of mind, though I wish there were more export options."
  },
  {
    userId: 8,
    rating: 5,
    review: "This platform has transformed how we manage our documentation. The version history and diff viewer are invaluable features for our team."
  },
  {
    userId: 9,
    rating: 5,
    review: "Outstanding platform! The API documentation features are particularly helpful, and the code syntax highlighting is perfect for our technical docs."
  },
  {
    userId: 10,
    rating: 4,
    review: "Really enjoying the platform's simplicity while still offering powerful features. The image handling and attachment system works great."
  },
  {
    userId: 11,
    rating: 5,
    review: "The collaborative editing features are game-changing for our team. Being able to work on documents simultaneously has boosted our productivity."
  },
  {
    userId: 12,
    rating: 4,
    review: "Excellent platform for knowledge management. The integration capabilities are extensive, though setting them up could be more straightforward."
  },
  {
    userId: 13,
    rating: 5,
    review: "This wiki has made our documentation process so much more efficient. The search functionality and organization options are top-notch."
  }
];

async function generateTestReviews() {
  console.log('Generating test reviews...');
  
  try {
    for (const review of reviews) {
      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: review.userId }
      });

      if (!user) {
        console.log(`Skipping review for user ${review.userId} - user does not exist`);
        continue;
      }

      // Check if review already exists for this user
      const existingReview = await prisma.userReview.findFirst({
        where: { userId: review.userId }
      });

      if (existingReview) {
        console.log(`Review already exists for user ${review.userId}`);
        continue;
      }

      // Create review
      await prisma.userReview.create({
        data: {
          userId: review.userId,
          rating: review.rating,
          review: review.review
        }
      });

      console.log(`Created review for user ${review.userId}`);
    }

    console.log('\nTest reviews generated successfully!');
  } catch (error) {
    console.error('Error generating test reviews:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
generateTestReviews();
