/**
 * @file 活动详情
 * @author 韩原
 */
var projectId = $.getSingleParam('projectid');

/*获取单个模板 开始*/
function getProjectTemplate() {
    if (!projectId) {
        return;
    }
    $.get('/api/v1/acms/GetProjectTemplate', {project_id: projectId}).done(data => {
        ajaxResHandle(data, function () {
            const template = data.context.template || {};
            const description = data.context.description || {};
            const relActs = data.context.rel_acts || [];
            const resources = data.context.resources || [];

            const authType = data.context.auth_type; // 1表示是User_info授权、2表示是base授权，0表示不授权

            modal(authType);
            // banner
            $('.banner').html(`<h1 class="banner-info">${template.name ? template.name : ''}</h1>
        <img src="${template.thumb ? template.thumb : '//saascore.oss-cn-beijing.aliyuncs.com/mobile/custom/img/common/banner-common.png'}" class="banner-img">
        <ul class="banner-mask clearfix">
            <li class="banner-mask_item">
                <img src="//saascore.oss-cn-beijing.aliyuncs.com/mobile/custom/img/acms/hot.png" class="banner-mask_hot">
            </li>
            <li class="banner-mask_item">
                <span>${template.actsCount ? template.actsCount : '0'}</span>个活动使用
            </li>
            <li class="banner-mask_item spread">
                #${template.templateType.name}
            </li>
        </ul>`);
            // 描述 活动建议
            $('[data-info="templateName"]').html(template.name);
            $('[data-info="memo"]').html(description.memo);
            $('[data-info="suggest"]').html(description.suggest);
            // 示例图
            let templateHtml = '';
            if (resources.length > 0) {
                for (let i = 0, len = resources.length; i < len; i++) {
                    templateHtml += `<div class="swiper-slide">
                        <a href="${resources[i].resource}">
                            <div class="img-container">
                                <img src="${resources[i].resource}" alt="">
                            </div>
                            <p class="template-demo_desc text-center">${resources[i].title}</p>
                        </a>
                    </div>`;
                }
            }
            else {
                templateHtml = '<div class="swiper-slide">暂无数据</div>';
            }
            $('.template-demo .swiper-wrapper').html(templateHtml);
            // 活动案列
            $('.case-demo .swiper-wrapper').html(tmpl('template_caselist', {relActs: relActs}));

            swiper();

            if (authType === 0) {
                $('.prompt').show();
                $('[data-cj=createAct]').removeClass('disabled');
            }
        });
    });
}

getProjectTemplate();

/*获取单个模板 结束*/
function swiper() {
    var templateDemo = new Swiper('.template-demo', {
        slidesPerView: 'auto',
        spaceBetween: 20,
        breakpoints: {
            1024: {
                slidesPerView: 5,
                spaceBetween: 40
            },
            768: {
                slidesPerView: 4.5,
                spaceBetween: 30
            },
            640: {
                slidesPerView: 3.4,
                spaceBetween: 20
            }
        },
        onImagesReady: function (swiper) {
            baguetteBox.run('.template-demo', {
                animation: 'fadeIn'
            });
        }
    });
    var caseDemo = new Swiper('.case-demo', {
        slidesPerView: 'auto',
        spaceBetween: 20,
        breakpoints: {
            1024: {
                slidesPerView: 5,
                spaceBetween: 40
            },
            768: {
                slidesPerView: 4.5,
                spaceBetween: 30
            },
            640: {
                slidesPerView: 2,
                spaceBetween: 20
            }
        }
    });
}

// 弹窗
function modal(authType) {
    $('[data-cj=modal]').on('click', function (e) {
        $(this).is('a') && e.preventDefault();
        let target = $(this).attr('href') || $(this).data('target');
        e = $.Event('shown.cj.modal', {relatedTarget: this});
        $(target).trigger(e);
        $.when($(target).removeClass('hide')).done(function () {
            $(target).addClass('in');
        });

        // 关闭弹窗
        $('[data-dismiss=modal]').off().click(function (e) {
            $(this).is('a') && e.preventDefault();
            let target = $(this).closest('.modal');
            e = $.Event('hidden.cj.modal');
            $(target).trigger(e);
            $.when($(target).removeClass('in')).done(function () {
                $(target).addClass('hide');
            });
        });
    });

    $('#modal').on('shown.cj.modal', function (e) {
        $('html').addClass('html-unscrollable');
        $(this).click(() => {
            $('[data-dismiss=modal]').trigger('click');
        }).find('.modal-content').click(e => {
            e.stopPropagation();
        });

    }).on('hidden.cj.modal', function (e) {
        $('html').removeClass('html-unscrollable');

        $('[data-cj=createAct]').data('appid', '').data('compappid', '');
        if (authType !== 0) {
            $('[data-cj=createAct]').addClass('disabled');
        }

        $('.wechat-list [data-appid].active').removeClass('active');
        $(this).find('.validate-error').html('');
    });

    $('.wechat-list').on('click', '[data-appid]', function () {
        if (!$(this).hasClass('active')) {
            $('.wechat-list [data-appid].active').removeClass('active');
            $(this).addClass('active');
            $('[data-cj=createAct]').data('appid', $(this).data('appid')).data('compappid', $(this).data('compappid'))
                .removeClass('disabled');
        }
    });
// 防止按钮重复点击
    $('[data-cj=createAct]').click(function () {
        if ($(this).hasClass('disabled')) {
            return;
        }
        let appid = $.trim($(this).data('appid')) || '';
        let compAppid = $.trim($(this).data('compappid')) || '';
        if (authType !== 0) {
            if (appid.length <= 0 || compAppid.length <= 0) {
                $('#modal').find('.validate-error').html('选择的公众号信息不全！');
                return;
            }
        }
        $(this).addClass('disabled');
        setTimeout(() => {
            $(this).removeClass('disabled');
        }, 3000);

        $.post('/api/v1/acms/GenerateActivity', {
            project_id: projectId,
            appid: appid,
            comp_appid: compAppid
        }).done(data => {
            ajaxResHandle(data, () => {
                location.href = '/html/acms/project-template-main.html?activityid=' + data.context.activityId;
            });
        });
    });
}

// 获取本企业下所有授权公众号
$.get('/api/v1/acms/GetWechatHostings').done(res => {
    ajaxResHandle(res, () => {
        const list = res.context || [];
        $('.wechat-list').html('');
        if (list.length > 0) {
            for (let i = 0, len = list.length; i < len; i++) {
                $('.wechat-list').append(`<li class="wechat-item" data-appid="${list[i].authorizerAppid}" data-compappid="${list[i].compAppid}">
                <a href="javascript:;" class="wechat-item_content">
                    <img class="wechat-logo" src="${list[i].avatar}" alt="logo">
                    <div class="wechat-name">${list[i].nickname}</div>
                    <span class="plus_red"></span>
                </a>
            </li>`);
            }
        }
        else {
            $('.wechat-list').html(`<li class="nodata-container">
<img src="//saascore.oss-cn-beijing.aliyuncs.com/mobile/custom/img/acms/nodata.png" alt="" class="nodata-img">
<div class="nodata-info">暂无绑定的公众号</div>
                </li>`);
        }
    });
});
