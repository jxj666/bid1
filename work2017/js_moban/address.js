//*********
// _________组件
//address_fix  简写 af
var af = new common('address_fix');
//*********
// _________变量
af.noun = {
    i: 0,
    author: 'jxj'
}
//*********
// _________函数
af.fun = {
    main: function() {
        var address_has = sessionStorage.address_has || 0;
        var activityId = sessionStorage.activityId || 0;
        if (!activityId) {
            alert('活动号缺失,请通过正常途径进入!');
        } else {
            af.ajax.list(activityId);
        }
    },
    list_show: function(res, name) {
        var html_text = '';
        var list = res.context.list || [];
        for (let i = 0; i < list.length; i++) {
            html_text += ` <div class="xianqin clearfix ">
            <div class="moren">
                <a href="javascript:void(0)" class="moren_a ${list[i].isDefault?'quedin':' '}" data-id='${list[i].id}'></a>
            </div>
            <div class="juti">
                <h5><em>${list[i].username}</em><span>${list[i].mobile}</span></h5>
                <p>${list[i].address}</p>
            </div>
            <div class="bianji" data-id='${list[i].id}' data-id='${list[i].id}' data-cityCode='${list[i].cityCode}' data-provinceCode='${list[i].provinceCode}' data-districtCode='${list[i].districtCode}'></div>
            <div class="shanchu">删除</div>
        </div>`;
        }
        $(".g_has .xinzhen").before(html_text);
    },
    fix: function() {
        var id = sessionStorage.address_id || 0;
        var fix = sessionStorage.fix_update || 0;
        sessionStorage.address_id = 0;
        sessionStorage.fix_update = 0;
        var activityId = sessionStorage.activityId;
        var username = $('#username').val();
        var mobile = $('#mobile').val();
        var address = $('#address').val();
        var province = $('#province').val();

        var city = $('#city').val();

        var district = $('#district').val();



        if (!activityId || !username || !mobile || !address || !province || !city || !district) {
            alert('必填项目不能为空!');
            return;
        }
        var zipcode = $('#zipcode').val();
        if (fix != 0) {
            if (province == -1 || city == -1 || district == -1 || !province || !city || !district) {
                province = sessionStorage.provinceCode;
                city = sessionStorage.cityCode;
                district = sessionStorage.districtCode;

            }
            sessionStorage.provinceCode = -1;
            sessionStorage.cityCode = -1;
            sessionStorage.districtCode = -1;
            var data = {
                activityId: activityId,
                username: username,
                mobile: mobile,
                address: address,
                province: province,
                city: city,
                district: district,
                zipcode: zipcode
            }
            af.ajax.update(data, id);
        } else {

            var data = {
                activityId: activityId,
                username: username,
                mobile: mobile,
                address: address,
                province: province,
                city: city,
                district: district,
                zipcode: zipcode
            }

            af.ajax.add(data);
        }
        $('.g_has').removeClass('invisible');
        $('.g_new').addClass('invisible');


    },
    address: function() {
        $('.g_new').removeClass('invisible');
        $('.g_has').addClass('invisible');
    },
    delete: function(id) {
        var activityId = sessionStorage.activityId;
        var id = sessionStorage.address_id || 0;
        var fix = sessionStorage.fix_update || 0;
        var data = { activityId: activityId };
        if (id && fix) {
            af.ajax.delete(data, id);
        }
        $('.g_has').removeClass('invisible');
        $('.g_new').addClass('invisible');
        sessionStorage.fix_update = 0;
        sessionStorage.address_id = 0;
    },
    address_fix: function($e) {
        var $target = $e.closest('.xianqin');
        var name = $target.find('em').text();
        var phone = $target.find('span').text();
        var port = $target.find('p').text();
        var id = $e.attr('data-id');
        var username = $('#username').val(name);
        var mobile = $('#mobile').val(phone);
        var address = $('#address').val(port);
        sessionStorage.districtCode = $e.attr('data-districtCode');
        sessionStorage.provinceCode = $e.attr('data-provinceCode');
        sessionStorage.cityCode = $e.attr('data-cityCode');
        sessionStorage.address_id = id;
        sessionStorage.fix_update = '1';
    },
    re_load: function() {
        var num = Math.random();
        setTimeout(function() {
            location.href = location.pathname + '?num=' + num;
        }, 500)



    },
    default: function($e) {
        var id = $e.attr('data-id');
        var activityId = sessionStorage.activityId;
        var data = { id: id, activityId: activityId };
        af.ajax.default(data, id);
    },
    order_address: function($e) {
        var $target = $e.closest('.xianqin');
        var username = $target.find('em').text();
        var mobile = $target.find('span').text();
        var address = $target.find('p').text();
        var province = $target.find('.bianji').attr('data-provincecode');
        var city = $target.find('.bianji').attr('data-citycode');
        var district = $target.find('.bianji').attr('data-districtcode');
        var activityId = sessionStorage.activityId;
        var orderid = sessionStorage.orderid;
        var data = {
            username: username,
            mobile: mobile,
            address: address,
            province: province,
            city: city,
            district: district,
            activityId: activityId,
            orderid: orderid
        }
        af.ajax.order_address(data, orderid);

    }
}
//*********
// _________ajax
af.ajax = {
    list: function(activityId) {
        var url_text = '/user/address/list';
        var port = '获取用户地址列表';
        port = port + ' : ' + url_text;
        $.ajax({
            url: url_text,
            method: 'GET',
            data: {
                activityId: activityId
            }
        }).done(function(res) {
            af.able.console_data(res, port);
            af.fun.list_show(res, port);
        }).fail(function(jqXHR, textStatus) {
            console.log(jqXHR, textStatus);
        });
    },
    add: function(data) {
        var url_text = '/user/address/add';
        var port = '新增用户地址';
        port = port + ' : ' + url_text;
        $.ajax({
            url: url_text,
            method: 'POST',
            data: data
        }).done(function(res) {
            af.able.console_data(res, port);
            af.fun.re_load();

        }).fail(function(jqXHR, textStatus) {
            console.log(jqXHR, textStatus);
        });
    },
    update: function(data, id) {
        var url_text = '/user/address/update/' + id;
        var port = '更新用户地址';
        port = port + ' : ' + url_text;
        $.ajax({
            url: url_text,
            method: 'POST',
            data: data
        }).done(function(res) {
            af.able.console_data(res, port);
            af.fun.re_load();

        }).fail(function(jqXHR, textStatus) {
            console.log(jqXHR, textStatus);
        });
    },
    delete: function(data, id) {
        var url_text = '/user/address/delete/' + id;
        var port = '删除用户地址';
        port = port + ' : ' + url_text;
        $.ajax({
            url: url_text,
            method: 'POST',
            data: data
        }).done(function(res) {
            af.able.console_data(res, port);
            af.fun.re_load();

        }).fail(function(jqXHR, textStatus) {
            console.log(jqXHR, textStatus);
        });
    },
    default: function(data, id) {
        var url_text = '/user/address/default/' + id;
        var port = '修改默认地址';
        port = port + ' : ' + url_text;
        $.ajax({
            url: url_text,
            method: 'POST',
            data: data
        }).done(function(res) {
            af.able.console_data(res, port);
            //af.fun.re_load();
        }).fail(function(jqXHR, textStatus) {
            console.log(jqXHR, textStatus);
        });
    },

    order_address: function(data, id) {
        var url_text = '/award/deliery/add/' + id;
        var port = '修改订单地址';
        port = port + ' : ' + url_text;
        $.ajax({
            url: url_text,
            method: 'POST',
            data: data
        }).done(function(res) {
            af.able.console_data(res, port);
            af.fun.re_load();
        }).fail(function(jqXHR, textStatus) {
            console.log(jqXHR, textStatus);
        });
    }
}
//*********
// _________通用
function common(name) {
    this.name = name;
    this.able = {};
    this.able.console_data = function(res, name) {
        if (res.code != '1') {
            console.log(name + ' : 数据错误! ->' + res.msg);
            alert(name + ' : 数据错误! ->' + res.msg);
        } else {
            ijk.i += 1;
            console.log('运行排序 : ' + ijk.i, ' 接口 : ' + name, res);
        }
    };
    this.able.getQueryString = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(?:&|$)", 'i');
        var str_arr = window.location.search.substr(1).match(reg);
        return str_arr != null ? str_arr[2] : null;
    };
}
var ijk = {
    i: 0
}
//*********
// _________执行
af.fun.main();

