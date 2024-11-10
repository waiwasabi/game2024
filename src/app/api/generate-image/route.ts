import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI with the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is stored in the .env file
});

// Define an enum for image types
enum ImageType {
  background = "background",
  platform = "platform",
  portal = "portal",
}

function generateImagePrompt(imageType: any, prompt: any): string {
  if (imageType === ImageType.platform) {
    return (
      "A 1 by 1 ratio pixel art of a square platform tilemap sprite that takes up the whole image with the theme:" +
      prompt
    );
  } else if (imageType === ImageType.background) {
    return (
      "A background image for a pixel art game with the theme:" + prompt
    );
  } else if (imageType === ImageType.portal) {
    return (
      "A 1 by 1 ratio pixel art of an exit gateway that takes up the whole image with the theme:" +
      prompt
    );
  }
  return "";
}

export async function POST(req: NextRequest) {
  try {
    // Attempt to parse the JSON body
    const body = await req.json();
    if (!["prompt", "imageType"].every((key) => key in body)) {
      return NextResponse.json(
        { error: "You need to pass in a prompt and an imageType" },
        { status: 400 }
      );
    }

    const { prompt, imageType } = body;

    if (!(imageType in ImageType)) {
      return NextResponse.json(
        {
          error: `Invalid imageType. Must be one of: ${Object.values(
            ImageType
          ).join(", ")}`,
        },
        { status: 400 }
      );
    }
   
    const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: generateImagePrompt(imageType, prompt),
        size: imageType === "background" ? "1792x1024" : "1024x1024",
    });

    return NextResponse.json({ imageUrl: response.data[0].url });
  

  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
