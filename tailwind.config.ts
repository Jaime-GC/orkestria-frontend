import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#001f3f", // Define navy blue color
      },
    },
  },
} satisfies Config;
