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

### Supabase Table Setup

Run the following SQL query in the **Supabase SQL editor** to create the `legislative_news` table:

```sql
CREATE TABLE IF NOT EXISTS public.legislative_news (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    published_date TIMESTAMP,
    state TEXT,
    topic TEXT,
    url TEXT UNIQUE,
    author TEXT,
    image_url TEXT,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Environment Variables

Create a `.env.local` file in the root directory and add the following:

```plaintext
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEWS_API_KEY=your-newsapi-key
```

---

## Installation

### Clone the repository:
```bash
git clone https://github.com/leorong/legislative-news-aggregator.git
cd legislative-news-aggregator
```

### Install dependencies:
```bash
yarn
```

### Start the development server:
```bash
yarn dev
```

### Open the app in your browser:
```plaintext
http://localhost:3000
```

---

## Usage

### Aggregating News
1. Navigate to the `/news-aggregator` page.
2. Select a start date and end date.
3. Click **Fetch Aggregated News** to pull articles from the NewsAPI.
4. View the number of new articles saved to the database.

### Viewing News Articles
1. Navigate to the `/news` page.
2. Filter articles by state and topic.
3. Search for articles by entering keywords.
4. Click on a news title to view detailed information about the article.

---

## Project Structure

```plaintext
src/
├── pages/
│   ├── index.tsx           # Home page (Redirects to /news)
│   ├── news.tsx            # News listing and filtering
│   ├── news-aggregator.tsx # News aggregation page
├── utils/
│   ├── db.ts               # Supabase client setup
│   ├── helpers.ts          # Utility functions for determining state and topic
├── styles/
│   ├── News.module.css     # CSS for news page
│   ├── NewsAggregator.module.css # CSS for aggregator page
```

## API Endpoints

### News Aggregation: `/api/aggregate`
- Fetches news articles from NewsAPI and saves them to the database.
- Supports `startDate` and `endDate` query parameters.

### News Listing: `/api/news`
- Fetches news articles from the database.
- Supports filters for `state`, `topic`, and `search`.
- Implements cursor-based pagination using `cursor` and `limit`.

---

## System Design Considerations

## News Aggregation
### Approach to Aggregating News Articles
- **Multiple Sources**: Utilize APIs like [NewsAPI](https://newsapi.org/) to fetch articles from diverse sources. Multiple API integrations can ensure broader coverage.
- **Deduplication**:
  - Articles are stored in a database with a unique constraint on the `url` column to prevent duplicate entries.
  - Before insertion, the system checks if the `url` already exists in the database.
- **Storage**:
  - Articles are stored in a PostgreSQL table (`legislative_news`) with fields such as `title`, `description`, `published_date`, `state`, `topic`, and more.
  - Use timestamps to track when articles were created and ensure fresh data is always available.
- **Fresh Data**:
  - Fetch articles periodically using cron jobs or background workers to keep the data updated.
  - Use query parameters like `from` and `to` to fetch articles published within a specific time range.

---

## Scalability
### Handling Large Datasets
- **Database Indexing**:
  - Create indexes on frequently queried columns such as `state`, `topic`, and `published_date` to speed up lookups and filters.
- **Partitioning**:
  - Partition the `legislative_news` table by `state` or `topic` for efficient querying and management of large datasets.
- **Storage Strategies**:
  - Use cloud-based solutions like Supabase (PostgreSQL) with scalable storage capabilities.
  - Archive older articles that are less frequently accessed to a separate storage system (e.g., AWS S3 or Google Cloud Storage).

---

## Search Optimization
### Efficient Search Strategies
- **Full-Text Search**:
  - Utilize PostgreSQL's `tsvector` and `tsquery` for efficient full-text search across titles and descriptions.
- **Caching**:
  - Cache search results for frequently queried keywords using tools like Redis to reduce database load.
- **Pagination**:
  - Implement cursor-based pagination for efficient navigation through large datasets.

---

## Performance and Caching

### Caching
- **Avoid Redundant Fetches**:
  - Cache API responses for a configurable time using a caching layer like Redis or in-memory caching.
  - Avoid re-fetching articles if the requested time range has already been processed recently.
- **Processed Articles**:
  - Cache enriched or preprocessed articles to minimize repeated computations, such as determining `state` and `topic`.

### Pagination
- **Implementation**:
  - Use cursor-based pagination on endpoints like `/api/news` to fetch articles in chunks, improving performance and user experience.

---

## Security Considerations

### Input Sanitization
- Ensure that all user inputs (e.g., filters for `state`, `topic`, and `search`) are sanitized to prevent SQL injection or other attacks.
- Use parameterized queries in all database operations.

### Rate Limiting
- **API Protection**:
  - Implement rate-limiting middleware on fetching endpoints (e.g., `/api/aggregate`) to prevent abuse.
  - Set limits on the number of requests allowed per user per minute.

---

## Bonus Points

### Real-Time Updates
- **Simulated Real-Time Updates**:
  - Use WebSockets or Server-Sent Events (SSE) to notify users when new articles are published.
  - Alternatively, use a polling mechanism to check for updates periodically.

### User Personalization
- **Saved Preferences**:
  - Allow users to save their preferred `states` and `topics` in a database table linked to their user account.
  - Fetch personalized articles based on these preferences when users log in.

### Newsletter Subscription
- **Daily Email Summary**:
  - Provide an option for users to subscribe to a daily email summary of news articles.
  - Use tools like SendGrid or AWS SES to send emails.
  - Generate summaries by querying the latest articles for a user's saved `states` and `topics`.
