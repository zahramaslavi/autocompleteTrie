import { startServer } from './server'; // Import the server startup function

// Check if the file is being run directly (i.e., not imported by a test)
if (require.main === module) {
  // Call the startServer function to start the server for production
  startServer();
}