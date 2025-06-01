export {}

declare global {
  interface Window {
    dataLayer: {
      push: (event: Record<string, any>) => void;
    };
  }
}
