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
    // <div>
    //   <form method="post" onSubmit={handleSubmit}>
    //     <label>
    //       Prompt:{" "}
    //       <input
    //         name="prompt"
    //         value={prompt}
    //         onChange={(e) => setPrompt(e.target.value)}
    //         required
    //       />
    //     </label>
    //     <button type="submit">Generate Image</button>
    //   </form>
    //   {error && <p style={{ color: "red" }}>Error: {error}</p>}
    // </div>
    <div class="p-4 bg-gray-900 rounded-lg max-w-2xl mx-auto mt-5">
  <form method="post" onSubmit={handleSubmit} class="space-y-4 flex items-end">
    <label class="block text-gray-300 font-medium flex-1">
      Prompt:
      <textarea
        name="prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        required
        class="w-11/12 p-3 mt-1 bg-gray-800 text-gray-200 rounded-lg resize-y min-h-[3rem] focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="1"
      ></textarea>
    </label>
    <button
      type="submit"
      class="ml-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      Generate
    </button>
  </form>
  {error && <p class="text-red-500 mt-2">Error: {error}</p>}
</div>

  );
};

export default Image_Generator;