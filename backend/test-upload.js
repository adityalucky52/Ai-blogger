import dotenv from "dotenv";
import cloudinary from "./utils/cloudinary.js";

dotenv.config();

console.log("Testing Cloudinary Connection...");
console.log(
  "Cloud Name:",
  process.env.CLOUDINARY_CLOUD_NAME ? "Set" : "Missing",
);
console.log("API Key:", process.env.CLOUDINARY_API_KEY ? "Set" : "Missing");
console.log(
  "API Secret:",
  process.env.CLOUDINARY_API_SECRET ? "Set" : "Missing",
);

async function test() {
  try {
    const result = await cloudinary.uploader.upload(
      "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
      { public_id: "olympic_flag" },
    );
    console.log("Success:", result);
  } catch (error) {
    console.error("Failure:", error);
  }
}

test();
