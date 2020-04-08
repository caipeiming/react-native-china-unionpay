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
     * 指定手机 pay 支付接口
     * @param  {[type]} tn:     string        交易流水号
     * @param  {[type]} mode:   string        连接环境："00" - 银联正式环境 "01" - 银联测试环境，该环境中不发生真实交易
     * @param  {[type]} seType: string        手机pay支付类别
     */
    startSEPay(tn: string, mode: string, seType: string) {
        UnionPayModule.startSEPay(tn, mode, seType);
    }

    /**
     * 检查手机 pay 状态的接口
     * @return {[type]} Promise
     */
    getSEPayInfo(): Promise {
        return UnionPayModule.getSEPayInfo();
    }

    /**
     * 检查是否安装云闪付客户端的接口
     * @return {[type]} Promise
     */
    checkWalletInstalled(): Promise {
        return UnionPayModule.checkWalletInstalled();
    }
}

export const Unionpay = new Api();