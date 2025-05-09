import { MangaCrawler } from './services/MangaCrawler';

async function main() {
  const crawler = new MangaCrawler();
  
  try {
    await crawler.crawlAllManga();
  } catch (error) {
    console.error('Error in main process:', error);
    process.exit(1);
  }
}

main(); 