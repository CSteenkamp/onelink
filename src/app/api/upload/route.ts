import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getProfileIdFromRequest } from "@/lib/session";
import {
  getPresignedUploadUrl,
  getPublicUrl,
  ALLOWED_IMAGE_TYPES,
  MAX_FILE_SIZE,
} from "@/lib/s3";

export async function POST(req: NextRequest) {
  try {
    const profileId = await getProfileIdFromRequest(req);
    if (!profileId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { fileName, fileType, imageType, fileSize } = body;

    if (!fileName || !fileType || !imageType || !fileSize) {
      return NextResponse.json(
        { error: "Missing required fields: fileName, fileType, imageType, fileSize" },
        { status: 400 }
      );
    }

    if (typeof fileSize !== "number" || fileSize <= 0 || fileSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File must be under 5MB" },
        { status: 400 }
      );
    }

    if (!ALLOWED_IMAGE_TYPES.includes(fileType)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF" },
        { status: 400 }
      );
    }

    if (!["avatar", "header"].includes(imageType)) {
      return NextResponse.json(
        { error: "imageType must be 'avatar' or 'header'" },
        { status: 400 }
      );
    }

    const ext = fileName.split(".").pop()?.toLowerCase() || "jpg";
    const key = `${imageType}/${profileId}/${uuidv4()}.${ext}`;

    const presignedUrl = await getPresignedUploadUrl(key, fileType, fileSize);
    const publicUrl = getPublicUrl(key);

    return NextResponse.json({ presignedUrl, publicUrl });
  } catch (error) {
    console.error("Upload presign error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
