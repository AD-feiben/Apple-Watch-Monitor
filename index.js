import fetch from "node-fetch";
import url from "url";
import querystring from "querystring";
import schedule from "node-schedule";
import nodemailer from "nodemailer";
import player from 'play-sound';

/*****************************************/
const config = {
  EMAIL_SEND: "",
  EMAIL_PASS: "",
  EMAIL_TO: "",
};

let transporter = nodemailer.createTransport({
  host: "smtp.qq.com",
  secure: true, // true for 465, false for other ports
  auth: {
    user: config.EMAIL_SEND, // generated ethereal user
    pass: config.EMAIL_PASS, // generated ethereal password
  },
});
const sendEmail = async ({ text, desp }) => {
  return transporter.sendMail({
    from: `[Apple Store库存更新提醒]<${config.EMAIL_SEND}>`, // sender address
    to: config.EMAIL_TO, // list of receivers
    subject: text, // Subject line
    text: desp, // plain text body
  });
};

/*****************************************/

/** 门店编码，请自行抓包 */
const STORE_NUMBER = "R484";
/** 购买页面的链接 */
const PAGE_LINK =
  "https://www.apple.com.cn/shop/buy-watch/apple-watch?configured=true&option.watch_cases=MKNN3CH%2FA&option.watch_bands=ML813FE%2FA&product=Z0YQ&step=detail";
/** 轮训间隔，分钟 */
const INTERVAL = 5;

/** 检查库存 */
async function checkInventory() {
  try {
    const query = querystring.parse(url.parse(PAGE_LINK).query);
    const { product } = query;
    let option = encodeURIComponent(
      ["option.watch_cases", "option.watch_bands"]
        .map((k) => query[k])
        .join(",")
    );
    const apiUrl = `https://www.apple.com.cn/shop/fulfillment-messages?parts.0=${product}&searchNearby=true&mt=regular&option.0=${option}&store=${STORE_NUMBER}`;

    const response = await fetch(apiUrl);
    const res = await response.json();

    if (res.head && res.head.status === "200") {
      const store = res.body.content.pickupMessage.stores[0];
      if (!store) return;

      const storeName = store.storeName;
      const pickupDisplay = store.partsAvailability[product].pickupDisplay;

      if (pickupDisplay === "available") {
        await sendEmail({
          text: `${storeName}来货了`,
          desp: `赶紧打开${PAGE_LINK}购买吧`,
        }).catch();
        playAlert();
      } else {
        /** 没库存，5分钟后再次查询 */
        const date = new Date(Date.now() + INTERVAL * 60 * 1000);
        console.log(
          `暂时没有库存，${date.toLocaleString()} 将进行下一次库存检查`
        );
        schedule.scheduleJob(date, checkInventory);
      }
    }
  } catch (error) {
    console.log(error);
    await sendEmail({
      text: `发生异常`,
      desp: error,
    }).catch();
  }
}

checkInventory();

function playAlert() {
  player({}).play('./alert.mp3');
}
