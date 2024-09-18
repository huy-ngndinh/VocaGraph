/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      height: {
        "2/25": "8%",
        "13/20": "65%",
        "7/10": "70%",
        "1/8": "12.5%",
        "1/10": "10%",
        "9/10": "90%",
        "97/100": "97%",
        "19/20": "95%"
      },
      minHeight: {
        "9/10": "90%"
      },
      width: {
        "1/20": "5%",
        "2/25": "8%",
        "9/10": "90%",
        "7/10": "70%",
        "11/20": "55%",
      },
      gridTemplateColumns: {
        "16": "repeat(16, minmax(0, 1fr));"
      },
      gridColumnEnd: {
        "17": "17"
      },
      boxShadow: {
        "l": "-6px 5px 10px 0px rgba(0 0 0 / 0.1)",
      },
      borderColor: {
        "light-blue": "#78B7D0"
      },
      borderWidth: {
        "1": "1px"
      }
    },
  },
  plugins: [],
};
