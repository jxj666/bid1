/**
 * @file 模板管理
 * @author 韩原
 */
// 记录ajax请求前的tab,防止ajax取回结果后，当前tab已经不是ajax请求前的tab
$.get('/api/v1/acms/GetProjectTemplateType').done(function (data) {
    ajaxResHandle(data, () => {
        if (data.context.length > 0) {
            /* 渲染导航栏 开始 */
            let typeList = data.context;
            let navHtml = '';
            let contentHtml = '';
            $.each(typeList, (i, v) => {
                navHtml += `<li class="nav-item">
                <a class="nav-link" href="#tab-${v.type}" data-cj="tab" data-type="${v.type}">${v.name}</a>
            </li>`;
                contentHtml += `<div class="tab-pane fade" id="tab-${v.type}">
            <div class="goods-list"></div>
        </div>`;
            });
            $('.nav').append(navHtml);
            $('.tab-content').append(contentHtml);
            /* 渲染导航栏 结束 */

            /* 导航栏被点击时 开始 */
            $('[data-cj=tab]').click(function (e) {
                e.preventDefault(); // 阻止a标签的默认行为
                if (!$(this).hasClass('active')) {
                    $(this).closest('.nav').find('[data-cj=tab]').removeClass('active');
                    $(this).addClass('active');
                    let target = $(this).attr('href') || $(this).data('target');
                    $(target).closest('.tab-content').find('.tab-pane').removeClass('active in').scrollTop(0);
                    $(target).addClass('active in');

                    dropLoadObj.ajaxObj.data.type = $(this).data('type');
                    dropLoadObj.ajaxObj.data.start = $(target).data('start') - 0 || 0;
                    dropLoadObj.dropLoadInit();
                }
            });
            /* 导航栏被点击时 结束 */

            /* 无限滚动 开始 */
            var dropLoadObj = {
                dropLoad: {}, // dropload对象
                ajaxObj: {
                    url: '/api/v1/acms/GetProjectTemplates',
                    type: 'GET',
                    data: {
                        start: 0,
                        size: 10
                    }
                },
                // 下拉加载
                dropLoadFn() {
                    let that = this;
                    this.dropLoad = $('.tab-content').dropload({
                        scrollArea: window,
                        autoLoad: true,
                        distance: 10, // 拉动距离
                        loadDownFn(me) {
                            $.ajax(that.ajaxObj).done(function (result) {
                                ajaxResHandle(result, that.render, [me, that]);
                            }).fail(function () {
                                // 锁定
                                me.lock();
                                // 无数据
                                me.noData();
                                // 即使加载出错，也得重置
                                me.resetload();
                                $('.dropload-noData').html('<div class="dropload-error">加载出错<br>点我重试</div>');
                                $('.dropload-error').off().click(() => {
                                    dropLoad.noData(false);
                                    dropLoad.unlock();
                                    dropLoad.resetload();
                                });
                            });
                        }
                    });
                },
                dropLoadInit() {
                    this.ajaxObj.data.size = 10;
                    this.dropLoad.noData(false);
                    this.dropLoad.unlock();
                    this.dropLoad.resetload();
                },
                render(result, me, that){
                    let listArray = result.context.templates || [];
                    let listNum = listArray.length;
                    that.ajaxObj.data.start += listNum;
                    let tabTarget = result.context.type ? '#tab-' + result.context.type : '#all';
                    $(tabTarget).closest('.tab-pane').data('start', that.ajaxObj.data.start);
                    if (listNum > 0) {
                        var html = '';
                        $.each(listArray, (i, v) => {
                            html += `<div class="goods-item">
                        <div class="goods-title">
                        <img src="${v.thumb}" class="activity_img">
                        <div class="goods-mask text-center">
                        <span>${v.actsCount}</span>个活动使用
                    </div>
                    <img src="//saascore.oss-cn-beijing.aliyuncs.com/mobile/custom/img/acms/hot.png" class="goods-mask_hot">
                        </div>
                        <div class="goods-info">
                        <div class="goods-info_title text-center">${v.name}</div>
                    <a href="/html/acms/project-template-detail.html?projectid=${v.projectId}" class="detail-btn border-radius">查看详情</a>
                        </div>
                        </div>
                        </div>`;
                        });
                        $(tabTarget).find('.goods-list').append(html);
                    }
                    else {
                        // 锁定
                        me.lock();
                        // 无数据
                        me.noData();
                    }
                    // 每次数据插入，必须重置
                    me.resetload();
                }
            };

            dropLoadObj.dropLoadFn();
            /* 无限滚动 结束 */
        }
    });
});