//*********
// _________绑定
$('.baocun').on('click', function() {
    af.fun.fix();


});
$('.xinzhen').on('click', function() {
    af.fun.address();

});
$('.g_has ').on('click', '.bianji', function(e) {
    var $this = $(this);
    af.fun.address();
    af.fun.address_fix($this);
});
$('.chuqu').on('click', function() {
    af.fun.delete();


});
$('.g_has').on('click', '.moren_a', function(e) {
    var $this = $(this);
    af.fun.default($this);
    af.fun.order_address($this);
});

//*********
// _________地址选择插件
(function() {
    var city = {};
    $(".select-menu select").change(function() {
        $(this).parent().prev("span").text($(this).find("option:selected").text());
    });
    // console.log(data);
    data.district_list = data.province_list;
    // console.log(data.district_list);

    data.district_list.map(function(item) {
        city[item.code] = item.district_list;
    });
    // console.log(city);

    $("#province").html("<option value='-1'>省</option>" + tmpl("template_area", data)).change(function() {
        //console.log($("#province").find("option:selected").val())
        $("#city").parent().prev("span").text("市");
        $("#district").prop("disabled", true).html("<option value='-1'>区</option>").parent().prev("span").text("区");
        if ($("#province").val() == -1) {
            $("#city").prop("disabled", true).html("<option value='-1'>市</option>");
        } else {
            // console.log($("#province").val())
            $("#city").prop("disabled", false).html("<option value='-1'>市</option>" + tmpl("template_area", { district_list: city[$("#province").val()] })).change(
                function() {
                    $("#district").parent().prev("span").text("区");
                    if ($("#city").val() == -1) {
                        $("#district").prop("disabled", true).html("<option value='-1'>区</option>");
                    } else {
                        var country = {};
                        city[$("#province").val()].map(function(item) {
                            country[item.code] = item.district_list;
                        })
                        $("#district").prop("disabled", false).html("<option value='-1'>区</option>" + tmpl("template_area", { district_list: country[$("#city").val()] }))
                    }
                })
        }
    })
})()