const puppeteer = require("puppeteer");
const scrollToBottom = require("puppeteer-autoscroll-down");

const BASE_URL = "https://instagram.com";

const instagram = {
  browser: null,
  page: null,

  initialize: async () => {
    instagram.browser = await puppeteer.launch({
      headless: false
    });

    instagram.page = await instagram.browser.newPage();
  },

  login: async (username, password) => {
    await instagram.page.goto(BASE_URL, { waitUntil: "networkidle2" });
    await instagram.page.waitFor('input[name="username"]');

    await instagram.page.type('input[name="username"]', username);

    await instagram.page.type('input[name="password"]', password);

    let button = await instagram.page.$x(
      '//*[@id="react-root"]/section/main/article/div[2]/div[1]/div/form/div[4]/button/div'
    );

    await button[0].click();

    await instagram.page.waitFor(
      '//*[@id="react-root"]/section/nav/div[2]/div/div/div[3]/div/div[4]/a/img'
    );

    button = await instagram.page.$x(
      "/html/body/div[4]/div/div/div[3]/button[2]"
    );

    await button[0].click();
  },

  autoLike: async profile => {
    await instagram.page.goto("https://www.instagram.com/" + profile);

    // scrape displayed images then scroll to the bottom to generate new ones
    let heightTemp = 0;
    let likeCounter = 0;
    let alreadyLiked = 0;
    while (1) {
      let postsArray = await instagram.page.$$(
        "#react-root > section > main > div > div._2z6nI > article > div > div > div > div"
      );

      for (let post of postsArray) {
        await post.click();
        await instagram.page.waitFor('svg[aria-label="Comment"');
        let isLikeable = await instagram.page.$x(
          "/html/body/div[4]/div[2]/div/article/div[2]/section[1]/span[1]/button"
        );

        if (isLikeable[0]) {
          await isLikeable[0].click();
          likeCounter += 1;
        } else {
          alreadyLiked += 1;
        }

        console.log(
          `Likes => ${likeCounter} ///// Already liked => ${alreadyLiked}`
        );

        let closeBtn = await instagram.page.$('svg[aria-label="Close"');
        await closeBtn.click();
      }

      let pageHeight = await scrollToBottom(instagram.page);
      if (heightTemp === pageHeight) {
        break;
      } else {
        heightTemp = pageHeight;
      }
    }
  }
};

module.exports = instagram;
