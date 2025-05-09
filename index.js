const puppeteer = require("puppeteer-extra");

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const fs = require("fs");
const axios = require("axios");
const path = require("path");

const ROOT = "www.toptruyenww.pro";
const DOMAIN = `https://${ROOT}/tim-truyen/`;
const SUB_DOMAIN = `https://${ROOT}/tim-truyen/?page=page_index`;

async function writeLog(logString) {
  // Get the current time
  const now = new Date();
  const currentTime = now.toTimeString().split(" ")[0]; // Extract HH:MM:SS

  // Append the log string with the current time to the log file
  fs.appendFile(
    "error_log_nettruyentop.txt",
    `${currentTime}\t${logString}\n`,
    "utf8",
    (err) => {
      if (err) {
        console.error("Error writing to log file:", err);
      }
    }
  );
}

// Function to get detailed item information
async function getDetailItem(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url);

  console.log("Manga Url: ", url);

  const result = await page.evaluate(() => {
    const detail = {
      titleManga: document.querySelector(".title-manga")?.textContent || "",
      timeUpdate: (document.querySelector(".time-update")?.textContent || "")
        .replace(/-?\s*Cập nhật\s+lúc:/g, "")
        .replace(/\n/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/-$/, "")
        .trim(),
      overViewComic: {
        imageInfo:
          document.querySelector(".image-info img")?.getAttribute("src") || "",
        infoDetailComic: {
          nameOther: (
            document.querySelector(
              ".info-detail-comic .name-other .detail-info"
            )?.textContent || ""
          )
            .replace(/\n/g, " ")
            .replace(/\s+/g, " ")
            .trim(),
          author: (
            document.querySelector(".info-detail-comic .author .detail-info")
              ?.textContent || ""
          )
            .replace(/\n/g, " ")
            .replace(/\s+/g, " ")
            .trim(),
          status: (
            document.querySelector(".info-detail-comic .status .detail-info")
              ?.textContent || ""
          )
            .replace(/\n/g, " ")
            .replace(/\s+/g, " ")
            .trim(),
          category: Array.from(
            document.querySelectorAll(
              ".info-detail-comic .category .detail-info .cat-detail a"
            )
          ).map((el) => el.textContent.trim()),
          translateGroup:
            document.querySelector(
              ".info-detail-comic .translate-group .detail-info"
            )?.textContent || "",
          viewTotal:
            document.querySelector(
              ".info-detail-comic .view-total .detail-info"
            )?.textContent || "",
          viewLike:
            document.querySelector(".info-detail-comic .view-like .detail-info")
              ?.textContent || "",
          totalFollow: (
            document.querySelector(
              ".info-detail-comic .total-follow .detail-info"
            )?.textContent || ""
          )
            .replace(/\n/g, " ")
            .replace(/\s+/g, " ")
            .trim(),
        },
      },
      chapters: [],
    };

    const chapterList = document.querySelectorAll(".chapters a");
    detail.chapters = Array.from(chapterList).map((chapter) => ({
      name: chapter.textContent.trim(),
      link: chapter.getAttribute("href"),
    }));

    return detail;
  });

  await browser.close();

  return result;
}

