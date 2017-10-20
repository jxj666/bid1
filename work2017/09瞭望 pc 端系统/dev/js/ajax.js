// function(url, method, data, explain, callback)

var ajax_news = {
    getNewsList: function(data, callback) {
        var url = '../../../v1/p/news/getNewsList';
        var method = 'GET';
        var explain = '条件筛选查稿件列表：新闻管理->待发稿库';
        common.ajax(url, method, data, explain, callback);
    },
    myNewsList: function(data, callback) {
        var url = '../../../v1/p/news/myNewsList';
        var method = 'GET';
        var explain = '条件筛选查稿件列表：新闻管理->个人稿库';
        common.ajax(url, method, data, explain, callback);
    },
    releaseNews: function(data, callback) {
        var url = '../../../v1/p/news/releaseNews';
        var method = 'post';
        var explain = '发布稿件';
        common.ajax(url, method, data, explain, callback);
    },
    getPullDownList: function(data, callback) {
        var url = '../../../v1/p/news/getPullDownList';
        var method = 'get';
        var explain = '获取所有下拉列表里的选项值';
        common.ajax(url, method, data, explain, callback);
    },
    updateNews: function(data, callback) {
        var url = '../../../v1/p/news/updateNews';
        var method = 'post';
        var explain = '待发稿库->修改稿件';
        common.ajax(url, method, data, explain, callback);
    },
    uploadFile: function(data, callback) {
        var url = '../../../v1/p/news/uploadFile';
        var method = 'post';
        var explain = '文件上传';
        common.ajax(url, method, data, explain, callback);
    },
    getReviewNews: function(data, callback) {
        var url = '../../../v1/p/news/getReviewNews';
        var method = 'get';
        var explain = '条件筛选查稿件列表：新闻管理->审核稿库';
        common.ajax(url, method, data, explain, callback);
    },
    asignNews: function(data, callback) {
        var url = '../../../v1/p/news/asignNews';
        var method = 'post';
        var explain = '指派审核';
        common.ajax(url, method, data, explain, callback);
    },
    info: function(data, callback) {
        var url = '../../../v1/p/news/info';
        var method = 'get';
        var explain = '获取指定ID的稿件详情：';
        common.ajax(url, method, data, explain, callback);
    },
    reviewNews: function(data, callback) {
        var url = '../../../v1/p/news/reviewNews';
        var method = 'post';
        var explain = '审核稿件';
        common.ajax(url, method, data, explain, callback);
    },
    editNews: function(data, callback) {
        var url = '../../../v1/p/news/editNews';
        var method = 'post';
        var explain = '编辑稿件';
        common.ajax(url, method, data, explain, callback);
    },
    getTrumpet: function(data, callback) {
        var url = '../../../v1/p/news/getTrumpet';
        var method = 'get';
        var explain = '小铃铛';
        common.ajax(url, method, data, explain, callback);
    },
    derived: function(data, callback) {
        var url = '../../../v1/p/news/derived';
        var method = 'get';
        var explain = '导出稿件';
        common.ajax(url, method, data, explain, callback);
    },
    getCompareNews: function(data, callback) {
        var url = '../../../v1/p/log/getCompareNews';
        var method = 'get';
        var explain = '获取稿件修改版本';
        common.ajax(url, method, data, explain, callback);
    },
    compareNews: function(data, callback) {
        var url = '../../../v1/p/log/compareNews';
        var method = 'get';
        var explain = '对比稿件';
        common.ajax(url, method, data, explain, callback);
    },
    index: function(data, callback) {
        var url = '../../../v1/p/user/index';
        var method = 'post';
        var explain = '主页验证';
        common.ajax(url, method, data, explain, callback);
    },
    getUsers: function(data, callback) {
        var url = '../../../v1/p/user/getUsers';
        var method = 'get';
        var explain = '获取人员列表';
        common.ajax(url, method, data, explain, callback);
    },
    logout: function(data, callback) {
        var url = '../../../v1/p/user/logout';
        var method = 'get';
        var explain = '注销接口';
        common.ajax(url, method, data, explain, callback);
    },
    lockNews: function(data, callback) {
        var url = '../../../v1/p/news/lockNews';
        var method = 'post';
        var explain = '锁住审核稿件';
        common.ajax(url, method, data, explain, callback);
    },
    getAllAuthor: function(data, callback) {
        var url = '../../../v1/p/news/getAllAuthor';
        var method = 'get';
        var explain = '获取全部作者';
        common.ajax(url, method, data, explain, callback);
    },
    myMessage: function(data, callback) {
        var url = '../../../v1/p/message/myMessage';
        var method = 'get';
        var explain = '我的消息';
        common.ajax(url, method, data, explain, callback);
    },
    getGatherNewsList: function(data, callback) {
        var url = '../../../v1/p/cnews/getGatherNewsList';
        var method = 'get';
        var explain = '根据条件查询采集库列表';
        common.ajax(url, method, data, explain, callback);
    },
    updateMsgStatus: function(data, callback) {
        var url = '../../../v1/p/message/updateMsgStatus';
        var method = 'post';
        var explain = '修改消息状态';
        common.ajax(url, method, data, explain, callback);
    }

}