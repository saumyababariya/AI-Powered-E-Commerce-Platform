import React from "react";

export const KNOWN_COLORS = {
  pink: "#ec4899",
  blue: "#3b82f6",
  green: "#22c55e",
  yellow: "#eab308",
  purple: "#a855f7",
  orange: "#f97316",
  black: "#111827",
  white: "#ffffff",
  grey: "#6b7280",
  gray: "#6b7280",
  brown: "#78350f",
  beige: "#f5f5dc",
  red: "#ef4444",
  // Advanced Colors
  "olive green": "#556b2f",
  olive: "#808000",
  khaki: "#f0e68c",
  maroon: "#800000",
  wine: "#722f37",
  burgundy: "#800020",
  teal: "#008080",
  turquoise: "#40e0d0",
  mustard: "#e1ad01",
  cream: "#fffdd0",
  "navy blue": "#000080",
  "sky blue": "#87ceeb",
  "baby pink": "#f4c2c2",
  "hot pink": "#ff69b4",
  lavender: "#e6e6fa",
  peach: "#ffdab9",
  "mint green": "#98ff98",
  charcoal: "#36454f",
  silver: "#c0c0c0",
  gold: "#ffd700",
  "rose gold": "#b76e79",
  coffee: "#6f4e37",
  tan: "#d2b48c"
};

export const getColorInfo = (colourName) => {
  if (!colourName) {
    return { code: "#cbd5e1", isKnown: false, name: "" };
  }
  const name = colourName.trim().toLowerCase();
  if (name in KNOWN_COLORS) {
    return { code: KNOWN_COLORS[name], isKnown: true, name: colourName.trim() };
  }
  return { code: "#cbd5e1", isKnown: false, name: colourName.trim() };
};

export const getColorStyle = (colourName) => {
  return getColorInfo(colourName).code;
};

export const ColorSwatch = ({ colourName, showNameAlways = false }) => {
  if (!colourName) return null;
  const { code, isKnown } = getColorInfo(colourName);

  // White color needs a border to be visible on white backgrounds
  const borderStyle = (colourName.toLowerCase().trim() === "white")
    ? "1px solid #d1d5db"
    : "1px solid rgba(0,0,0,0.15)";

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", verticalAlign: "middle" }}>
      <span
        style={{
          display: "inline-block",
          width: "0.85rem",
          height: "0.85rem",
          borderRadius: "50%",
          backgroundColor: code,
          border: borderStyle,
          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
          flexShrink: 0
        }}
        title={colourName}
      />
      {(showNameAlways || !isKnown) && (
        <span style={{ fontSize: "0.9rem", color: "#374151" }}>
          {colourName} {!isKnown && <span style={{ color: "#9ca3af", fontSize: "0.8rem", fontWeight: "normal" }}>(Unknown)</span>}
        </span>
      )}
    </span>
  );
};
