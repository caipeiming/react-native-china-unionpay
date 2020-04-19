import React, { Component } from 'react';
import {SafeAreaView, StyleSheet, FlatList, View, Text, Platform, TouchableHighlight, StatusBar} from 'react-native';
import {Unionpay, UnionpayEmitter, UNIONPAY_MODAL_PRODUCTION, UNIONPAY_MODAL_DEVELOPMENT} from 'react-native-china-unionpay';

const TN_URL_01 = "http://101.231.204.84:8091/sim/getacptn";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.isMount = true;
        this.mode = UNIONPAY_MODAL_DEVELOPMENT;
        this.startPay = this._startPay.bind(this);
        this.clearLog = this._clearLog.bind(this);
        this.getSEPayInfo = this._getSEPayInfo.bind(this);
        this.startSEPay = this._startSEPay.bind(this);
        this.isPaymentAppInstalled = this._isPaymentAppInstalled.bind(this);
        this.checkWalletInstalled = this._checkWalletInstalled.bind(this);
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
        this.showLog(data);
    }

    _startPay() {
        this.getTn((tn) => {
            this.showLog("调用 startPay() ...");
            Unionpay.startPay(tn, this.mode);
        });
    }

    /**
     * 获取交易流水号
     */
    getTn(callback) {
        let init = {
            method: "get",
            credentials: 'same-origin'
        };
        this.showLog("获取 tn 中...");
        fetch(TN_URL_01, init).then(response => {
            if (!this.isMount) {
                return;
            }
            if (response.status != 200) {
                this.showLog("获取 tn 失败");
                return;
            }
            response.text().then(text => {
                this.showLog("tn: " + text);
                callback && callback(text);
            });
        }).catch(error => {
            this.showLog(error.message);
        });
    }

    showLog(msg) {
        let text;
        if (typeof msg == "string") {
            text = msg;
        } else {
            text = JSON.stringify(msg)
        }
        this._list && this._list.addLog(text);
    }

    _clearLog() {
        this._list && this._list.clear();
    }

    _getSEPayInfo() {
        this.showLog("调用 getSEPayInfo() ...");
        Unionpay.getSEPayInfo().then(data => {
            this.showLog(data);
        }).catch(error => {
            this.showLog(error.message);
        });
    }

    _checkWalletInstalled() {
        this.showLog("调用 checkWalletInstalled() ...");
        Unionpay.checkWalletInstalled().then(data => {
            this.showLog(data);
        }).catch(error => {
            this.showLog(error.message);
        });
    }

    _startSEPay() {
        Unionpay.getSEPayInfo().then(data => {
            this.getTn((tn) => {
                this.showLog("调用 startSEPay() ...");
                Unionpay.startSEPay(tn, this.mode, data.seType);
            });
        }).catch(error => {
            this.showLog(error.message);
        });
    }

    _isPaymentAppInstalled() {
        this.showLog("调用 isPaymentAppInstalled() ...");
        Unionpay.isPaymentAppInstalled().then(data => {
            this.showLog(data);
        });
    }

    render() {
        let key = 0;
        let views = [
            <TouchableHighlight key={key ++} style={styles.touchableHighlight} onPress={this.startPay}>
                <View style={styles.btn}>
                    <Text style={styles.btnText}>开始支付</Text>
                </View>
            </TouchableHighlight>
        ];
        if (Platform.OS === "android") {
            views.push(
                <TouchableHighlight key={key ++} style={styles.touchableHighlight} onPress={this.getSEPayInfo}>
                    <View style={styles.btn}>
                        <Text style={styles.btnText}>检查手机 pay 状态</Text>
                    </View>
                </TouchableHighlight>
            );
            views.push(
                <TouchableHighlight key={key ++} style={styles.touchableHighlight} onPress={this.checkWalletInstalled}>
                    <View style={styles.btn}>
                        <Text style={styles.btnText}>是否安装云闪付客户端</Text>
                    </View>
                </TouchableHighlight>
            );
            views.push(
                <TouchableHighlight key={key ++} style={styles.touchableHighlight} onPress={this.startSEPay}>
                    <View style={styles.btn}>
                        <Text style={styles.btnText}>指定手机 Pay 支付</Text>
                    </View>
                </TouchableHighlight>
            );
        } else {
            views.push(
                <TouchableHighlight key={key ++} style={styles.touchableHighlight} onPress={this.isPaymentAppInstalled}>
                    <View style={styles.btn}>
                        <Text style={styles.btnText}>是否已安装银联 App</Text>
                    </View>
                </TouchableHighlight>
            );
        }
        views.push(
            <TouchableHighlight key={key ++} style={styles.touchableHighlight} onPress={this.clearLog}>
                <View style={styles.btn}>
                    <Text style={styles.btnText}>清除控制台</Text>
                </View>
            </TouchableHighlight>
        );
        return (
            <SafeAreaView style={styles.fill}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />
                <View style={styles.fill}>
                    <View style={{flexDirection: 'row', flexWrap: "wrap"}}>
                        {views}
                    </View>
                    <Text style={styles.logText}>控制台：</Text>
                    <ResultView ref={ele => this._list = ele} />
                </View>
            </SafeAreaView>
        );
    } 
}

class ResultView extends Component {
    constructor(props) {
        super(props);
        this.keyPrefix = 0;
        this.dataSource = [];
        this.state = {
            reload: 0
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.reload != nextState.reload;
    }

    updateView() {
        this.setState({
            reload: this.state.reload + 1
        });
    }

    clear() {
        this.dataSource = [];
        this.keyPrefix ++;
        this.updateView();
    }

    addLog(text) {
        this.dataSource.push(this.formatDate("yyyy-MM-dd HH:mm:ss") + `\n` + text);
        this.updateView();
    }

    formatDate (format) {
        let date = new Date();
        var pad = function(n) {
            return n < 10 ? '0' + n : n;
        }
        var year = date.getFullYear();
        var yearShort = year.toString().substring(2);
        var month = date.getMonth() + 1;
        var monthPad = pad(month);
        var dateInMonth = date.getDate();
        var dateInMonthPad = pad(dateInMonth);
        var hour = date.getHours();
        var hourPad = pad(hour);
        var minute = date.getMinutes();
        var minutePad = pad(minute);
        var second = date.getSeconds();
        var secondPad = pad(second);
        return format.replace(/yyyy/g, year).replace(/yy/g, yearShort)
                    .replace(/MM/g, monthPad).replace(/M/g, month)
                    .replace(/dd/g, dateInMonthPad).replace(/d/g, dateInMonth)
                    .replace(/HH/g, hourPad).replace(/H/g, hour)
                    .replace(/mm/g, minutePad).replace(/m/g, minute)
                    .replace(/ss/g, secondPad).replace(/s/g, second);
    }

    render() {
        return (
            <FlatList style={{flex: 1, backgroundColor: "#eee"}} 
                data={this.dataSource}
                keyExtractor={(item, index) => (index + "_" + this.keyPrefix)}
                renderItem={({item}) => {
                    return <Text style={styles.logText}>{item}</Text>
                }}
            />
        );
    }
}

const styles = StyleSheet.create({
    fill: {flex: 1, backgroundColor: "#fff", ...Platform.select({android: {padding: 5}, ios: {padding: 10}})},
    touchableHighlight: {marginRight: 10, marginBottom: 10},
    btn: {paddingLeft: 10, paddingRight: 10, height: 45, justifyContent: "center", backgroundColor: "#f2f2f2", margin: 0},
    btnText: {fontSize: 15, color: "#15a659"},
    logText: {padding: 5, color: "#333"},
});