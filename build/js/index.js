/**
 * Created by kefa on 2017/8/8.
 */

var $add = $(".container .add");
var $list = $(".container .content .list");
var $info = $(".container .content .info");
var $alert = $(".container .content .alert");
var $update = $(".container .content .info .update");
var $mask = $(".container .content .mask");
var $msg = $(".msg");
var message = [];
var key = 0;

init();
submit();
del();
check();
info();

//init
function init(){
    message = store.get("message") || [];
    bind();
}

//submit
function submit(){
    $add.on("submit", function(ev){
        ev.preventDefault();
        if(!$add.find("input").eq(0).val()){
            return;
        }
        message.push({
            content: $add.find("input").eq(0).val()
        });
        $add.find("input").eq(0).val("");
        bind();
    });
}

//bind html
function bind(){
    $list.empty();
    key = 0;
    var arr = [];
    for(var i = 0; i < message.length; i++){
        var $str = html(message[i]);
        if(message[i].complete && message[i].complete == true){
            $str.addClass("complete");
            $str.find(".checkbox").attr("checked", true);
            arr.push($str);
            continue;
        }
        $list.prepend($str);
    }
    for(var i = 0; i < arr.length; i++){
        $list.append(arr[i]);
    }
    storeData();
}

//build html
function html(data){
    var str = '';
    str += '<li data-value="' + key++ + '">';
    str += '<div class="left">';
    str += '<input class="checkbox" type="checkbox">';
    str += '<span>' + data.content + '</span>';
    str += '</div>';
    str += '<div class="right">';
    str += '<span class="delBtn">删除</span>';
    str += '<span class="infoBtn">详情</span>';
    str += '</div>';
    str += '</li>';

    return $(str);
}

//store data
function storeData(){
    store.set("message", message);
    alarm();
}

//delete item
function del(){
    $list.on("click", ".right .delBtn", function(){
        var index = parseInt($(this).parent().parent().attr("data-value"));
        $alert.show();
        $alert.on("click", ".yes", function(){
            message = message.slice(0, index).concat(message.slice(index+1, message.length));
            bind();
            $alert.hide();
        });
        $alert.on("click", ".no", function(){
            $alert.hide();
        });
    })
}

//check
function check(){
    $list.on("click", ".left .checkbox", function(){
        var index = parseInt($(this).parent().parent().attr("data-value"));
        if($(this).is(":checked")){
            $(this).parent().parent().addClass("complete");
            message[index].complete = true;
        }else{
            $(this).parent().parent().removeClass("complete");
            message[index].complete = false;
        }
        bind();
    })
}

//info
function info(){
    $list.on("click", ".right .infoBtn", function(ev){
        var oEv = event || ev;
        oEv.cancelBubble = true;
        var index = parseInt($(this).parent().parent().attr("data-value"));
        $info.show();
        $mask.hide();

        $info.find("h2").html(message[index].content);
        $info.find("textarea").val(message[index].detail ? message[index].detail : "");
        $info.find("input").eq(1).val(message[index].time ? message[index].time : "");

        modify();
        update(index);

    });
    $info.on("click", function(ev){
        var oEv = event || ev;
        oEv.cancelBubble = true;
    });
    $(document).on("click", function(){
        $info.hide();
        $mask.hide();
    });
}

//update
function update(index){
    $update.unbind().on("click", function(){
        message[index].content = $info.find("h2").html() ? $info.find("h2").html() : "";
        message[index].detail = $info.find("textarea").val() ? $info.find("textarea").val() : "";
        message[index].time = $info.find("input").eq(1).val() ? $info.find("input").eq(1).val() : "";
        bind();
    });
}

//double click to modify content
function modify(){
    $info.find("h2").on("dblclick", function(){
        $(this).hide();
        $info.find("input").eq(0).show();
        $info.find("input").eq(0).focus();
    });
    $info.find("input").eq(0).on("blur", function(){
        $(this).hide();
        $info.find("h2").show().html($(this).val() ? $(this).val() : $info.find("h2").html());
    });
}

//alarm
function alarm(){
    for(var i = 0; i < message.length; i++){
        if(message[i].complete == false || !message[i].time || new Date(message[i].time).getTime() <= new Date().getTime()){
            continue;
        }
        var tarTime = new Date(message[i].time).getTime();
        clearInterval(message[i].timer);
        message[i].timer = setInterval((function(num){
            return function(){
                var curTime = new Date().getTime();
                if((tarTime - curTime) <= 0){
                    $msg.show();
                    $msg.find(".msg-content").html(message[num].content);
                    clearInterval(message[num].timer);
                }
            };
        })(i),500)
    }
}
