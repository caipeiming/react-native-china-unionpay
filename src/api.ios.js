import { NativeModules } from 'react-native';

const { UnionPayModule } = NativeModules;

class Api {
    /**
     * 通过银联工具类启动支付插件
     * @param  {[type]} tn:   string        交易流水号
     * @param  {[type]} mode: string        连接环境："00" - 银联正式环境 "01" - 银联测试环境，该环境中不发生真实交易
     */
    startPay(tn: string, mode: string) {
        UnionPayModule.startPay(tn, mode);
    }

    /**
     * 检查是否安装银联 App 的接口
     * @return {[type]} Promise
     */
    isPaymentAppInstalled(): Promise {
        return UnionPayModule.isPaymentAppInstalled();
    }
}

export const Unionpay = new Api();