export const config = {
  runtime: "edge"
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { query, apiKey, matches } = (await req.json()) as {
      query: string;
      apiKey: string;
      matches: number;
    };

    const input = query.replace(/\n/g, " ");

    const base_path = process.env.OPENAI_BASE_PATH ?? "https://api.openai.com/v1";

    const res = await fetch(`${base_path}/embeddings`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      method: "POST",
      body: JSON.stringify({
        model: "text-embedding-ada-002",
        input
      })
    });

    const json = await res.json();
    const embedding = json.data[0].embedding;


    const queryRequest = {
      vector: embedding,
      topK: matches,
      includeValues: true,
      includeMetadata: true,
    };
    const response = await fetch("https://zhangxiaoyu-bc355c5.svc.us-central1-gcp.pinecone.io/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept": "application/json",
        "Api-Key": process.env.PINECONE_API_KEY ?? ""
      },
      body: JSON.stringify(queryRequest)
    })
    const response_json = await response.json()
    const chunks = response_json.matches.map((match: any) => match.metadata)

    return new Response(JSON.stringify(chunks), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
};

export default handler;
