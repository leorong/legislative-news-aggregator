import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/utils/db';

// API route handler for fetching news articles with pagination and filters
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Extract query parameters from the request
    const { state, topic, search, cursor, limit = 10 } = req.query;

    // Parse the limit parameter into a number
    const limitNumber = parseInt(limit as string, 10);

    // Initialize a query to fetch articles from the 'legislative_news' table
    let query = supabase
      .from('legislative_news')
      .select(
        'id, title, description, published_date, state, topic, url, author, image_url, content',
        { count: 'exact' } // Include the total count of matching rows
      )
      .order('published_date', { ascending: false }) // Order articles by most recent published date
      .limit(limitNumber); // Limit the number of articles returned

    // Apply cursor-based pagination
    if (cursor) {
      query = query.lt('published_date', cursor); // Fetch articles published before the cursor
    }

    // Apply state filter if provided
    if (state) {
      query = query.eq('state', state);
    }

    // Apply topic filter if provided
    if (topic) {
      query = query.eq('topic', topic);
    }

    // Apply search filter to match keywords in title or description
    if (search) {
      query = query.or(
        `title.ilike.%${search}%,description.ilike.%${search}%`
      ); // Case-insensitive match for search keywords
    }

    // Execute the query
    const { data, error } = await query;

    // Handle query errors
    if (error) {
      throw error; // Throw an error to be caught by the error handler
    }

    // Respond with the fetched articles and a cursor for pagination
    res.status(200).json({
      articles: data,
      cursor: data[data.length - 1]?.published_date || null, // Return the published_date of the last article as the cursor
    });
  } catch (error) {
    // Log any errors and return a 500 Internal Server Error response
    console.error('Error fetching articles:', error.message);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
}
