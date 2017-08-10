/**
 * @author 韩原
 * @file 通用js
 */
$('[data-click="menu"]').on('click', function () {
    if ($('.right-nav').hasClass('invisible')) {
        $('html').addClass('html-unscrollable');
        $('.right-nav').removeClass('invisible');
        setTimeout(function () {
            $('.nav-content').addClass('enter');
        }, 200);
    }
    else {
        $('html').removeClass('html-unscrollable');
        $('.nav-content').removeClass('enter');
        setTimeout(function () {
            $('.right-nav').addClass('invisible');
        }, 400);
    }
});

// 右侧菜单栏点击事件
$('.right-nav').on('click', '.right-nav_mask', function () {
    $('html').removeClass('html-unscrollable');
    $('.nav-content').removeClass('enter');
    setTimeout(function () {
        $('.right-nav').addClass('invisible');
    }, 400);
});
// 菜单跳转效果
$('.nav-menu_dropdown>li>a').click(function (e) {
    e.preventDefault();
    $.when($(this).addClass('focus')).done(() => {
        location.href = $(this).attr('href');
    });
});
// 节流器
function throttle(method, context) {
    clearTimeout(method.timer);
    method.timer = window.setTimeout(function () {
        method.call(context);
    }, 300);
}

(function ($) {
    // 对象的扩展
    $.fn.extend({
        // 把表单转成json,并且name为key,value为值
        serializeObject: function () {
            let a, o, h, i, e;
            a = this.serializeArray();
            o = {};
            h = o.hasOwnProperty;
            for (i = 0; i < a.length; i++) {
                e = a[i];
                if (!h.call(o, e.name)) {
                    o[e.name] = e.value;
                }
            }
            return o;
        }
    });

    // 类的扩展
    $.extend({
        // 把url的所有参数转成一个对象
        getParamObj: function () {
            let str = location.search;
            if (!str) {
                return {};
            }
            str = str.substr(1);
            let theRequest = {};
            let strs = str.split('&');
            $.each(strs, function (i, v) {
                theRequest[v.split('=')[0]] = decodeURIComponent(v.split('=')[1]);
            });
            return theRequest;
        },
        // 获取单一的一个参数
        getSingleParam: function (name) {
            if (!name) {
                return null;
            }
            let getType = Object.prototype.toString;
            if (getType.call(name) !== '[object String]') {
                throw name + ' is not defined';
            }
            let reg = new RegExp('[?&]' + name + '=([^&?=]*)', 'ig');
            return location.href.match(reg) ? location.href.match(reg)[0].replace(reg, function (res, $1) {
                return $1;
            }) : null;
        }
    });
})(jQuery);

/* ajax返回结果处理 begin*/
$(document).ajaxStart(function () {
    // 进度条
    Pace.restart();
}).ajaxError(function (e, xhr, opt) {
    console.info('接口 "' + opt.url + '" 返回错误: ' + xhr.status + ' ' + xhr.statusText);
});

// 接收三个参数 分别是服务器返回的数据（必须）、处理数据的函数、除了返回数据外用到的参数
function ajaxResHandle(data, callback, arg) {
    if (data) {
        let getType = Object.prototype.toString;
        // var js_string = JSON.stringify(data);
        var js_obj = getType.call(data) === '[object Object]' ? data : JSON.parse(data);
        if (getType.call(js_obj) !== '[object Object]') {
            throw '返回的结果必须是对象!';
        }
        if (callback && getType.call(callback) !== '[object Function]') {
            throw '回调必须是一个函数!';
        }
        if (arg && getType.call(arg) !== '[object Array]') {
            throw '参数只能以数组的方式传入!';
        }
        if (js_obj.code == 1) {
            arg = arg || [];
            arg.unshift(js_obj);
            callback && callback.apply(callback, arg);
        }
        else if (js_obj.code == 403) {
            location.replace('/html/account/login.html?ru=' + decodeURIComponent(location.href));
        }
        else {
            if (js_obj.msg) {
                alert(js_obj.msg);
            }
            else {
                alert('接口返回错误');
            }
        }
    }
    else {
        console.info('接口没有返回数据!');
    }
}

