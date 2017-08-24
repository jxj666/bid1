// (function article() {
//     $.ajax({
//         url: ,
//         method: 'get',
//         success: function (res) {

//         }
//     });
// })
$.getJSON("https://news.chengjuiot.com/news.php?page=1&pagesize=6"+'&'+"jsoncallback=?",function(dataSource){

      if (!dataSource) {
        return;
    }

    var htmlStr = '';
    for(var i = 0 ; i < dataSource.length ; i++) {
        var obj = dataSource[i];
        htmlStr += '<li><a href="' + obj.arcurl + '" class="ellipsis"><span>【' + obj.typename +'】</span>' + obj.title +'</a ></li>';
    }

    $('.dynamic-right').html(htmlStr);
});
// (function dataRequest(index) {

//     $.getJSON("https://news.chengjuiot.com/news.php?page=" + index + "&pagesize=5"+'&'+"jsoncallback=?",function(dataSource){

//       if (!dataSource) {
//         return;
//       }

//       // $('.load-more').text('加载中...');
//       // var htmlStr = '';
//       // for(var i = 0 ; i < dataSource.length ; i++) {
//       //   var obj = dataSource[i];
//       //   var pubdate = parseInt(obj.pubdate) * 1000
//       //   var d = new Date(pubdate); 
//       //   var pubdate = formatDate(d);

//       //   htmlStr += '<li class="dongtai-item">< img src="' + obj.litpic + '" class="dongtai-img"><div class="dongtai-content"><p class="dongtai-title">' + obj.title + '</p ><p class="dongtai-author"><span class="time">' + pubdate + '</span><span class="author">' + obj.writer + '</span></p ><p class="dongtai-txt">' + obj.description + '<a href="' + obj.arcurl + '" class="dongtai-detail">[详细]</a ></p ></div></li>';
//       // }

//       // $('.dongtai-list').append(htmlStr);
//       // $('.load-more').text('加载更多');

//       totalPage = dataSource[0].total;
//     });
// })();
$('.menu').on('click', function () {
    // 将HTML置为不可滚动状态
    // $('html').toggleClass('html-unscrollable');
    toggleMenu();
});
function toggleMenu() {
    if ($('.right-nav').hasClass('invisible')) {
        $('.right-nav').removeClass('invisible');
        var timer = setTimeout(function () {
            $('.nav-content').addClass('enter')
        }, 200);
    }
    else {
        $('.nav-content').removeClass('enter');
        var timer = setTimeout(function () {
            $('.right-nav').addClass('invisible');
        }, 400);
    }
}
// 导航条高度
var navBoxHeight = $('.top').height();
// 锚点跳转
var isScrolling = false;
function scrollEnd() {
    isScrolling = false;
}
// 右侧菜单栏点击事件
$('.right-nav').click(function () {
    $(this).addClass('invisible');
})
$('.menu-list').on('click', 'li', function () {
    //遍历元素个数
    for (var j = 0; j < 5; j++) {
        if (j == $(this).index()) {
            $(this).addClass('active' + (j + 1));// 给当前元素添加点击状态的图片
            $(this).children('a').css('color', '#25bbff');
        }
        else {
            // 显示当前状态的div的背景图片
            $('.menu-item>div').removeClass().removeClass('active' + (j + 1));
            // 给兄弟元素移除点击状态的图片，置灰图片
            $(this).siblings().removeClass('active' + (j + 1));
            // 文字颜色修改
            $(this).siblings().children('a').css('color', '#444');
        }
    }
    // $('.menu-item>div').addClass(($(this).children('a').attr('href')).slice(1));
    // $('.menu-item>div>span').text($(this).children('a').html());
    // 点击锚点之后隐藏菜单
    $('.right-nav').addClass('invisible');
    // $('html').removeClass('html-unscrollable');

})
    .on('click', 'a', function (e) {
        isScrolling = true;
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        else {
            // IE中阻止函数器默认动作的方式
            window.event.returnValue = false;
            return false;
        }
        var id = $(this).attr('href');
        $('html,body').animate({scrollTop: $(id).offset().top}, 1000, scrollEnd);
    });
// 二维码img旋转
$(document).ready(function () {
    var timer = setTimeout(function () {
        $('.code-bg').removeClass('invisible');
        $('.code').addClass('logo-out').addClass('code-scroll');
        showRotate();
        // setTimeout(function () {
        // 	showRotate();
        // },100);
    }, 500);

    function showRotate() {
        var timer = setTimeout(function () {
            $('.code-bg').addClass('code-scroll');
            $('.code-last').addClass('scale').addClass('code-scroll');
        }, 300);
    }

    $('.code-bg')[0].addEventListener('animationend', function () {
        // console.log('end');
        $(this).removeClass('code-scroll').addClass('code-bg-scroll');
    });
})
// 楼层滚动
var h1, h2, h3, h4, h5, sh;
$(document).ready(function () {

    h1 = parseInt($('#active1').offset().top);
    h2 = parseInt($('#active2').offset().top);
    h3 = parseInt($('#active3').offset().top);
    h4 = parseInt($('#active4').offset().top);
    h5 = parseInt($('#active5').offset().top);
});

