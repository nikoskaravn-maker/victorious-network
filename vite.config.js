import { defineConfig } from 'vite';

export default defineConfig({
  base: '/victorious-network/', // Set this to your GitHub Repository name (e.g., '/repository-name/')
  server: {
    watch: {
      ignored: ['**/vnsite/**']
    }
  }
});
