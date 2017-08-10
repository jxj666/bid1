//*********
// _________common
function common(name) {
    this.name = name;
    this.able = {};
    this.able.console_data = function(res, name) {
        if (res.code != '1') {
            console.log(name + '接口错误! ->' + res.msg);
        } else {
            common_val.i += 1;
            console.log('运行排序:' + common_val.i, '接口:' + name, res);
        }
    };
    this.able.getQueryString = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(?:&|$)", 'i');
        var str_arr = window.location.search.substr(1).match(reg);
        return str_arr != null ? str_arr[2] : null;
    };
}
var common_val = {
    i: 0
}
//*********
// _________组件
//my_gift 简写 mg
var mg = new common('my_gift');

//*********
// _________变量
mg.noun = {
    i: 0,
    author: 'jxj',
    activityId: '12580'
};
//*********
// _________函数
mg.fun = {
    main: function(activityId) {
        mg.noun.activityId = activityId;
        mg.ajax.order(activityId, 1, 1000, 1);
        mg.ajax.order(activityId, 1, 1000, 2);
        mg.ajax.info(activityId);
    },
    status: function(res, type) {
        var list = res.context.orders;
        if (type == 1) {
            data_body.status1 = list;
        } else {
            data_body.status2 = list;
        }
    },
    info: function(res) {
        var list = res.context.user;
        data_head.user = list;
        data_pop.mobile = res.context.user.mobile;
    }
};
//*********
// _________异步
mg.ajax = {
    order: function(activityId, page, size, type) {
        var url_text = `/award/myorders/${activityId}/${page}/${size}`;
        if (type == 1) {
            var port = '获取全部未领取';
        } else {
            var port = '获取全部已领取';
        }

        port = port + ' : ' + url_text;
        $.ajax({
            url: url_text,
            method: 'GET',
            data: {
                satus: type
            }
        }).done(function(res) {
            mg.able.console_data(res, port);
            mg.fun.status(res, type);
        }).fail(function(jqXHR, textStatus) {
            console.log(jqXHR, textStatus);
        });
    },
    info: function(activityId) {
        var url_text = `/user/info`;
        var port = '获取用户信息';
        port = port + ' : ' + url_text;
        $.ajax({
            url: url_text,
            method: 'GET',
            data: {
                activityId: activityId,
                role: 1
            }
        }).done(function(res) {
            mg.able.console_data(res, port);
            mg.fun.info(res);
        }).fail(function(jqXHR, textStatus) {
            console.log(jqXHR, textStatus);
        });
    },
    message: function(data) {
        var url_text = `/util/sendVCode`;
        var port = '获取验证码';
        port = port + ' : ' + url_text;
        $.ajax({
            url: url_text,
            method: 'POST',
            data: data
        }).done(function(res) {
            mg.able.console_data(res, port);
        }).fail(function(jqXHR, textStatus) {
            console.log(jqXHR, textStatus);
        });
    },
    submit_phone: function(data) {
        var url_text = `/user/bind/mobile`;
        var port = '绑定手机';
        port = port + ' : ' + url_text;
        $.ajax({
            url: url_text,
            method: 'POST',
            data: data
        }).done(function(res) {
            mg.able.console_data(res, port);
        }).fail(function(jqXHR, textStatus) {
            console.log(jqXHR, textStatus);
        });
    }
};

//*********
// _________vue 
var data_body = {
    status: 1,
    status1: [],
    status2: []
}
var vm_body = new Vue({
    el: '#mg_body',
    data: data_body
})
var data_head = {
    user: {
        avatar: ' ',
        mobile: '123'
    }
}
var vm_head = new Vue({
    el: '#mg_head',
    data: data_head,
    methods: {
        bind_phone: function(type) {
            data_pop.open = 1;
            if (type == 1) {
                data_pop.type = 1;
                data_pop.data1.h3 = '请激活手机号';

            } else {
                data_pop.type = 2;
                data_pop.data1.h3 = '解绑当前手机号';
            }
        }
    }
})
var data_pop = {
    type: 0,
    open: 0,
    data1: {
        h3: '请激活手机号',
        btn: '获取短信验证码',
    },
    data2: {
        h3: '请激活手机号',
        btn: '获取验证码',
        status: true,
        judge: 0
    },
    mobile: '123',
    vcode: ''
}
var vm_pop = new Vue({
    el: '#mg_pop',
    data: data_pop,
    methods: {
        message: function() {
            data_pop.data2.status = false;
            let data_in = {
                activityId: mg.noun.activityId,
                scale: 'bind_mobile',
                mobile: data_pop.mobile
            };
            mg.ajax.message(data_in);
            data_pop.data2.btn = 60;
            let timer=undefined;
            timer = setInterval(function() {
                if (!data_pop.data2.status && data_pop.data2.btn > 1) {
                    data_pop.data2.btn -= 1;
                } else {
                    data_pop.data2.btn = '获取验证码';
                    data_pop.data2.status = true;
                    timer = null;
                }
            }, 1000)
        },
        bind_unbind: function() {
            data_pop.type += 2;
            if (data_pop.type == 3) {
                data_pop.data2.h3 = '激活手机号获取奖励';
            } else if (data_pop.type == 4) {
                data_pop.data2.h3 = '解绑当前手机号';
            } else {
                alert('状态出错!');
            }
        },
        submit_phone: function() {
            let opType = 1;
            if (data_pop.type == 4) opType = 2;
            let data_in = {
                activityId: mg.noun.activityId,
                role: 1,
                opType: opType,
                vcode: data_pop.vcode,
                mobile: data_pop.mobile
            };
             mg.ajax.submit_phone(data_in);
        }
    },
    filters: {
        num_str: function(value) {
            if (typeof value == 'string') {
                return '获取验证码';
            } else {
                return value + '秒后可重发';
            }

        }
    }
})
//*********
// _________运行
mg.fun.main('JS0001DS001');