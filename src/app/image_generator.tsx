
import OpenAI from "openai";

require('dotenv').config()

const openai = new OpenAI({apiKey: process.env.api_key, dangerouslyAllowBrowser: true});

interface PropsDefinition {
    setBackgroundImg(data: string): void;
    setPlatformImg(data: string): void;
    setPortalImg(data: string): void;
  }

const Image_Generator = async (props: PropsDefinition) => {
    function generatePrompt(imageType, prompt) {
        if (imageType === "platform") {
            return "A 1 by 1 ratio pixel art of a square platform sprite that takes up the whole image with the theme" + prompt; 
        }
        
        else if (imageType === "background") {
            return "A background image for a pixel art game with the theme" + prompt;
        }

        else if (imageType === "portal") {
            return "A 1 by 1 ratio pixel art of an exit gateway that takes up the whole image with the theme" + prompt;
        }

        return "";
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);

        const formJson = Object.fromEntries(formData.entries());
        const prompt = formJson["prompt"];
        
        const background_image = await openai.images.generate({prompt: generatePrompt("background", prompt), size: "1792x1024"})
        const platform_image = await openai.images.generate({prompt: generatePrompt("platform", prompt), size: "256x256"})
        const portal_image = await openai.images.generate({prompt: generatePrompt("portal", prompt), size: "256x256"})

        props.setBackgroundImg(background_image.data[0].url);
        props.setPlatformImg(platform_image.data[0].url);
        props.setPortalImg(portal_image.data[0].url);
        
    }
    return (
        <div>
            <form method="post" onSubmit={handleSubmit}>
                <label>
                    Prompt: <input name="prompt"/>
                </label>
                <button type="submit">Generate Image</button>
            </form>
        </div>
    )
}

export default Image_Generator;