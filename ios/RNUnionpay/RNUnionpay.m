
#import "RNUnionpay.h"
#import "UPPaymentControl.h"

@implementation RNUnionpay

- (instancetype)init
{
    self = [super init];
    if (self) {
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(handleOpenURL:) name:@"RCTOpenURLNotification" object:nil];
    }
    self.schemeStr = nil;
    NSArray *urlTypes = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleURLTypes"];
    if (urlTypes != nil && urlTypes.count > 0) {
        NSArray *urlSchemes = [urlTypes.firstObject objectForKey:@"CFBundleURLSchemes"];
        if(urlSchemes.count > 0) {
            self.schemeStr = [urlSchemes firstObject];
        }
    }
    return self;
}

+ (BOOL)requiresMainQueueSetup{
  return YES;
}

- (NSArray<NSString *> *)supportedEvents
{
    return @[@"UnionPayResponse"];
}

- (BOOL)handleOpenURL:(NSNotification *)aNotification
{
    NSString * aURLString =  [aNotification userInfo][@"url"];
    NSURL * aURL = [NSURL URLWithString:aURLString];
    [[UPPaymentControl defaultControl] handlePaymentResult:aURL completeBlock:^(NSString *code, NSDictionary *data) {
        NSString *sign;
        NSMutableDictionary *body = [[NSMutableDictionary alloc]init];
        [body setValue:code forKey:@"pay_result"];
        //结果code为成功时，去商户后台查询一下确保交易是成功的再展示成功
        if([code isEqualToString:@"success"]) {
            [body setValue:@"支付成功！" forKey:@"msg"];
            //判断签名数据是否存在
            //如果没有签名数据，建议商户app后台查询交易结果
            if(data == nil){
                [body setValue:nil forKey:@"sign"];
            } else {
                //数据从NSDictionary转换为NSString
                NSData *signData = [NSJSONSerialization dataWithJSONObject:data
                                                                   options:0
                                                                     error:nil];
                sign = [[NSString alloc] initWithData:signData encoding:NSUTF8StringEncoding];
                [body setValue:sign forKey:@"sign"];
            }
        }
        else if([code isEqualToString:@"fail"]) { //交易失败
            [body setValue:@"支付失败！" forKey:@"msg"];
        }
        else if([code isEqualToString:@"cancel"]) { //交易取消
            [body setValue:@"用户取消了支付" forKey:@"msg"];
        }
        [self sendEventWithName:@"UnionPayResponse" body:body];
    }];
    return YES;
}


RCT_EXPORT_MODULE(UnionPayModule)

RCT_EXPORT_METHOD(startPay:(NSString*)tn :(NSString*)mode)
{
    //当获得的tn不为空时，调用支付接口
    if (tn != nil && tn.length > 0){
        dispatch_async(dispatch_get_main_queue(), ^(void) {
            UIWindow *window = [UIApplication sharedApplication].keyWindow;
            UIViewController *rootViewController = window.rootViewController;
            [[UPPaymentControl defaultControl] startPay:tn
                                             fromScheme:self.schemeStr mode:mode
                                         viewController:rootViewController];
        });
    }
}


/// 当判断用户手机上已安装银联App，商户客户端可以做相应个性化处理
/// @param resolve
/// @param reject
RCT_EXPORT_METHOD(isPaymentAppInstalled:(RCTPromiseResolveBlock)resolve :(RCTPromiseRejectBlock)reject)
{
    if([[UPPaymentControl defaultControl] isPaymentAppInstalled]) {
        resolve(@(YES));
    } else {
        resolve(@(NO));
    }
}

@end

