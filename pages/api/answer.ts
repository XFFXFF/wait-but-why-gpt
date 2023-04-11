import { OpenAIStream } from "@/utils";

export const config = {
  runtime: "edge"
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { prompt } = (await req.json()) as {
      prompt: string;
      apiKey: string;
    };
    console.log("prompt", prompt)

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set");
    }

    const apiKey = process.env.OPENAI_API_KEY;

    const stream = await OpenAIStream(prompt, apiKey);

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
};

export default handler;
