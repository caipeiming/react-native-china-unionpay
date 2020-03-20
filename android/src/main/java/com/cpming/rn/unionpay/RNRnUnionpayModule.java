
package com.cpming.rn.unionpay;

import android.app.Activity;
import android.content.Intent;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.unionpay.UPPayAssistEx;

import javax.annotation.Nonnull;

public class RNRnUnionpayModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    private ReactApplicationContext reactContext;

    public RNRnUnionpayModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.reactContext.addActivityEventListener(this);
    }

    @Nonnull
    @Override
    public String getName() {
        return "UnionPayModule";
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {

    }

    @Override
    public void onNewIntent(Intent intent) {

    }

    /**
     * 通过银联工具类启动支付插件
     *
     * @param tn   交易流水号
     * @param mode 连接环境："00" - 启动银联正式环境 "01" - 连接银联测试环境
     */
    @ReactMethod
    public void startPay(String tn, String mode) {
        UPPayAssistEx.startPay(this.reactContext, null, null, tn, mode);
    }
}
