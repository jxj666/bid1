function dropLoadInit(){Main_data.data.start=0,DroploadObj.start=0,Main_data.data.size=50,$(".dropload-down").show(),dropLoad.noData(!1),dropLoad.unlock(),dropLoad.resetload()}function main_show(t,a){console.log(arguments);var e=t.context||[],i=e.length;DroploadObj.start+=i,Main_data.data.start=DroploadObj.start;var s="";if(i>0)for(var n="",o="",d="",r="",l="",c="",p="",v="",m="",u="",h="",_="",y=0;y<i;y++){if(n=e[y].order?e[y].order.orderid||"":"",o=e[y].details[0]?e[y].details[0].productName||"":"",d=e[y].fee?"￥"+e[y].fee.totalFee||"":"",r=e[y].delivery?e[y].delivery.username||"":"",l=e[y].delivery?e[y].delivery.mobile||"":"",c=e[y].delivery?e[y].delivery.address||"":"",p=e[y].order?e[y].order.status||"":"",payStatus=e[y].order?e[y].order.payStatus||"":"",m=e[y].delivery?e[y].delivery.city||"":"",u=e[y].delivery?e[y].delivery.district||"":"",h=e[y].delivery?e[y].delivery.province||"":"",cityCode=e[y].delivery?e[y].delivery.cityCode||"":"",districtCode=e[y].delivery?e[y].delivery.districtCode||"":"",provinceCode=e[y].delivery?e[y].delivery.provinceCode||"":"",c.length>15)b=c.slice(0,13)+"...";else var b=c;_="paid","payStatus"==sessionStorage.switch_list?v=0==payStatus?"未支付":1==payStatus?"已支付":"其他":1==p?v="已支付":2==p?(v="配送中",_="send"):v=3==p?"已完成":4==p?"已取消":"待支付",s+='<div class="card clearfix">\n                <div class="left">\n                    <div class="left-top clearfix">\n                        <p class="orders">订单号：<strong class="order-num">'+n+'</strong></p>\n                        <p class="goods">商品：<span class="goods-name">'+o+'</span></p>\n                        <p class="pay">支付金额： <span class="pay-money">'+d+'</span></p>\n                    </div>\n                    <div class="left-bottom">\n                        <p class="receiving-name">'+r+'&nbsp;&nbsp;&nbsp;&nbsp;<span class="plone">'+l+'</span></p>\n                        <p class="receiving-delivery '+(h||m||u?"":"invisible")+'">'+h+" "+m+" "+u+'</p>\n                        <p class="receiving-address">'+b+'</p>\n                    </div>\n                </div>\n                <ul class="right">\n                    <li class="'+_+'">'+v+"</li>\n                    <li class=\"modification\" data-click='revise' data-orderid='"+n+"' data-username='"+r+"' data-mobile='"+l+"' data-address='"+c+"' data-status_text='"+v+"' data-post_id='"+n+"' data-province='"+provinceCode+"' data-city='"+cityCode+"' data-district='"+districtCode+"' data-name_province='"+h+"' data-name_city='"+m+"' data-name_district='"+u+"' >修改</li>\n                    <li class=\"scan-waybill\" data-click='waybill' data-orderid='"+n+"'>扫运单</li>\n                    <li class=\"log\" data-click='log' data-orderid='"+n+"'>日志</li>\n                </ul>\n            </div>"}else a.lock(),a.noData(),console.log("锁定");$(".show-content .show-list").append(s),a.resetload(),0==DroploadObj.start&&($(".dropload-down").hide(),$(".show-list").html('<img src="//saascore.oss-cn-beijing.aliyuncs.com/mobile/custom/img/order/nodata.png" alt="" class="showlist-img_nodata">\n<div class="showlist-info_nodata">暂无数据</div>'))}function id_show(t){$(".show-count").hide();var a=t.context?t.context.order||"":"",e="",i="",s="",n="",o="",d="",r="",l="",c="",p="";i=a.order?a.order.orderid||"":"",s=a.details[0]?a.details[0].productName||"":"",n=a.fee?"￥"+a.fee.totalFee||"":"",o=a.delivery?a.delivery.username||"":"",d=a.delivery?a.delivery.mobile||"":"",r=a.delivery?a.delivery.address||"":"",p="paid",1==(l=a.order?a.order.status||"":"")?c="已支付":2==l?(c="配送中",p="send"):c=3==l?"已完成":4==l?"已取消":"未支付",e+='\n<div class="card clearfix">\n                <div class="left">\n                    <div class="left-top clearfix">\n                        <p class="orders">订单号：<strong class="order-num">'+i+'</strong></p>\n                        <p class="goods">商品：<span class="goods-name">'+s+'</span></p>\n                        <p class="pay">支付金额： <span class="pay-money">'+n+'</span></p>\n                    </div>\n                    <div class="left-bottom">\n                        <p class="receiving-name">'+o+'&nbsp;&nbsp;&nbsp;&nbsp;<span class="plone">'+d+'</span></p>\n                        <p class="receiving-address">'+r+'</p>\n                    </div>\n                </div>\n                <ul class="right">\n                    <li class="'+p+'">'+c+"</li>\n                    <li class=\"modification\" data-click='revise' data-orderid='"+i+"' data-username='"+o+"' data-mobile='"+d+"' data-address='"+r+"' data-status_text='"+c+"' data-post_id='"+i+"'>修改</li>\n                    <li class=\"scan-waybill\" data-click='waybill'>扫运单</li>\n                    <li class=\"log\" data-click='log' data-orderid='"+i+"'>日志</li>\n                </ul>\n            </div>",$(".show-content .show-list").html(e)}function list_show(){for(var t="",a=0;a<List_data.length;a++){t=".dropdown_list"+(a+1);for(var e="",i="",s=1;s<List_data[a].length;s++)i=List_data[a][s].text,e+="<li data-key='"+List_data[a][s].key+"' data-main-key='"+List_data[a][0].main_key+"'>"+i+"</li>";$(".step-item").removeClass("active"),$(t).html(e)}}function address_select(){var t={};$(".select-menu select").change(function(){$(this).parent().prev("span").text($(this).find("option:selected").text())}),data.district_list=data.province_list,data.district_list.map(function(a){t[a.code]=a.district_list}),$("#province").html("<option value='-1'>省</option>"+tmpl("template_area",data)).change(function(){console.log($("#province").find("option:selected").val()),$("#city").parent().prev("span").text("市"),$("#district").prop("disabled",!0).html("<option value='-1'>区</option>").parent().prev("span").text("区"),-1==$("#province").val()?$("#city").prop("disabled",!0).html("<option value='-1'>市</option>"):(console.log($("#province").val()),$("#city").prop("disabled",!1).html("<option value='-1'>市</option>"+tmpl("template_area",{district_list:t[$("#province").val()]})).change(function(){if($("#district").parent().prev("span").text("区"),-1==$("#city").val())$("#district").prop("disabled",!0).html("<option value='-1'>区</option>");else{var a={};t[$("#province").val()].map(function(t){a[t.code]=t.district_list}),$("#district").prop("disabled",!1).html("<option value='-1'>区</option>"+tmpl("template_area",{district_list:a[$("#city").val()]}))}}))})}function select(t){var a="",e=1,i="",s="";a+="<div class='select_option' data-name='全部' data-type='undefined'>全部活动</div>  ";for(var n=0;n<t.context.activities.length;n++)i=t.context.activities[n].activity.name,s=t.context.activities[n].activity.activityId,i||(i="无名活动"+e++),a+="<div class='select_option' data-name='"+i+"' data-type='"+s+"'>"+i+"</div>  ";var o="<div class='select_box'>"+a+"</div>";$(".search-content").append(o)}function ajax_GetOrdersCount(){var t={};t.activity_id=Main_data.data.activity_id,t.product_id=Main_data.data.product_id,t.status=Main_data.data.status,t.pay_status=Main_data.data.pay_status,t.start_time=Main_data.data.start_time,t.end_time=Main_data.data.end_time,t.order_type=Main_data.data.order_type,$.ajax({url:"/api/v1/order/GetOrdersCount",method:"GET",data:t}).done(function(t){ajaxResHandle(t,count_order)})}function count_order(t){$(".show-count").show(),$(".show-count .total").text(t.context.total),$(".show-count .paid-count").text(t.context.totalPay)}$(document).on("click",function(t){0==$(t.target).parents(".search-content").length&&($(".select_box").slideUp(),$(".search-content .dropdown-icon").removeClass("active2_icon")),0==$(t.target).parents(".step-list").length&&($(".dropdown-menu").addClass("invisible"),$(".step-item").removeClass("active_icon"))});var scanCodeUrl="https://act.yucent.com/a/p/saas-qr-scan.html",theRequest=$.getParamObj(),List_data=[[{main_key:"status"},{text:"待支付",key:"0"},{text:"已完成",key:"3"},{text:"配送中",key:"2"},{text:"全部",key:"110"}],[{main_key:"payStatus"},{text:"已支付",key:"1"},{text:"未支付",key:"0"},{text:"全部",key:"110"}],[{main_key:"createTime"},{text:"本周",key:"1"},{text:"本月",key:"2"},{text:"上月",key:"3"},{text:"本季度",key:"4"},{text:"全部",key:"110"}],[{main_key:"orderType"},{text:"电商",key:"1"},{text:"红包",key:"2"},{text:"实物奖品",key:"3"},{text:"积分订单",key:"4"},{text:"虚拟奖品",key:"5"},{text:"全部",key:"110"}]],DroploadObj={start:0,size:50,starTime:"",endTime:"",payStatus:"",status:"",orderType:""},Main_data={url:"/api/v1/order/GetOrdersByOrg",method:"GET",data:{start:DroploadObj.start,size:DroploadObj.size}};$(".step-list").on("click",".step-item",function(){$(".dropload-noData").text(" "),$(".dropload-down").hide(),$(this).closest(".step-item").toggleClass("active_icon"),$(this).find(".dropdown-menu").toggleClass("invisible"),$(this).siblings(".step-item").children(".dropdown-menu").addClass("invisible"),$(".class_background").removeClass("invisible")}),$(".pop ").on("click","[data-click=return]",function(){$(".log-pop").html(" "),$(".pop").addClass("invisible"),$(".log-pop").addClass("invisible")}),document.addEventListener("click",function(t){t=t||window.event;var a=$(".step-item");a.is(t.target)||0!==a.has(t.target).length||$(".class_background").addClass("invisible"),t.stopPropagation()}),$(".search_mobile_id input").on("keyup",function(){$(".search_mobile_id input").val()?($(".btn_back_search").addClass("search"),$(".btn_back_search").removeClass("back"),$(".btn_back_search").text("搜索")):($(".btn_back_search").addClass("back"),$(".btn_back_search").removeClass("search"),$(".btn_back_search").text("取消"))}),$(".clear_text").on("click",function(){$(".search_mobile_id input").val(""),$(".btn_back_search").addClass("back"),$(".btn_back_search").removeClass("search"),$(".btn_back_search").text("取消")}),$(".search_mobile_id .back").on("click",function(){location.href=location.origin+location.pathname+"?num="+Math.random()}),$(".search_mobile_id .search").on("click",function(){var t=$(".search_mobile_id input").val().replace(/(^\s+)|(\s+$)/g,"");if(11==t.length)return Main_data={url:"/api/v1/order/GetOrdersByMobile",method:"GET",data:{mobile:t,role:1}},$(".show-content .show-list").html(""),dropLoadInit(),console.log(Main_data),!1;t.length<11?($(".show-count").hide(),$(".show-content .show-list").html('<p style="text-align:center"><br>请输入正确号码!</p>')):$.ajax({url:"/api/v1/order/GetOrder",method:"GET",data:{orderid:t}}).done(function(t){ajaxResHandle(t,id_show)}),list_show()}),$(".search-content").show(),$(".search_mobile_id").hide(),$(".search-content .search_btn").on("click",function(){$(".search-content").hide(),$(".search_mobile_id").show()}),$(".show-list").on("click",'[data-click="revise"]',function(t){function a(){$(".order-pop").html(""),$(".pop").addClass("invisible"),$(".order-pop").addClass("invisible")}t.stopPropagation();var e=(t=t||window.event).target||t.srcElement,i=$(e),s=i.attr("data-orderid"),n=i.attr("data-username"),o=i.attr("data-mobile"),d=i.attr("data-address"),r=i.attr("data-status_text"),l=i.attr("data-post_id"),c=(i.attr("data-province"),i.attr("data-city"),i.attr("data-district"),i.attr("data-name_province"),i.attr("data-name_city"),i.attr("data-name_district"),'\n                <h3>修改订单地址</h3> \n                <div class="order_boxs">\n                    <div class="order_box">\n                        <span>收货人</span>\n                        <input class=\'input1\' type="text" value="'+n+'">\n                    </div>\n                    <div class="order_box">\n                        <span>联系电话</span>\n                        <input class=\'input2\' type="text" value="'+o+'">\n                    </div>\n                    <div class="order_box" >\n                        <em>收货地址</em>\n                        <div class="address_box select-addr">\n        <select name="province" id="province" >\n            <option>省</option>\n        </select>\n                            <div class="line"></div>\n        <select name="city" id="city"  disabled>\n            <option>市</option>\n        </select>\n                        </div>\n                    </div>\n                    <div class="order_box">\n                        <input class=\'input3\' type="text" value="'+d+'">\n                    </div>\n                    <div class="order_box">\n                        <span>订单状态</span>\n                        <p>'+r+'</p>\n                    </div>\n                    <div class="order_box" style=\'border:0;display:none\'>\n                        <span>运单号</span>\n                        <input class=\'input4\' type="text" value="'+l+'" disabled="disabled">\n                    </div>\n                </div>\n                <div class="order_btn clearfix">\n                    <button class="yes">确定修改</button>\n                    <button class="no">取消</button>\n                </div>\n\n    <script type="text/html" id="template_area">\n        {{ for(var i=0;i< district_list.length;i++){ }}\n        <option value="{{= district_list[i].code }}">{{= district_list[i].name }}</option>\n        {{ } }}\n    <\/script>'),p=$(c);$(".order-pop").append(p),address_select(),$(".pop").removeClass("invisible"),$(".order-pop").removeClass("invisible"),$(".yes").on("click",function(){function t(){var t=i.closest(".card");console.log(t,i),t.find(".receiving-name").html('<p class="receiving-name">'+e+'&nbsp;&nbsp;&nbsp;&nbsp;<span class="plone"></span></p>'),t.find(".plone").text(n),t.find(".receiving-address").text(o),t.find(".receiving-delivery").remove()}var e=$(".input1").val(),n=$(".input2").val(),o=$(".input3").val(),d=void 0,r=void 0,l=void 0,c="-1"==$("#province").val()||" "==$("#province").val()?void 0:$("#province").val();if(c){var p='[value="'+c+'"]',d=$(p).text();if(r="市"==$("#city").val()||"-1"==$("#city").val()||" "==$("#city").val()?void 0:$("#city").val())var v='[value="'+r+'"]',l=$(v).text()}$.ajax({url:"/api/v1/order/UpdateAddress",method:"post",data:{orderid:s,province:d,city:l,provinceCode:c,cityCode:r,recipient:e,acc:1,lat:38.429659,lng:112.719977,mobile:n,address:o}}).done(function(a){ajaxResHandle(a,t)}),a()}),$(".no").on("click",function(){a()})}),$(".show-list").on("click",'[data-click="waybill"]',function(t){var a=$(t.target).attr("data-orderid");location.href=scanCodeUrl+"?ru="+decodeURIComponent(location.href)+"?orderid="+a}),$(".show-list").on("click",'[data-click="log"]',function(t){function a(t){for(var a=t.context||[],e="",i=[],s=0;s<a.length;s++)i=a[s].createTime?a[s].createTime.split(" "):[" "," "],e='\n                <li class="log-item clearfix">\n                    <p class="log-operat">'+(a[s].action||" ")+'<br><span class="operat-name">'+(a[s].appid||" ")+'</span></p>\n\n                    <p class="log-time">'+i[0]+"<br /><span>"+i[1]+"&nbsp;</span></p>\n                </li>\n            ";var n='\n            <h3 class="log-title">修改日志信息操作</h3>\n            <ul class="log-list" id="log-list">\n                '+e+'\n            </ul>\n            <a href="javascript:;" data-click="return" class="return text-center">返回</a>\n        ',o=$(n);$(".log-pop").append(o),$(".pop").removeClass("invisible"),$(".log-pop").removeClass("invisible")}t.stopPropagation();var e=(t=t||window.event).target||t.srcElement,i=$(e).attr("data-orderid");$.ajax({url:"/api/v1/order/GetOrderAuditLog",method:"GET",data:{orderid:i}}).done(function(t){ajaxResHandle(t,a)})}),$(".dropdown-menu").on("click","li",function(t){var a=$(this),e=a.attr("data-key"),i=a.attr("data-main-key");if(a.closest(".dropdown-menu").addClass("invisible").find("li.active_li").removeClass("active_li"),$(this).closest(".step-item").removeClass("active_icon"),$(".class_background").addClass("invisible"),a.addClass("active_li"),a.closest(".step-item ").addClass("active").find(".title").text(a.text()),Main_data.url="/api/v1/order/GetOrdersByOrg",Main_data.method="GET",Main_data.data.mobile=void 0,Main_data.data.role=void 0,"status"==i)Main_data.data.status=110==e?void 0:e,110==e&&a.closest(".step-item ").removeClass("active").children(".title").text("订单状态"),sessionStorage.switch_list="status";else if("payStatus"==i)Main_data.data.pay_status=110==e?void 0:e,110==e&&a.closest(".step-item ").removeClass("active").children(".title").text("支付状态"),sessionStorage.switch_list="payStatus";else if("orderType"==i)Main_data.data.order_type=110==e?void 0:e,110==e&&a.closest(".step-item ").removeClass("active").children(".title").text("奖品类型");else{var s="",n="",o=moment().valueOf();switch(e){case"1":s=moment().startOf("week").valueOf(),n=o;break;case"2":s=moment().startOf("month").valueOf(),n=o;break;case"3":s=moment().subtract(1,"month").startOf("month").valueOf(),n=moment().startOf("month").valueOf();break;case"4":s=moment().startOf("quarter").valueOf(),n=o;break;case"110":s=void 0,n=void 0;break;default:alert("数据错误请刷新!")}Main_data.data.start_time=s,Main_data.data.end_time=n,110==e&&a.closest(".step-item ").removeClass("active").children(".title").text("创建时间")}return $(".show-content .show-list").html(""),dropLoadInit(),console.log(Main_data),!1});var dropLoad=$(".show-content").dropload({scrollArea:window,autoLoad:!0,distance:10,loadDownFn:function(t){ajax_GetOrdersCount(),$.ajax(Main_data).done(function(a){ajaxResHandle(a,main_show,[t])}).fail(function(a,e){t.lock(),t.noData(),t.resetload(),$(".dropload-noData").html('<div class="dropload-error">加载出错<br>点我重试</div>'),$(".dropload-error").off().click(function(){dropLoad.noData(!1),dropLoad.unlock(),dropLoad.resetload()})})}});list_show(),$.ajax({url:"/api/v1/acms/GetActivities",method:"GET",data:{start:0,size:1e4,actstatus:1}}).done(function(t){ajaxResHandle(t,select)}),$("input.search").on("focus",function(){$(this).blur(),$(this).attr("placeholder",$(this).val()?$(this).val():$(this).attr("placeholder")),$(this).val(""),$(".select_box").show(),$(".dropload-noData").text(" "),$(".dropload-down").hide();var t=$("input.search").val();if(t){var a='[data-name*="'+t+'"]';$("[data-name]").hide(),$(a).show()}$(".search-content .dropdown-icon").addClass("active2_icon")}),$(".search-content").on("click","[data-type]",function(t){$(".search-content .dropdown-icon").removeClass("active2_icon");var a=$(t.target);if("undefined"==a.attr("data-type"))e=void 0;else var e=a.attr("data-type");var i=a.attr("data-name");$("[data-type]").removeClass("active"),a.addClass("active"),$("input.search").val(i),$(".select_box").hide(),Main_data.url="/api/v1/order/GetOrdersByOrg",Main_data.method="GET",Main_data.data.activity_id=e,Main_data.data.mobile=void 0,Main_data.data.role=void 0,$(".show-content .show-list").html(""),dropLoadInit()});