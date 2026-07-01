import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "StartXKit docs",
    },
    links: [
      {
        text: "Home",
        url: "/",
        active: "nested-url",
      },
      {
        text: "GitHub",
        url: "https://github.com/anomalyco/startxkit",
        external: true,
      },
    ],
  };
}
