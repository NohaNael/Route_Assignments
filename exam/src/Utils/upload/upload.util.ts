import { Readable } from "stream";
import cloudinary from "./cloudinary.config";
import { IMedia } from "../../types/interfaces";

export function uploadBufferToCloudinary(buffer: Buffer, folder: string): Promise<IMedia> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ folder, resource_type: "auto" }, (error, result) => {
      if (error || !result) return reject(error);
      resolve({ secure_url: result.secure_url, public_id: result.public_id });
    });
    Readable.from(buffer).pipe(uploadStream);
  });
}

export async function destroyCloudinaryAsset(publicId?: string): Promise<void> {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
}
