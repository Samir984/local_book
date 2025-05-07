import { coreApiGetUploadUrl } from "@/gen";
import Cookies from "js-cookie";
import { toast } from "sonner";

export async function uploadToS3(imageFile: File) {
  try {
    // generating signed url backend
    const signeduploadUrl = await coreApiGetUploadUrl(
      {
        filename: imageFile.name,
      },
      {
        headers: {
          "X-CSRFToken": Cookies.get("csrftoken")!,
        },
      }
    );

    const formData = new FormData();
    for (const field in signeduploadUrl.fields) {
      formData.append(field, signeduploadUrl.fields[field]);
    }
    formData.append("file", imageFile);

    // uploading image
    const uploadResponse = await fetch(signeduploadUrl.url, {
      method: "POST",
      body: formData,
    });

    console.log(uploadResponse);
    if (!uploadResponse.ok) {
      throw new Error("Image upload failed");
    }
    toast.success("Filed upload successfully.");
    return signeduploadUrl.key;
  } catch (error) {
    console.log(error);
    toast.error("Image uplaod Failed");
    throw error;
  }
}
