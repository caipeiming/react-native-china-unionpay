import { NativeEventEmitter } from 'react-native'
import EventEmitter from 'events';
import { NativeModule } from './native-module'

class MyEmitter extends EventEmitter {}

export const UnionpayEmitter = new MyEmitter();

const nativeEventEmitter = new NativeEventEmitter(NativeModule);

nativeEventEmitter.addListener('UnionPayResponse', (data) => {
    UnionpayEmitter.emit('UnionPayResponse', data);
});