import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Сердце Ростова 2";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Logo text */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              fontSize: "120px",
              fontWeight: 800,
              color: "white",
              letterSpacing: "-4px",
            }}
          >
            СР2
          </div>
        </div>

        {/* Site name */}
        <div
          style={{
            fontSize: "48px",
            fontWeight: 600,
            color: "white",
            marginBottom: "16px",
          }}
        >
          Сердце Ростова 2
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: "24px",
            color: "rgba(255, 255, 255, 0.9)",
            textAlign: "center",
            maxWidth: "800px",
          }}
        >
          Информационный портал жилого комплекса
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
