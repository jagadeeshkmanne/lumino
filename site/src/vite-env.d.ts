/// <reference types="vite/client" />

// Support for ?raw imports
declare module "*.ts?raw" {
  const content: string;
  export default content;
}
