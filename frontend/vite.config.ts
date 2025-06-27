/// <reference types="vitest" />

import { type ConfigEnv, defineConfig } from 'vite';

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv) => {
  return defineConfig({
    test: {
      environment: 'happy-dom',
      setupFiles: ["./setupTests.js"],
       },

       server: {

        proxy: {
          '/graphql': {
            target: 'http://localhost:8000'
          }
        }
       }
       
  });
};
