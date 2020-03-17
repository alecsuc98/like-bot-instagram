const instagram = require("./insta-bot");

const LIKED_ACC = ""; // insert the profile to be liked

const username = ""; // insert your username
const password = ""; // insert password

(async () => {
  await instagram.initialize();

  await instagram.login(username, password);
  await instagram.autoLike(LIKED_ACC);
})();
