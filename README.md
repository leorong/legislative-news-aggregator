Legislative News Aggregator
Description
A web application that aggregates news articles related to state legislatures, lawmakers, and legislative actions. Users can filter news by state and topic, search for specific keywords, and view detailed articles. The project leverages the NewsAPI for fetching news and integrates with Supabase for database operations.

Features
News Aggregation: Fetch and aggregate news articles using the NewsAPI.
Filtering: Filter articles by state and topic.
Search Functionality: Search articles by keywords in the title or description.
Pagination: Efficient pagination using a cursor-based approach.
Detailed Article View: View full details of selected news articles.
Technologies Used
Frontend: Next.js (React framework)
Backend: API routes in Next.js
Database: Supabase
Styling: CSS Modules
API: NewsAPI
Setup Instructions
Prerequisites
Node.js and npm/yarn installed.
A NewsAPI account with an API key.
A Supabase project with a database.
Environment Variables
Create a .env.local file in the root directory and add the following:

makefile
Copy code
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEWS_API_KEY=your-newsapi-key
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/username/repo-name.git
cd repo-name
Install dependencies:

bash
Copy code
npm install
# or
yarn
Start the development server:

bash
Copy code
npm run dev
# or
yarn dev
Open the app in your browser:

arduino
Copy code
http://localhost:3000
Usage
Aggregating News
Navigate to the /news-aggregator page.
Select a start date and end date.
Click "Fetch Aggregated News" to pull articles from the NewsAPI.
View the number of new articles saved to the database.
Viewing News Articles
Navigate to the /news page.
Filter articles by state and topic.
Search for articles by entering keywords.
Click on a news title to view detailed information about the article.
Project Structure
graphql
Copy code
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
API Endpoints
News Aggregation: /api/aggregate
Fetches news articles from NewsAPI and saves them to the database.
Supports startDate and endDate query parameters.
News Listing: /api/news
Fetches news articles from the database.
Supports filters for state, topic, and search.
Implements cursor-based pagination using cursor and limit.
Future Enhancements
Add user authentication for personalized news preferences.
Implement additional filtering and sorting options.
Improve UI/UX with advanced design elements.
License
This project is licensed under the MIT License.

Contributors
Your Name - GitHub Profile
Feel free to contribute to this project by submitting issues or pull requests.