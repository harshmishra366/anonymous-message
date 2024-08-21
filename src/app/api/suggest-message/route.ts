import { GoogleGenerativeAI } from "@google/generative-ai";
import { Stream } from "stream";

// Ensure that the environment variable is correctly set
const key = process.env.NEXT_PUBLIC_API_KEY;
if (!key) {
  console.error("API key was not found");
  process.exit(1); // Exit if key is not found
}

// Initialize the GoogleGenerativeAI with the API key
const genAI = new GoogleGenerativeAI(key);

// Get the generative model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function run() {
  try {
    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    // Generate content based on the prompt
const result = await model.generateContent(prompt,{:true});

    // Await the response and extract text
    const response = await result.response;
    const text = await response.text(); // Ensure text() is awaited

    console.log(text);
  } catch (error) {
    console.error("An error occurred while generating content:", error);
  }
}

run();
