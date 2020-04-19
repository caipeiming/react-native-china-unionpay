



# react-native-rn-unionpay

## 安装

### React Native 0.60 或以上
```sh
npm install react-native-rn-unionpay
cd ios && pod install # for iOS
```
### React Native 0.59 以下
```sh
npm install react-native-rn-unionpay
react-native link react-native-rn-unionpay
```
### iOS 配置
- 在工程 info.plist 设置中添加一个 URL Types 回调协议（在 UPPayDemo 工程中使 用“UPPayDemo”作为协议），用于在支付完成后返回商户客户端。请注意 URL Schemes 需要是唯一的。

- http 请求设置(ats)
在测试环境测试时，需要在工程对应的 plist 文件中添加 NSAppTransportSecurity Dictionary 并同时设置里面NSAllowsArbitraryLoads 属性值为 YES，具体设置可参 照以下截图:

发生产环境可删除此设置。向 Apple 发布正式版本时请删除此设置。
- 添加协议白名单
在 Xcode7.0 之后的版本中进行开发，需要在工程对应的 plist 文件中，添加 LSApplicationQueriesSchemes Array 并加入 uppaysdk、uppaywallet、uppayx1、 uppayx2、uppayx3 五个 item，具体设置可参考以下截图：

或者直接添加如下代码到 plist 文件中：
```plist
<key>LSApplicationQueriesSchemes</key>
<array>
    <string>uppaysdk</string>
    <string>uppaywallet</string>
    <string>uppayx1</string>
    <string>uppayx2</string>
    <string>uppayx3</string>
</array>
```
- AppDelegate.m 的 下面 @end 前面添加下面代码
```m
// iOS 9.x or newer
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}

// iOS 8.x or older
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
  return [RCTLinkingManager application:application openURL:url sourceApplication:sourceApplication annotation:annotation];
}
```

## 使用
```javascript
import {Unionpay, UnionpayEmitter, UNIONPAY_MODAL_PRODUCTION, UNIONPAY_MODAL_DEVELOPMENT} from 'react-native-china-unionpay';
```
## Api

| Method                                                            | Return Type         |  iOS | Android |
| ----------------------------------------------------------------- | ------------------- | :--: | :-----: |
| [startPay()](#startPay)                                   | `void`   |  ✅  |   ✅    |
| [startSEPay()](#startSEPay)                                     | `void`   |  ❌  |   ✅    |
| [getSEPayInfo()](#getSEPayInfo)                       | `Promise<object>`            |  ❌  |   ✅    |
| [checkWalletInstalled()](#checkWalletInstalled)                       | `Promise<boolean>`            |  ❌  |   ✅    |
| [isPaymentAppInstalled()](#isPaymentAppInstalled)                       | `Promise<boolean>`            |  ✅  |   ❌    |
---
### startPay(tn: string, mode: string)
tn - 交易流水号
mode - 连接环境："00" - 银联正式环境 "01" - 银联测试环境，该环境中不发生真实交易
通过银联工具类启动支付插件，支付结果在 [`UnionpayEmitter`](#UnionpayEmitter) 事件中获取。
#### Examples
```js
Unionpay.startPay(tn, UNIONPAY_MODAL_DEVELOPMENT);
```
### startSEPay(tn: string, mode: string, seType: string)
tn - 交易流水号
mode - 连接环境："00" - 银联正式环境 "01" - 银联测试环境，该环境中不发生真实交易
指定手机 Pay 支付接口调用
seType - 手机pay支付类别

调用指定手机Pay支付接口（startSEPay()）之前，需要先调用检查手机Pay状态接口（getSEPayInfo()）获取seType，startSEPay()调用方式同startPay()。
#### Examples
```js
Unionpay.startSEPay(tn, UNIONPAY_MODAL_DEVELOPMENT, seType);
```
### getSEPayInfo()
检查手机 Pay 状态接口
#### Examples
```js
Unionpay.getSEPayInfo().then(data => {
    console.log(data);
}).catch(error => {
    console.log(error.message);
});
```
### checkWalletInstalled()
检测是否已安装云闪付客户端接口调用
#### Examples
```js
Unionpay.checkWalletInstalled().then(data => {
    console.log(data);
}).catch(error => {
    console.log(error.message);
});
```
### isPaymentAppInstalled()
检测是否已安装银联 App 接口调用
#### Examples
```js
Unionpay.isPaymentAppInstalled().then(data => {
    console.log(data);
});
```
### UnionpayEmitter
用于支付结果的事件订阅。支付结果的 `pay_result` 参数有3个选项：
- success   支付成功
- fail   支付失败
- cancel   用户取消了支付
#### Examples
```js
export default class App extends Component {
    constructor(props) {
        super(props);
        this.onUnionPayResponse = this._onUnionPayResponse.bind(this);
    }

    componentDidMount() {
        UnionpayEmitter.on("UnionPayResponse", this.onUnionPayResponse);
    }

    componentWillUnmount() {
        this.isMount = false;
        UnionpayEmitter.removeListener('UnionPayResponse', this.onUnionPayResponse);
    }

    _onUnionPayResponse(data) {
        console.log(data);
    }
```
### mode 常量
连接环境，有2个常量选项
- UNIONPAY_MODAL_PRODUCTION
银联正式环境
- UNIONPAY_MODAL_DEVELOPMENT
银联测试环境，该环境中不发生真实交易


## 测试账号

[参考官网的测试环境的测试卡信息](https://open.unionpay.com/tjweb/support/faq/mchlist?id=4)
测试卡信息-前台类交易
```
招商银行借记卡：6226090000000048
    手机号：18100000000
    密码：111101
    短信验证码：111111（先点获取验证码之后再输入）
    证件类型：01
    证件号：510265790128303
    姓名：张三
```
```
华夏银行贷记卡：6226388000000095
    手机号：18100000000
    cvn2：248
    有效期：1225（后台接口注意格式YYMM需倒一下）
    短信验证码：111111（先点获取验证码之后再输入）
    证件类型：01
    证件号：510265790128303
    姓名：张三
```
```
平安银行借记卡：6216261000000000018
    手机号：13552535506
    证件类型：01
    证件号：341126197709218366
    密码：123456
    姓名：全渠道
    短信验证码：111111（先点获取验证码之后再输入）
```
```
平安银行贷记卡：6221558812340000
    手机号：13552535506
    cvn2：123
    有效期：1123（后台接口注意格式YYMM需倒一下）
    短信验证码：111111（先点获取验证码之后再输入）
    姓名：互联网
    证件类型：01
    证件号：341126197709218366
```
```
农行贷记卡：5200831111111113
    手机号：13552535506
    cvn2：123
    有效期：1125（后台接口注意格式YYMM需倒一下）
    短信验证码：111111（先点获取验证码之后再输入）
    姓名：全渠道
    证件类型：01
    身份证号：341126197709218366
```
```
平安银行贷记卡：6221558812340013（信用卡还款被还款信用卡）
    手机号：13552535506
    cvn2：123
    有效期：1123（后台接口注意格式YYMM需倒一下）
    短信验证码：111111（先点获取验证码之后再输入）
    姓名：全渠道
    证件类型：01
    证件号：341126197709218366
    ```