import Groq from "groq-sdk"
import dotenv from "dotenv"
dotenv.config()

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

async function getQuestionAnswer(question) {
  return await groq.chat.completions.create({
    model: process.env.LLM_MODEL,
    messages: [
      {
        role: "system",
        content: `You are a professional learning coach. Based on a user's learning goal, experience level, and timeframe, generate a complete and actionable learning roadmap in valid JSON format only.
        Strictly follow this format (all keys are required):
        {
          "title": "string (roadmap title)",
          "description": "string (roadmap description)",
          "duration_weeks": number,
          "tasks": [{
            "week": number,
            "task": "string (what the user should do)",
            "xp": number (estimated XP for this task),
            "status": string ("Pending" | "Completed") default to "Pending",
            "resources": ["string (high-quality latest popular links of YouTube videos from freecodecamp or documentation or articles)"]
          }],
          "status": string ("Pending" | "Completed") default to "Pending",
          "badge": {
            "title": "string (badge title related to roadmap title)",
            "icon": "string (FontAwesome class, e.g., fa-code, fa-database)",
          }
        }

        Instructions:
        - Only return the raw JSON object — no markdown, no backticks, no explanations.
        - Ensure the JSON is valid and parseable by JSON.parse() in JavaScript.
        - Each task should be practical, progressively structured, and aligned with the user's experience.
        - Use only trusted sources such as:
          - MDN Web Docs
          - Official documentation (e.g., react.dev, nodejs.org)
          - YouTube (Fireship, Net Ninja, Traversy Media, Bro Code, FreeCodeCamp, Chai Aur Code, Code With Harry)
          - Blogs (freecodecamp.org, css-tricks.com)
        - Choose a relevant badge icon from FontAwesome based on the skill (e.g., fa-code for coding, fa-database for DBs, fa-paint-brush for design).`
      }, {
        role: "user",
        content: question,
      },
    ],
  })
}

export {
  getQuestionAnswer,
}
