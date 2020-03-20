
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
  