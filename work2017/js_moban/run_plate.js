//通用 js

var type = getQueryString('type');

$($('.nav')[0]).text('转盘').addClass('zhuanpan');

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
//关闭弹窗

$('.pop-close').on('click', function() {
    $('div.pop-bg').addClass('invisible');
});
// 点击领取跳转到中奖详情
$('.pop-bg1 .lucky-get').on('click', function() {
    location.href = 'detail.html?index=1';
});
$('.pop-bg2 .lucky-get').on('click', function() {
    location.href = 'detail.html?index=2';
});

$('.pop-bg3 .lucky-get').on('click', function() {
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



//转盘

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var canvasWidth = $('.canvas').width();
var canvasHeight = $('.canvas').height();
// canvas.setAttribute('width', canvasWidth + 'px');
// canvas.setAttribute('height', canvasHeight + 'px');

var initObj = {};
initObj.index = 0;
initObj.timer = null;
initObj.deg = Math.PI / 180;
initObj.running = false; // 是否运行中
initObj.speed = 300; // 速度
initObj.isBeginPrize = false; // 是否开始抽奖
initObj.stepping = 0; // 步数，经过一个扇形为1步
initObj.baseCircle = 3; // 点击开始时，圆盘旋转的圈数，旋转玩指定圈数之后，再根据selected的值确定奖项
initObj.selected = 0;

pin = new Image();
pin.src = '../img/new_pin.png';

ctx.translate(canvas.width / 2, canvas.height / 2);

function drawPin() {
    ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    ctx.drawImage(pin, 0, -253);
    ctx.rotate(Math.PI / 180 * 45);
}

function clearTimer() {
    clearInterval(initObj.timer);
    initObj.timer = null;
}

// 初始化抽奖参数
function init() {
    initObj.baseCircle = 4;
    initObj.selected = 0; // 最终选中第几个扇形，也就是确定几等奖
    initObj.running = false;
    initObj.isBeginPrize = false;
    initObj.index = initObj.index++;
    initObj.stepping = 0;
    initObj.speed = 300;
}

function spinPlate() {
    if (initObj.stepping == 4) { // 4步之后开始加速
        clearTimer();
        initObj.speed = 80;
        initObj.timer = setInterval(spinPlate, initObj.speed);
    }

    if (initObj.baseCircle > 0 && initObj.index == 8) { // 基本圈数结束以后，开始随机抽奖
        initObj.index = 0;
        initObj.baseCircle--;
        if (initObj.baseCircle == 0) { // 开始随机抽奖
            clearTimer();
            initObj.speed = 280;
            initObj.timer = setInterval(spinPlate, initObj.speed);
            initObj.isBeginPrize = true;
        }

    }

    if (initObj.isBeginPrize && initObj.selected > 0) { // 开始抽奖
        if (--initObj.selected == 0) { //到了选择的奖项之后
            clearTimer();
            initObj.running = false;
        } else {
            clearTimer();
            initObj.speed += 60;
            initObj.timer = setInterval(spinPlate, initObj.speed);
        }
    }

    drawPin();
    initObj.index++;
    initObj.stepping++;
}
//开始抽奖
$('#turnPlatebtn').on('click', start)

function start() {
    $('#turnPlatebtn').off('click')
    run();
    setTimeout(function() {
        $('#turnPlatebtn').removeClass('disabled');
        $('#turnPlatebtn').on('click', start);
        var num_pop = parseInt(Math.random() * 3 + 1);
        var tn = '.t' + num_pop;
       $(tn).removeClass('invisible')
    }, 6000)

}

function run() {
    $('#turnPlatebtn').addClass('disabled');
    init();
    var num = parseInt(Math.random() * 8 + 1);
    console.log(num);
    initObj.selected = num;

    initObj.timer = setInterval(spinPlate, initObj.speed);
}

//验真弹框

if(sessionStorage.getItem("looked")){
    $('.tip-bg00').hide();
    $('.tip-bg').addClass('invisible');
    $('.scan-tip').addClass('invisible');
}
$('.scan_btn button').on('click',function(){
   var  $this=$(this);
    $this.closest('.tip-bg').hide();
    $('.tip-bg').addClass('invisible');
    $('.scan-tip').addClass('invisible');
    sessionStorage.setItem("looked", "1");
})
