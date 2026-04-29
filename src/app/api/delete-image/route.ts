import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { envVars } from "../../../config/env";

cloudinary.config({
  cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY_API_SECRET,
});

interface DeleteImageRequest {
  publicId: string;
  resourceType?: string;
}

export async function DELETE(request: NextRequest) {
  try {
    const { publicId, resourceType }: DeleteImageRequest = await request.json();

    if (!publicId) {
      return NextResponse.json(
        { success: false, message: "Public ID is required" },
        { status: 400 },
      );
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType || "image",
    });

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Delete failed" },
      { status: 500 },
    );
  }
}
