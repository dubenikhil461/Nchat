import { toFile } from "@imagekit/nodejs";
import { imagekit } from "../config/imagekit.ts";

export async function uploadProfilePhoto(
  file: Express.Multer.File,
  userId: string,
) {
  const response = await imagekit.files.upload({
    file: await toFile(file.buffer, file.originalname),
    fileName: `${userId}-${Date.now()}-${file.originalname}`,
    folder: "/profile-photos",
  });

  return {
    profilePhoto: response.url,
    imagekitFileId: response.fileId,
  };
}

export async function deleteProfilePhoto(fileId: string) {
  try {
    await imagekit.files.delete(fileId);
  } catch {
    // Ignore if the file was already removed from ImageKit.
  }
}
