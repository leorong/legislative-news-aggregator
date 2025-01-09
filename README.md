# Legislative News Aggregator

## Description

A web application that aggregates news articles related to state legislatures, lawmakers, and legislative actions. Users can filter news by state and topic, search for specific keywords, and view detailed articles. The project leverages the [NewsAPI](https://newsapi.org/) for fetching news and integrates with [Supabase](https://supabase.com/) for database operations.

---

## Features

- **News Aggregation**: Fetch and aggregate news articles using the NewsAPI.
- **Filtering**: Filter articles by state and topic.
- **Search Functionality**: Search articles by keywords in the title or description.
- **Pagination**: Efficient pagination using a cursor-based approach.
- **Detailed Article View**: View full details of selected news articles.

---

## Technologies Used

- **Frontend**: [Next.js](https://nextjs.org/) (React framework)
- **Backend**: API routes in Next.js
- **Database**: [Supabase](https://supabase.com/)
- **Styling**: CSS Modules
- **API**: [NewsAPI](https://newsapi.org/)

---

## Setup Instructions

### Prerequisites

- Node.js and npm/yarn installed.
- A [NewsAPI](https://newsapi.org/) account with an API key.
- A [Supabase](https://supabase.com/) project with a database.

### Environment Variables

Create a `.env.local` file in the root directory and add the following:

```plaintext
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEWS_API_KEY=your-newsapi-key

