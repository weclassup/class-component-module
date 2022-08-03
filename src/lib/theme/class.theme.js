const classTheme = {
  extend: {
    screens: {
      "hover-hover": { raw: "(hover: hover)" },
    },
    spacing: {
      fit: "fit-content",
      stretch: "stretch",
    },
    maxHeight: { fit: "fit-content" },
    colors: {
      green: "#4BDB9B",
      red: "#FF624D",
      grey1: "#3E3A49",
      grey2: "#838288",
      grey3: "#BDBCBF",
      grey4: "#E6E6E6",
      grey5: "#F2F3F4",
      grey6: "#F8F9FB",
      "bg-blue": "#F4F8FB",
    },
    borderRadius: {
      xs: "0.25rem",
      sm: "0.5rem",
      lg: "6.25rem",
      cl: "50%",
    },
    boxShadow: {
      dropdown: "0 6px 20px 0 rgba(0, 0, 0, 0.15);",
    },
    transitionProperty: { "max-height": "max-height", top: "top" },
  },
};

module.exports = classTheme;
