import asyncio
from crawl4ai import AsyncWebCrawler

async def main():
    async with AsyncWebCrawler(verbose=True) as crawler:
        result = await crawler.arun(
            url="https://fr.news.yahoo.com/", 
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3", 
            verbose=True,
            session_id="business_news_session",
            only_text=True,
        )
        print(result)

if __name__ == "__main__":
    asyncio.run(main())