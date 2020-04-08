
package com.cpming.rn.unionpay;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.unionpay.UPPayAssistEx;
import com.unionpay.UPQuerySEPayInfoCallback;
import com.unionpay.UPSEInfoResp;

import org.json.JSONException;
import org.json.JSONObject;

import javax.annotation.Nonnull;

public class RCTUnionpayModule extends ReactContextBaseJavaModule implements ActivityEventListener {
    private final String TAG = "RCTUnionpayModule";
    private ReactApplicationContext reactContext;

    public RCTUnionpayModule(@Nonnull ReactApplicationContext reactContext) {
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
        // 处理银联手机支付控件返回的支付结果
        if (data == null) {
            return;
        }
        WritableMap response = Arguments.createMap();
        String msg = "";
        /*
         * 支付控件返回字符串:success、fail、cancel 分别代表支付成功，支付失败，支付取消
         */
        String str = data.getExtras().getString("pay_result");
        if (str.equalsIgnoreCase("success")) {
            // 如果想对结果数据验签，可使用下面这段代码，但建议不验签，直接去商户后台查询交易结果
            // result_data结构见c）result_data参数说明
            if (data.hasExtra("result_data")) {
                String result = data.getExtras().getString("result_data");
                try {
                    JSONObject resultJson = new JSONObject(result);
                    String sign = resultJson.getString("sign");
                    String dataOrg = resultJson.getString("data");
                    response.putString("sign", sign);
                    response.putString("data", dataOrg);
                    /*
                    // 此处的verify建议送去商户后台做验签
                    // 如要放在手机端验，则代码必须支持更新证书
                    boolean ret = verify(dataOrg, sign, mMode);
                    if (ret) {
                        // 验签成功，显示支付结果
                        msg = "支付成功！";
                    } else {
                        // 验签失败
                        msg = "支付失败！";
                    }
                    */
                } catch (JSONException e) {
                }
            }
            // 结果result_data为成功时，去商户后台查询一下再展示成功
            msg = "支付成功！";
        } else if (str.equalsIgnoreCase("fail")) {
            msg = "支付失败！";
        } else if (str.equalsIgnoreCase("cancel")) {
            msg = "用户取消了支付";
        }
        response.putString("pay_result", str);
        response.putString("msg", msg);
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("UnionPayResponse", response);
    }

    @Override
    public void onNewIntent(Intent intent) {

    }

    /**
     * 通过银联工具类启动支付插件
     *
     * @param tn   交易流水号
     * @param mode 连接环境："00" - 银联正式环境 "01" - 银联测试环境，该环境中不发生真实交易
     */
    @ReactMethod
    public void startPay(String tn, String mode) {
        UPPayAssistEx.startPay(getCurrentActivity(), null, null, tn, mode);
    }

    /**
     * 指定手机 pay 支付接口
     *
     * @param tn     交易流水号
     * @param mode   连接环境："00" - 银联正式环境 "01" - 银联测试环境，该环境中不发生真实交易
     * @param seType 手机pay支付类别
     */
    @ReactMethod
    public void startSEPay(String tn, String mode, String seType) {
        UPPayAssistEx.startSEPay(getCurrentActivity(), null, null, tn, mode, seType);
    }

    /**
     * 检查手机 pay 状态的接口
     *
     * @param promise
     */
    @ReactMethod
    public void getSEPayInfo(final Promise promise) {
        UPPayAssistEx.getSEPayInfo(this.reactContext, new UPQuerySEPayInfoCallback() {
            @Override
            public void onResult(String SEName, String seType, int cardNumbers, Bundle reserved) {
                WritableMap response = Arguments.createMap();
                response.putString("SEName", SEName);
                response.putString("seType", seType);
                response.putInt("cardNumbers", cardNumbers);
                response.putMap("reserved", Arguments.fromBundle(reserved));
                promise.resolve(response);
            }

            @Override
            public void onError(String SEName, String seType, String errorCode, String errorDesc) {
                if (errorDesc == null) {
                    if (errorCode.equals(UPSEInfoResp.ERROR_NOT_SUPPORT)) {
                        errorDesc = "硬件不支持 XXpay";
                    } else if (errorCode.equals(UPSEInfoResp.ERROR_NOT_READY)) {
                        errorDesc = "未开通 XXpay";
                    } else if (errorCode.equals(UPSEInfoResp.ERROR_NONE)) {
                        errorDesc = "可用卡数为0";
                    } else if (errorCode.equals(UPSEInfoResp.ERROR_TSM_UNINSTALLED)) {
                        errorDesc = "检测未安装 TSM 控件";
                    } else if (errorCode.equals(UPSEInfoResp.ERROR_TIMEOUT)) {
                        errorDesc = "接口超时";
                    }
                }
                WritableMap response = Arguments.createMap();
                response.putString("SEName", SEName);
                response.putString("seType", seType);
                response.putString("errorCode", errorCode);
                response.putString("errorDesc", errorDesc);
                promise.reject(errorCode, errorDesc, response);
            }
        });
    }

    /**
     * 检查是否安装云闪付客户端的接口
     *
     * @param promise
     */
    @ReactMethod
    public void checkWalletInstalled(Promise promise) {
        boolean res = UPPayAssistEx.checkWalletInstalled(getCurrentActivity());
        promise.resolve(res);
    }

}
