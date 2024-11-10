
// import OpenAI from "openai";

// // require('dotenv').config()

// // const openai = new OpenAI({apiKey: process.env.api_key, dangerouslyAllowBrowser: true});

// interface PropsDefinition {
//     setBackgroundImg(data: string): void;
//     setPlatformImg(data: string): void;
//     setPortalImg(data: string): void;
//   }

// const Image_Generator = (props: PropsDefinition) => {
//     function generatePrompt(imageType, prompt) {
//         if (imageType === "platform") {
//             return "A 1 by 1 ratio pixel art of a square platform sprite that takes up the whole image with the theme" + prompt; 
//         }
        
//         else if (imageType === "background") {
//             return "A background image for a pixel art game with the theme" + prompt;
//         }

//         else if (imageType === "portal") {
//             return "A 1 by 1 ratio pixel art of an exit gateway that takes up the whole image with the theme" + prompt;
//         }

//         return "";
//     }

//     function handleSubmit(e) {
//         e.preventDefault();

//         const form = e.target;
//         const formData = new FormData(form);

//         const formJson = Object.fromEntries(formData.entries());
//         const prompt = formJson["prompt"];
        
//         // const background_image = await openai.images.generate({prompt: generatePrompt("background", prompt), size: "1792x1024"})
//         // const platform_image = await openai.images.generate({prompt: generatePrompt("platform", prompt), size: "256x256"})
//         // const portal_image = await openai.images.generate({prompt: generatePrompt("portal", prompt), size: "256x256"})

//         // props.setBackgroundImg(background_image.data[0].url);
//         // props.setPlatformImg(platform_image.data[0].url);
//         // props.setPortalImg(portal_image.data[0].url);
//         props.setBackgroundImg("platform.png")
        
//     }
//     return (
//         <div>
//             <form method="post" onSubmit={handleSubmit}>
//                 <label>
//                     Prompt: <input name="prompt"/>
//                 </label>
//                 <button type="submit">Generate Image</button>
//             </form>
//         </div>
//     )
// }
import React, { useState } from "react";

interface PropsDefinition {
  setBackgroundImg(data: string): void;
  setPlatformImg(data: string): void;
  setPortalImg(data: string): void;
}

const Image_Generator = (props: PropsDefinition) => {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function fetchImageForType(imageType: string) {
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, imageType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }

      // Set the image based on type
      if (imageType === "background") {
        props.setBackgroundImg(data.imageUrl);
      } else if (imageType === "platform") {
        props.setPlatformImg(data.imageUrl);
      } else if (imageType === "portal") {
        props.setPortalImg(data.imageUrl);
      }
    } catch (error: any) {
      setError(error.message);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null); // Reset error state before submission

    try {
        // Make parallel API calls for each image type using Promise.all
        await Promise.all([
          fetchImageForType("background"),
          fetchImageForType("platform"),
          fetchImageForType("portal"),
        ]);
      } catch (error) {
        setError((error as Error).message);
    }
  }

  return (
    <div>
      <form method="post" onSubmit={handleSubmit}>
        <label>
          Prompt:{" "}
          <input
            name="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
          />
        </label>
        <button type="submit">Generate Image</button>
      </form>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
};

export default Image_Generator;