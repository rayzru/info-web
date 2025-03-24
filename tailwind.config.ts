import { type Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        warning: colors.yellow[600],
        success: colors.green[600],
        error: colors.red[600],
      },
    },
  },
  plugins: [],
} satisfies Config;
