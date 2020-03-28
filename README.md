
# react-native-rn-unionpay

## Getting started

`$ npm install react-native-rn-unionpay --save`

### Mostly automatic installation

`$ react-native link react-native-rn-unionpay`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-rn-unionpay` and add `RNRnUnionpay.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNRnUnionpay.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.cpming.rn.unionpay.RNRnUnionpayPackage;` to the imports at the top of the file
  - Add `new RNRnUnionpayPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-rn-unionpay'
  	project(':react-native-rn-unionpay').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-rn-unionpay/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-rn-unionpay')
  	```


## Usage
```javascript
import RNRnUnionpay from 'react-native-rn-unionpay';

// TODO: What to do with the module?
RNRnUnionpay;
```

https://open.unionpay.com/tjweb/support/faq/mchlist?id=4


测试卡信息-前台类交易

招商银行借记卡：6226090000000048
    手机号：18100000000
    密码：111101
    短信验证码：111111（先点获取验证码之后再输入）
    证件类型：01
    证件号：510265790128303
    姓名：张三

华夏银行贷记卡：6226388000000095
    手机号：18100000000
    cvn2：248
    有效期：1225（后台接口注意格式YYMM需倒一下）
    短信验证码：111111（先点获取验证码之后再输入）
    证件类型：01
    证件号：510265790128303
    姓名：张三

平安银行借记卡：6216261000000000018
    手机号：13552535506
    证件类型：01
    证件号：341126197709218366
    密码：123456
    姓名：全渠道
    短信验证码：111111（先点获取验证码之后再输入）

平安银行贷记卡：6221558812340000
    手机号：13552535506
    cvn2：123
    有效期：1123（后台接口注意格式YYMM需倒一下）
    短信验证码：111111（先点获取验证码之后再输入）
    姓名：互联网
    证件类型：01
    证件号：341126197709218366

农行贷记卡：5200831111111113
    手机号：13552535506
    cvn2：123
    有效期：1125（后台接口注意格式YYMM需倒一下）
    短信验证码：111111（先点获取验证码之后再输入）
    姓名：全渠道
    证件类型：01
    身份证号：341126197709218366

平安银行贷记卡：6221558812340013（信用卡还款被还款信用卡）
    手机号：13552535506
    cvn2：123
    有效期：1123（后台接口注意格式YYMM需倒一下）
    短信验证码：111111（先点获取验证码之后再输入）
    姓名：全渠道
    证件类型：01
    证件号：341126197709218366