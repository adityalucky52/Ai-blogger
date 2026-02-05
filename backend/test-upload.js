import dotenv from "dotenv";
import imagekit from "./utils/imageKit.js";

dotenv.config();

console.log("Testing ImageKit Connection...");
console.log("Public Key:", process.env.IMAGEKIT_PUBLIC_KEY ? "Set" : "Missing");
console.log(
  "Private Key:",
  process.env.IMAGEKIT_PRIVATE_KEY ? "Set" : "Missing",
);
console.log("URL Endpoint:", process.env.IMAGEKIT_URL_ENDPOINT);

async function test() {
  try {
    const result = await imagekit.upload({
      file: "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", // 1x1 pixel GIF base64
      fileName: "test-image.gif",
    });
    console.log("Success:", result);
  } catch (error) {
    console.error("Failure:", error);
  }
}

test();