/** ajax返回结果处理 end */
/*
(function (window) {
    function App() {
        var version = '0.01测试版';
        var desc = '项目自定义的工具集';
        return new App.fn.init();
    }

    App.fn = App.prototype = {
        constructor: App,
        init() {
            return this;
        },
        // 获取单独一个参数
        getSingleParam(name) {
            if (!name) {
                return null;
            }
            let getType = Object.prototype.toString;
            if (getType.call(name) !== '[object String]') {
                throw name + ' is not defined';
            }
            let reg = new RegExp('[?&]' + name + '=([^&?=]*)', 'ig');
            return location.href.match(reg) ? location.href.match(reg)[0].replace(reg, function (res, $1) {
                return $1;
            }) : null;
        },
        // 把url的所有参数转成一个对象
        getParamObj: function () {
            let str = location.search;
            if (!str) {
                return {};
            }
            str = str.substr(1);
            let theRequest = {};
            let strs = str.split('&');
            $.each(strs, function (i, v) {
                theRequest[v.split('=')[0]] = decodeURIComponent(v.split('=')[1]);
            });
            return theRequest;
        }
    };
    App.fn.init.prototype = App.fn;
    window.CJ = window.App = App;
})(window, undefined);
// console.log(App);
*/

// 微信
let weixin_token = {};
const isWeixin = navigator.userAgent.toLowerCase().indexOf('micromessenger') != -1;
if (isWeixin && location.pathname !== '/html/account/login.html') { // 微信浏览器且不在登录页面
    $.post('/opauth/jssdk').done(res => {
        ajaxResHandle(res, () => {
            weixin_token = res.data.jssdk;
            wx.config({
                debug: false,
                appId: weixin_token.appId, // 必填，公众号的唯一标识
                timestamp: weixin_token.timestamp, // 必填，生成签名的时间戳
                nonceStr: weixin_token.noncestr, // 必填，生成签名的随机串
                signature: weixin_token.jssdk_sign,// 必填，签名，见附录1
                jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'onMenuShareQZone',
                    'showOptionMenu',
                    'scanQRCode',
                    'chooseImage',
                    'uploadImage'
                ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            wx.ready(function () {
                let shareLink = location.origin + '/html/marketing/index.html';
                let shareTitle = '成聚移动';
                let shareDesc = '成聚移动,一站式营销解决方案';
                let shareImg = 'https://saascore.oss-cn-beijing.aliyuncs.com/mobile/custom/img/marketing/m_logo.png';
                wx.showOptionMenu();
                wx.onMenuShareTimeline({
                    title: shareTitle, // 分享标题
                    link: shareLink, // 分享链接
                    imgUrl: shareImg,
                    success: function () {
                        _joyAnalytics.send('share', {
                            aid: 'S000004' // 微信朋友圈
                        });
                    }
                });

                wx.onMenuShareAppMessage({
                    title: shareTitle, // 分享标题
                    link: shareLink, // 分享链接
                    imgUrl: shareImg,
                    desc: shareDesc, // 分享描述
                    trigger: function (res) {
                        //alert('用户点击发送给朋友');
                    },
                    success: function (res) {
                        _joyAnalytics.send('share', {
                            aid: 'S000003' // 微信朋友
                        });
                    },
                    cancel: function (res) {
                        //alert('已取消');
                    },
                    fail: function (res) {
                        //alert(res);
                    }
                });

                wx.onMenuShareQQ({
                    title: shareTitle, // 分享标题
                    link: shareLink, // 分享链接
                    imgUrl: shareImg,
                    desc: shareDesc, // 分享描述
                    trigger: function (res) {
                        //alert('用户点击发送给朋友');
                    },
                    success: function (res) {
                        _joyAnalytics.send('share', {
                            aid: 'S000002' // QQ空间
                        });
                    },
                    cancel: function (res) {
                        //alert('已取消');
                    },
                    fail: function (res) {
                        //alert(res);
                    }
                });

                wx.onMenuShareWeibo({
                    title: shareTitle, // 分享标题
                    link: shareLink, // 分享链接
                    imgUrl: shareImg,
                    desc: shareDesc, // 分享描述
                    trigger: function (res) {
                        //alert('用户点击发送给朋友');
                    },
                    success: function (res) {
                        _joyAnalytics.send('share', {
                            aid: 'S000006' // QQ微博
                        });
                    },
                    cancel: function (res) {
                        //alert('已取消');
                    },
                    fail: function (res) {
                        //alert(res);
                    }
                });

                wx.onMenuShareQZone({
                    title: shareTitle, // 分享标题
                    desc: shareDesc, // 分享描述
                    link: shareLink, // 分享链接
                    imgUrl: shareImg, // 分享图标
                    success: function () {
                        _joyAnalytics.send('share', {
                            aid: 'S000005' // QQ空间
                        });
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
            });
        });
    });
}

