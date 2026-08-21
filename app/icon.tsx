import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/**
 * DEFERRED: the real favicon. This is a placeholder built from the brand
 * gradient so the tab is not blank, and it gets replaced when the icon asset
 * arrives, implementer-handoff "Assets".
 */
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(180deg, #0040b1 0%, #74acdf 40%, #ffe174 100%)",
        color: "#14181c",
        fontSize: 34,
        fontWeight: 700,
        fontFamily: "sans-serif",
      }}
    >
      IG
    </div>,
    size,
  );
}
