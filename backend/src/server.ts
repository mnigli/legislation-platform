import app from './app';
import { config } from './config';
import { prisma } from './utils/prisma';

async function main() {
  try {
    await prisma.$connect();
    console.log('Connected to database');

    app.listen(config.port, () => {
      console.log(`Server running on http://localhost:${config.port}`);
      console.log(`Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
