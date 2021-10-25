### Apple Watch 7 库存检测

## 使用

全局安装 pm2

```bash
npm i pm2 -g
```

### 配置

邮件提醒相关
```js
const config = {
  EMAIL_SEND: "", // 发邮件的邮箱
  // qq邮箱在 [设置]->[账户]->[POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务] 获取
  EMAIL_PASS: "", // 邮箱授权码
  EMAIL_TO: "", // 接收邮件的邮箱
};
```

商品相关
```js
/** 门店编码 */
const STORE_NUMBER = "R484";
/** 购买页面的链接 */
const PAGE_LINK =
  "https://www.apple.com.cn/shop/buy-watch/apple-watch?configured=true&option.watch_cases=MKNN3CH%2FA&option.watch_bands=ML813FE%2FA&product=Z0YQ&step=detail";
/** 轮训间隔，分钟 */
const INTERVAL = 5;
```

获取门店编码步骤

![获取门店编码步骤](https://feiben-1253434158.cos.ap-guangzhou.myqcloud.com/PicGo/20211025165252.png)

1. 浏览器打开购买链接，选择门店
2. 打开浏览器控制台，切换至 Network (Fetch/XHR)
3. 刷新页面
4. 输入 fulfillment-messages 过滤请求
5. 查看门店编码

### 启动

```bash
npm run start
```

### 停止

```bash
npm run stop
```

### 删除 pm2 进程

```bash
npm run kill
```

如有疑问，欢迎联系我

![](https://feiben-1253434158.cos.ap-guangzhou.myqcloud.com/PicGo/20211025172151.png)


## 特别声明

任何人不得利用软件从事进行恶意抢购、加价代购、倒买倒卖等不正当行为，否则请自觉停止使用此软件。