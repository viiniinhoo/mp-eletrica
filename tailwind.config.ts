import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#13274F",
                "primary-light": "#1e3a75",
                accent: "#FFD700",
                "background-light": "#F4F6F8",
                "background-dark": "#111721",
                surface: "#FFFFFF",
                "text-primary": "#0F172A",
                "text-muted": "#64748B",
                "border-color": "#E2E8F0",
                "status-success": "#10B981",
                "status-warning": "#F59E0B",
                "status-danger": "#EF4444",
                danger: "#dc2626",
                "safety-yellow": "#facc15",
            },
            fontFamily: {
                display: ["Oswald", "sans-serif"],
                body: ["Public Sans", "sans-serif"],
                mono: ["JetBrains Mono", "monospace"],
            },
            borderRadius: {
                DEFAULT: "2px",
                sm: "2px",
                md: "4px",
                lg: "6px",
                xl: "8px",
                full: "9999px",
            },
            boxShadow: {
                industrial: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                fab: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
            },
        },
    },
    plugins: [],
};
export default config;
