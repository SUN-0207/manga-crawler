export const ROOT = "www.toptruyentv7.pro";
export const DOMAIN = `https://${ROOT}/tim-truyen/`;
export const SUB_DOMAIN = `https://${ROOT}/tim-truyen/?page=page_index`;

export const BROWSER_CONFIG = {
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--disable-gpu',
    '--window-size=1920x1080',
  ],
}; 