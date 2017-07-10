//通用 js

var type = getQueryString('type');


$($('.nav')[0]).text('砸金蛋').addClass('jindan');
//css('background', '../img/nav5_10.png');

//图标切换
var imgList = [
    'bag_icon', 'notice_icon', 'prize_icon'
];
$('.nav').on('click', function() {
    // console.log($(this).index());
    var index = $(this).index();
    if (index == 0) {
        location.href = 'index.html?type=0';
    } else if (index == 1) {
        location.href = 'notice.html?type=1';
    } else if (index == 2) {
        location.href = 'gift.html?type=2';
    }
});

function getQueryString(name) {
    var reg = new RegExp("(?:^|&)" + name + "=([^&]*)(?:&|$)", 'i');
    var str_arr = window.location.search.substr(1).match(reg);
    return str_arr != null ? str_arr[1] : null;
}

$('.click-list').on('click', 'a', function() {
    // console.log($(this).attr('data-click'));
    var a = $(this).attr('data-click');
    $('.tip-bg').removeClass('invisible');
    $('.' + a + '-tip').removeClass('invisible')
        .siblings().addClass('invisible');
});
$('.tip-close').click(function() {
    $('.tip-bg').addClass('invisible');
});

$('[data-click="winner-list"]').click(function() {
    location.href = 'winner_list.html';
});
$('.num_6 .input').on('input', function() {
    var val = $(this).val();
    if (val.length > 5) {
        $(this).blur();
    }
});
$('.num_4 .input').on('input', function() {
    var val = $(this).val();
    if (val.length > 3) {
        $(this).blur();
    }
});
//获取红包
$('#get-bag').on('click', function() {
    $('.pop-bg1').removeClass('invisible');
});
$('.scan-pop-btn').on('click', function() {
    location.href = 'index.html';
});
$('.pop-close').on('click', function() {
    $('.pop-bg').addClass('invisible');
});
//砸金蛋
$('.m-eggs').on('click','.egg_b', function(ev) {
    var ev=ev || window.event;
    var target=ev.target||ev.srcElement;
    var $t=$(target);
    var $o=$t.closest('.egg_b');

  console.log($t)
    console.log($o)
    $o.addClass('donhua')
    setTimeout(function() {
        $o.removeClass('donhua')
        var i = Math.random() * 9;
        if (i > 6) { $('.pop-bg1').removeClass('invisible'); } else if (i < 3) { $('.pop-bg2').removeClass('invisible'); } else { $('.pop-bg3').removeClass('invisible'); }

    }, 1000)
});

$('.pop-close').on('click', function() {
    $('div.pop-bg').addClass('invisible');
});
// 点击领取跳转到中奖详情
$('.pop-bg1 .btn').on('click', function() {
    location.href = 'detail.html?index=1';
});
$('.pop-bg2 .btn').on('click', function() {
    location.href = 'detail.html?index=2';
});

$('.pop-bg3 .btn').on('click', function() {
    location.href = 'get_coupon.html';
})

//优惠券
$('.coupon-pop-close').on('click', function() {
    $('.pop-bg').addClass('invisible');

})
$('.get-coupon-btn').on('click', function() {
    $('.pop-bg').addClass('invisible');
    location.href = 'gift.html?type=2';
})
$('.get-img-item a').on('click', function() {
    $('.pop-bg').removeClass('invisible');
})

//验真弹框

if(sessionStorage.getItem("looked")){
    $('.tip-bg00').hide();
    $('.tip-bg').addClass('invisible');
    $('.scan-tip').addClass('invisible');
}
$('.scan_btn button').on('click',function(){
    var $this=$(this);
    $this.closest('.tip-bg').hide();
    $('.tip-bg').addClass('invisible');
    $('.scan-tip').addClass('invisible');
    sessionStorage.setItem("looked", "1");
})

