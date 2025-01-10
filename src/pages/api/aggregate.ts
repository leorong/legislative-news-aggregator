import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/utils/db';
import { determineState, determineTopic } from '@/utils/helpers';

// Define the type for incoming articles
type IncomingArticle = {
  title: string;
  description: string | null;
  content: string | null;
  publishedAt: string;
  url: string;
  author?: string | null;
  urlToImage?: string | null;
};

// Define the type for the mapped articles
type MappedArticle = {
  title: string;
  description: string | null;
  content: string | null;
  published_date: string;
  url: string;
  state: string; // Assuming `determineState` returns a string
  topic: string; // Assuming `determineTopic` returns a string
  author: string | null;
  image_url: string | null;
  created_at: string;
};

// API route handler for aggregating news articles
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Allow only GET requests; return 405 Method Not Allowed for other methods
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Extract query parameters: startDate, endDate, and optional custom API URL
  const { startDate, endDate, url } = req.query;

  // Use the provided API URL or default to NewsAPI's 'everything' endpoint
  const apiUrl =
    url && typeof url === 'string' ? url : 'https://newsapi.org/v2/everything';

  // Define the search query for fetching relevant news articles
  // Note: The query can be improved to aggregate more relevant news articles
  const query = '(state legislature OR state legislative OR state lawmakers)';

  // Retrieve the NewsAPI key from environment variables
  const apiKey = process.env.NEWS_API_KEY || '';

  // Return an error if the API key is missing
  if (!apiKey) {
    res.status(500).json({ error: 'Missing NEWS_API_KEY environment variable' });
    return;
  }

  // Construct the request URL with query parameters for the NewsAPI
  const requestUrl = `${apiUrl}?q=${encodeURIComponent(query)}&language=en${
    startDate && typeof startDate === 'string' ? `&from=${startDate}` : ''
  }${endDate && typeof endDate === 'string' ? `&to=${endDate}` : ''}&sortBy=publishedAt&apiKey=${apiKey}`;

  try {
    // Fetch articles from the NewsAPI
    const response = await fetch(requestUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the JSON response
    const data = await response.json();

    // Map articles to match the database schema and filter out unwanted ones
    const filteredArticles = data.articles
      .map((article: IncomingArticle) => ({
        title: article.title,
        description: article.description,
        content: article.content,
        published_date: article.publishedAt,
        url: article.url,
        state: determineState(article),
        topic: determineTopic(article),
        author: article.author || null,
        image_url: article.urlToImage || null,
        created_at: new Date().toISOString(), // Current timestamp for 'created_at'
      }))
      .filter((article: MappedArticle) => {
        // Exclude articles without an author or containing '[Removed]' in the title or description
        return (
          article.author !== null &&
          !article.title.includes('[Removed]') &&
          !article.description?.includes('[Removed]')
        );
      });

    console.log(filteredArticles.length); // Log the number of filtered articles

    // Get the total number of rows before the upsert operation
    const { count: initialCount, error: initialCountError } = await supabase
      .from('legislative_news')
      .select('*', { count: 'exact' });

    if (initialCountError) {
      throw new Error(initialCountError.message);
    }

    // Upsert (insert or update) articles into the 'legislative_news' table
    const { error: upsertError } = await supabase
      .from('legislative_news')
      .upsert(filteredArticles, { onConflict: 'url' });

    if (upsertError) {
      throw new Error(upsertError.message);
    }

    // Get the total number of rows after the upsert operation
    const { count: finalCount, error: finalCountError } = await supabase
      .from('legislative_news')
      .select('*', { count: 'exact' });

    if (finalCountError) {
      throw new Error(finalCountError.message);
    }

    // Calculate the number of newly inserted articles
    const newlyInsertedCount = (finalCount || 0) - (initialCount || 0);

    // Respond with a success message and the count of new articles
    res.status(200).json({
      message: 'News aggregated successfully.',
      newCount: newlyInsertedCount,
    });
  } catch (error) {
    // Log any errors and respond with a 500 Internal Server Error
    console.error('Error fetching or saving news:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