// Function to get items
async function getItems(index) {
  const url = SUB_DOMAIN.replace("page_index", index);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url);

  // Assuming autoScroll is defined elsewhere
  await autoScroll(page);

  const items = await page.evaluate(() => {
    const result = [];

    // Select all elements with the class "item-manga"
    const itemMangaElements = document.querySelectorAll(".item-manga");

    // Loop through each element and extract the necessary data
    itemMangaElements.forEach((element) => {
      const item = {
        imageItem: {
          link:
            element.querySelector(".image-item a")?.getAttribute("href") || "",
          image:
            element.querySelector(".image-item img")?.getAttribute("src") || "",
          title: element.querySelector(".title span")?.textContent || "",
          infoManga: {
            eye:
              element
                .querySelectorAll(".image-item .info-manga span")[0]
                ?.textContent.trim() || "",
            comment:
              element
                .querySelectorAll(".image-item .info-manga span")[1]
                ?.textContent.trim() || "",
            heart:
              element
                .querySelectorAll(".image-item .info-manga span")[2]
                ?.textContent.trim() || "",
          },
        },
        mangaInformation: {
          title:
            element.querySelector(".manga-information .title span")
              ?.textContent || "",
          image:
            element
              .querySelector(".manga-information .image-mini img")
              ?.getAttribute("data-original") || "",
          synopsis: {
            genres:
              element
                .querySelectorAll(".synopsis p")[0]
                ?.textContent.split(":")[1]
                ?.trim()
                ?.split(",")
                .map((text) => text.trim()) || [],
            view:
              element
                .querySelectorAll(".synopsis p")[1]
                ?.textContent.split(":")[1]
                ?.trim() || "",
            status:
              element
                .querySelectorAll(".synopsis p")[2]
                ?.textContent.split(":")[1]
                ?.replace(/\s+/g, " ")
                .trim() || "",
            comment:
              element
                .querySelectorAll(".synopsis p")[3]
                ?.textContent.split(":")[1]
                ?.trim() || "",
            subscriber:
              element
                .querySelectorAll(".synopsis p")[4]
                ?.textContent.split(":")[1]
                ?.trim() || "",
            like:
              element
                .querySelectorAll(".synopsis p")[5]
                ?.textContent.split(":")[1]
                ?.replace(/\s+/g, " ")
                .trim() || "",
            updateTime:
              element
                .querySelectorAll(".synopsis p")[6]
                ?.textContent.split(":")[1]
                ?.replace(/\s+/g, " ")
                .trim() || "",
          },
        },
        contentManga:
          element
            .querySelector(".content-manga p")
            ?.textContent.replace(/\s+/g, " ")
            .trim() || "",
      };

      result.push(item);
    });

    return result;
  });

  // Fetch additional details for each item
  for (const item of items) {
    item.detail = await getDetailItem(item.imageItem.link);
  }

  await browser.close();

  return items;
}

async function getMangaData(maxIndex) {
  const result = [];

  for (let i = 1; i < maxIndex; i++) {
    const item = await getItems(i);
    result.push(item);
  }
  dumpData(result);
}

async function dumpData(data) {
  fs.writeFileSync("mangaData.json", JSON.stringify(...data, null, 2));
}

async function downloadAllEpisodes(parentFolder, chapterList) {
  for (const chapter of chapterList) {
    const chapterFolder = path.join(parentFolder, chapter.name);

    // Ensure the folder exists
    if (!fs.existsSync(chapterFolder)) {
      try {
        fs.mkdirSync(chapterFolder, { recursive: true });
        console.log(`Folder "${chapterFolder}" created successfully!`);
        writeLog(`Folder "${chapterFolder}" created successfully!`);
      } catch (err) {
        console.log("Error creating folder:", err);
        writeLog(`Error creating folder: ${err}`);

        continue; // Skip the current chapter if the folder creation failed
      }
    }

    console.log("Start download: ", chapter.name);
    writeLog(`Start download: ${chapter.name}`);

    try {
      await downloadImages(chapter.link, chapterFolder);
      console.log(`Download completed: ${chapter.name}`);
      writeLog(`Download completed: ${chapter.name}`);
    } catch (error) {
      console.log("Error downloading images for chapter:", chapter.name);
      writeLog(`Error downloading images for chapter: ${chapter.name}`);
      console.log(error);
    }
  }
}

async function downloadImage(nameFile, folder, url) {
  // Clean up the nameFile string and add the extension
  const fixedName = path.join(folder, nameFile) + ".jpg";

  // Ensure the folder exists (using promises for async support)
  try {
    if (!fs.existsSync(folder)) {
      await fs.promises.mkdir(folder, { recursive: true });
      console.log(`Folder "${folder}" created successfully!`);
      writeLog(`Folder "${folder}" created successfully!`);
    }
  } catch (err) {
    console.error("Error creating folder:", err);
    writeLog(`Error creating folder: ${err}`);
    return; // Exit function if folder creation fails
  }

  try {
    const response = await axios.get(url, {
      responseType: "stream", // Stream the response (image data)
      headers: { referer: "https://www.toptruyenww.pro" }, // Add referer header
    });

    // Handle response errors
    if (response.status !== 200) {
      console.warn("Warning: unexpected response status", response.status);
      return;
    }

    // Create a write stream and save the image
    const writer = fs.createWriteStream(fixedName);

    // Use a promise to handle the stream completion
    await new Promise((resolve, reject) => {
      response.data.pipe(writer);

      writer.on("finish", resolve); // Resolve on success
      writer.on("error", reject); // Reject on error
    });

    console.log("Download completed:", fixedName);
    writeLog(`Download completed: ${fixedName}`);
  } catch (error) {
    console.error("Error during download:", error.message || error);
    writeLog(`Error during download: ${error.message || error}`);
  }
}