$(document).scroll(function () {
    sh = $('body').scrollTop();

    judgeHeight(sh);
});

function judgeHeight(scrollHeight) {
    var strArray = ['产品介绍', '行业应用方案', '合作方式', '关于成聚', '营销新知'];

    if (scrollHeight > h1 && scrollHeight < h2) {
        //first
        $('#current span').text(strArray[0]);
        $('#current').removeClass().addClass('active1');
        showImg(1);

    }
    else if (scrollHeight >= h2 && scrollHeight < h3) {
        // second
        $('#current span').text(strArray[1]);
        $('#current').removeClass().addClass('active2');
        // $('.men-list li').eq(1).addClass('active1');
        showImg(2);
    }
    else if (scrollHeight >= h3 && scrollHeight < h4) {
        // third
        $('#current span').text(strArray[2]);
        $('#current').removeClass().addClass('active3');
        // $('.men-list li').eq(1).addClass('active1');
        showImg(3);
    }
    else if (scrollHeight >= h4 && scrollHeight < h5) {
        // forth
        $('#current span').text(strArray[3]);
        $('#current').removeClass().addClass('active4');
        // $('.men-list li').eq(1).addClass('active1');
        showImg(4);
    }
    else if (scrollHeight >= h5) {
        // five
        $('#current span').text(strArray[4]);
        $('#current').removeClass().addClass('active5');
        // $('.men-list li').eq(1).addClass('active1');
        showImg(5);
    }
}

function showImg(index) {
    var ele = $('.menu-list li');

    for (var i = 1; i < ele.length + 1; i++) {
        if (index == i) {
            ele.eq(i - 1).addClass('active' + i).children('a').css('color', '#25bbff');
        }
        else {
            ele.eq(i - 1).removeClass('active' + i).children('a').css('color', '#444');
        }
    }
}

// 咨询弹窗
$('.mode-list .consultation').on('click', function () {
    $('.pop-bg').removeClass('invisible');
});
$('.close').on('click', function () {
    $('.pop-bg').addClass('invisible');
});
var telVal = false;
var positionVal = false;
var companyVal = false;
var msg = '格式错误';

// 验证手机号
tel.onblur = function () {
    phoneCheck();
}
tel.onfocus = function () {
    $(this).siblings('span').hide();
}
// 验证邮箱
email.onblur = function () {
    emailCheck();
}
email.onfocus = function () {
    $(this).siblings('span').hide();
}
// 验证职位
position.onblur = function () {
    var position = $.trim($("#position").val());
    if (position == '') {
        $(this).siblings('span').show().text(msg);
    }
    else {
        positionVal = true;
    }
}
position.onfocus = function () {
    $(this).siblings('span').hide();
}
company.onfocus = function () {
    $(this).siblings('span').hide();
    var company = $.trim($("#company").val());
    $('#company').bind('input', function () {
        console.log($("#company").val());
        companyVal = true;
        if (telVal && positionVal && companyVal) {
            $('.submit').removeClass('disable').addClass('able');
        }
    });
}
company.onblur = function () {
    var company = $.trim($("#company").val());
    if (company == '') {
        $(this).siblings('span').show().text(msg);
    }
}

// 验证手机号
function phoneCheck() {
    var tel = $.trim($("#tel").val());
    var regPhone = /^1[34578]\d{9}$/;
    if (!tel) {
        $("#tel").siblings("span").show().text(msg);
        return false;
    }
    else if (!regPhone.test(tel)) {
        ;
        $("#tel").siblings("span").show().text(msg);
        return false;
    }
    else {
        $("#tel").siblings("span").hide();
        telVal = true;
        return true;
    }
}
//验证邮箱
function emailCheck() {
    var email = $.trim($("#email").val());
    var regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (email == '' || regEmail.test(email)) {
        $("#email").siblings("span").hide();
        return true;
    }
    else {
        $("#email").siblings("span").show().text(msg);
        return false;
    }
}

$('.submit').on('click', function () {
    if ($(this).hasClass('disable')) {
        return;
    }
    else {
        var position = $('#position').val();
        var company = $('#company').val();
        if (phoneCheck() && emailCheck() && position != '' && company != '') {
            var json = {};
            $("#tel,#email,#position,#company").each(function () {
                json[$(this).attr("id")] = $(this).val();
                console.log(json);
            });
            $.ajax({
                type: "post",
                url: "",
                data: json,
                success: function (res) {
                    console.log(res);
                }
            });
        }
    }

});
