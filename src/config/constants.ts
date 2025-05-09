export const ROOT = "www.toptruyentv6.pro";
export const DOMAIN = `https://${ROOT}/tim-truyen/`;
export const SUB_DOMAIN = `https://${ROOT}/tim-truyen/?page=page_index`;

export const BROWSER_CONFIG = {
  headless: true,
  timeout: 30000, // 30 seconds
  retryCount: 3,
  retryDelay: 1000, // 1 second
};

export const DOWNLOAD_CONFIG = {
  concurrentDownloads: 5,
  timeout: 60000, // 60 seconds
  retryCount: 3,
  retryDelay: 1000,
};

export const LOG_FILE = "error_log_nettruyentop.txt"; 