/**
 * List of U.S. states used to determine the state associated with a news article.
 */
export const states = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

/**
 * Topics with associated keywords used to categorize news articles.
 */
export const topics = {
  education: ["school", "teacher", "education", "students", "university", "curriculum", "classroom"],
  health: ["health", "hospital", "medicine", "doctor", "nurse", "COVID", "pandemic", "mental health"],
  economy: ["economy", "jobs", "tax", "finance", "budget", "revenue", "unemployment"],
  environment: ["climate", "environment", "pollution", "wildlife", "sustainability", "renewable"],
  politics: ["election", "vote", "legislation", "senate", "governor", "policy", "lawmakers"],
};

/**
 * Determines the state mentioned in a news article based on its title or description.
 * 
 * @param article - The news article containing a title and description.
 * @returns The name of the state if found, or "Unknown" if no state is identified.
 */
export function determineState(article: { title: string; description: string | null }): string {
  for (const state of states) {
    if (
      article.title.includes(state) ||
      (article.description && article.description.includes(state))
    ) {
      return state;
    }
  }
  return "Unknown";
}

/**
 * Determines the primary topic of a news article by matching keywords in its content.
 * 
 * @param article - The news article containing a title and description.
 * @returns The topic with the highest keyword match score, or "General" if no match is found.
 */
export function determineTopic(article: { title: string; description: string | null }): string {
  const content = `${article.title} ${article.description || ""}`.toLowerCase();
  const scores: Record<string, number> = {};

  // Calculate scores for each topic based on keyword matches.
  for (const [topic, keywords] of Object.entries(topics)) {
    scores[topic] = keywords.reduce((count, keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      return count + (content.match(regex)?.length || 0);
    }, 0);
  }

  // Identify the topic with the highest score.
  const bestTopic = Object.entries(scores).reduce((best, current) =>
    current[1] > best[1] ? current : best
  )[0];

  return scores[bestTopic] > 0 ? bestTopic : "General";
}
