import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Validate environment variables
if (!process.env.UPLOADTHING_SECRET || !process.env.UPLOADTHING_APP_ID) {
  throw new Error('Missing UploadThing environment variables');
}
 
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    uploadthingId: process.env.UPLOADTHING_APP_ID,
    uploadthingSecret: process.env.UPLOADTHING_SECRET,
  },
});