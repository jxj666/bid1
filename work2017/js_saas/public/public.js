 //*********
 // _________ 全局变量
 var g_1499507557 = {};
 g_1499507557.author = 'jxj';
 g_1499507557.i = 0;


 (function() {
     //*********
     // _________ 变量
     var i_data = {}

     //*********
     // _________ 执行
     ajax_GetWechatHostings();
     //ajax_GetWechatHosting();
     ajax_app();




     //*********
     // _________ 绑定

     //选择公众号
     // $('.company .m_imgs').on('click', '.m_img', function() {
     //     var $this = $(this);
     //     ajax_GetWechatHosting($this.attr('data-authorizerAppid'), $this.attr('data-compAppid'));
     // })

     //*********
     // _________ 函数
     //显示详情
     function GetWechatHosting_show(res, name) {
         console_data(res, name);
         $('.intro_img img').attr('src', res.context.avatar ? res.context.avatar.replace(/https?:/, '') : ' ');
         $('.introduce h6').html(res.context.nickname || '未知科技');
     }
     //授权公众号显示
     function GetWechatHostings_show(res, name) {
         console_data(res, name);
         var html_text = ''
         var context = res.context || [];
         for (var i = 0; i < context.length; i++) {
             html_text += `<div class="m_img" data-compAppid='${context[i].compAppid}' data-authorizerAppid='${context[i].authorizerAppid}'><img src="${context[i].avatar ? context[i].avatar.replace(/https?:/,'') : ' '}" alt="">
                    <p>${context[i].nickname || '未知科技'}</p>
                </div>`;
         }
         var rem = 1.6 * context.length + 'rem';
         $('.m_imgs').css('width', rem);
         // $('.intro_img img').attr('src',context[0].avatar ? context[0].avatar.replace(/https?:/,'') : ' ');
         // $('.introduce h6').html(context[0].nickname || '未知科技' );
         $('.m_imgs').html(html_text);

         if (context.length == 0) {
             $('#g_rights .company').hide();
             $('#g_rights h3').css({ 'height': '0', 'overflow': 'hidden' });

         }
     }

     //打印数据
     function console_data(res, name) {
         if (res.code != '1') {
             console.log(name + '数据错误! ->' + res.msg);
         } else {
             g_1499507557.i += 1;
             console.log('运行排序:' + g_1499507557.i, '接口:' + name, res);
         }

     }
     //app接口数据处理
     function app_show(res, name) {
         console_data(res, name);
         if (res.code == '1') {
             //location.href = res.data;
             g_1499507557.img_url = res.data.targetUrl;
             $('.img_boxs img').attr('src', g_1499507557.img_url);
         } else { alert('app接口返回错误!') }
     }
     //获取 cookie
     function getCookie(c_name) {
         var c_start, c_end;
         if (document.cookie.length > 0) {
             c_start = document.cookie.indexOf(c_name + "=")
             if (c_start != -1) {
                 c_start = c_start + c_name.length + 1
                 c_end = document.cookie.indexOf(";", c_start)
                 if (c_end == -1) c_end = document.cookie.length
                 return unescape(document.cookie.substring(c_start, c_end))
             }
         }
         return ""
     }

     //*********
     // _________ ajax

     //获取本企业下所有授权公众号
     function ajax_GetWechatHostings() {
         var url_text = '/api/v1/acms/GetWechatHostings';
         var port = '获取本企业下所有授权公众号';
         port = port + ' : ' + url_text;
         $.ajax({
             url: url_text,
             method: 'GET',
             data: {}
         }).done(function(res) {
             ajaxResHandle(res, GetWechatHostings_show, [port]);
         });
     }
     //获取微信公众号配置信息
     function ajax_GetWechatHosting(a, b) {
         var url_text = '/api/v1/acms/GetWechatHosting';
         var port = '获取微信公众号配置信息';
         port = port + ' : ' + url_text;
         $.ajax({
             url: url_text,
             method: 'GET',
             data: {
                 appid: a,
                 comp_appid: b
             }
         }).done(function(res) {
             ajaxResHandle(res, GetWechatHosting_show, [port]);
         });
     }
     //企业用户授权微信app
     function ajax_app() {
         var url_text = '/opauth/app';
         var port = '企业用户授权微信app';
         port = port + ' : ' + url_text;
         $.ajax({
             url: url_text,
             method: 'POST',
             data: {}
         }).done(function(res) {
             ajaxResHandle(res, app_show, [port]);
         });
     }

 })()