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