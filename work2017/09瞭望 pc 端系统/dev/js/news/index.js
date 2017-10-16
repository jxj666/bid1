var main = {
    data: {

    },
    start: function() {
        common.getParamObj();
        common.val_reset();
        common.height_reset();
        common.clearfloat();
        common.getTrumpet();
        common.getPullDownList();
        common.bind_element();
        common.user_show();
        ajax_news.index(common.theRequest, undefined);
    }
}
main.start();