async function downloadImages(address, folder) {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Navigate the page to the specified URL
  await page.goto(address);

  // Extract image data from the page
  const itemList = await page.evaluate(() => {
    const imageList = document.querySelectorAll(".page-chapter img");
    const images = [];

    imageList.forEach((image) => {
      const item = {
        alt: image.getAttribute("alt"),
        src: image.getAttribute("src"),
        dataIndex: image.getAttribute("data-index"),
      };
      images.push(item);
    });

    return images;
  });

  // Loop through the itemList and download each image
  for (const item of itemList) {
    const imageUrl = item.src.includes("https")
      ? item.src
      : `https:${item.src}`;
    try {
      await downloadImage(item.alt, folder, imageUrl);
    } catch (error) {
      console.error(`Error downloading image ${item.alt}:`, error);
      writeLog(`Error downloading image ${item.alt}: ${error}`);
    }
  }

  // Close the browser instance after all images are downloaded
  await browser.close();
}

async function downloadMangaData(params) {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto(DOMAIN);

  const maxPageIndex = await page.evaluate(() => {
    const ul = document.querySelector(".pagination");
    if (!ul) {
      return 0;
    }

    const items = Array.from(ul.querySelectorAll(".page-item")).map((li) => {
      const index = Number(li.textContent.trim());
      return isNaN(index) ? 0 : index;
    });

    return Math.max(...items);
  });

  // await getMangaData(maxPageIndex);

  let allItems = [];

  try {
    // Read manga data from file
    const fileData = await fs.promises.readFile("mangaData.json", "utf8");
    allItems = JSON.parse(fileData); // Parse JSON data
    console.log("Manga data read successfully");
    writeLog("Manga data read successfully");
  } catch (err) {
    console.error("Error reading manga data file:", err);
    writeLog(`Error reading manga data file: ${err}`);
  }

  // Ensure the root folder exists
  if (!fs.existsSync(ROOT)) {
    try {
      await fs.promises.mkdir(ROOT, { recursive: true });
      console.log(`Root folder "${ROOT}" created successfully!`);
      writeLog(`Root folder "${ROOT}" created successfully!`);
    } catch (err) {
      console.error("Error creating root folder:", err);
      writeLog(`Error reading manga data file: ${err}`);
      return;
    }
  }

  // Process each manga item
  for (const item of [allItems[0]]) {
    console.log("Processing manga:", item.mangaInformation.title);
    writeLog(`Processing manga: ${item.mangaInformation.title}`);
    const title = item.mangaInformation.title;

    const folderName = ROOT + "/" + title;

    // Ensure the manga folder exists
    if (!fs.existsSync(folderName)) {
      try {
        await fs.promises.mkdir(folderName, { recursive: true });
        console.log(`Manga folder "${folderName}" created successfully!`);
        writeLog(`Manga folder "${folderName}" created successfully!`);
      } catch (err) {
        console.error("Error creating manga folder:", err);
        writeLog(`Error creating manga folder: ${err}`);
        continue; // Skip to the next manga if folder creation fails
      }
    }

    // Download all episodes for this manga
    try {
      await downloadAllEpisodes(folderName, item.detail.chapters);
    } catch (err) {
      console.error(`Error downloading episodes for manga "${title}":`, err);
      writeLog(`Error downloading episodes for manga "${title}": ${err}`);
    }
  }

  // Close the browser instance
  await browser.close();
}

// Function to scroll the page down and wait for the content to load
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      let totalHeight = 0;
      const distance = 100; // Distance to scroll
      const scrollInterval = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;

        // Check if we've reached the bottom of the page
        if (totalHeight >= document.body.scrollHeight) {
          clearInterval(scrollInterval);
          resolve();
        }
      }, 100); // Scroll every 100 milliseconds
    });
  });
}

(async () => {
  await downloadMangaData();
})();
