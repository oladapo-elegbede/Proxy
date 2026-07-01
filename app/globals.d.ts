// app/globals.d.ts
// Tells TypeScript that CSS imports are valid side-effect imports.
declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}