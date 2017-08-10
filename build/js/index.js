/**
 * Created by kefa on 2017/8/8.
 */

(function(){
    var $add = $(".container .add");
    var $list = $(".container .content .list");
    var $info = $(".container .content .info");
    var $alert = $(".container .content .alert");
    var $update = $(".container .content .info .update");
    var $mask = $(".container .content .mask");
    var $msg = $(".msg");
    var message = [];

    init();

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
        var arr = [];
        for(var i = 0; i < message.length; i++){
            var $str = html(message[i], i);
            if(message[i].complete && message[i].complete == true){
                $str.addClass("complete");
                $str.find(".checkbox").prop("checked", true);
                arr.push($str);
                continue;
            }
            $list.prepend($str);
            info();
        }
        for(var i = 0; i < arr.length; i++){
            $list.append(arr[i]);
        }
        storeData();
        submit();
        del();
        check();
    }

    //build html
    function html(data, index){
        var str = '';
        str += '<li data-value="' + index + '">';
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
        $list.find(".right .delBtn").unbind().on("click", function(){
            var index = parseInt($(this).parent().parent().data("value"));
            $alert.show();
            $alert.find(".yes").unbind().on("click", function(){
                message = message.slice(0, index).concat(message.slice(index+1, message.length));
                $alert.hide();
                bind();
            });
            $alert.find(".no").unbind().on("click", function(){
                $alert.hide();
            });
        })
    }

    //check
    function check(){
        $list.find(".left .checkbox").unbind().on("click", function(){
            var index = parseInt($(this).parent().parent().data("value"));
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
        $list.find(".right .infoBtn").unbind().on("click", function(ev){
            var oEv = event || ev;
            oEv.cancelBubble = true;
            var index = parseInt($(this).parent().parent().data("value"));
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
                        music();
                        iKnow(num);
                        clearInterval(message[num].timer);
                    }
                };
            })(i),500)
        }
    }

    //click iKnow to close the alarm
    function iKnow(index){
        $msg.find(".confirmed").unbind().on("click", function(){
            $msg.hide();
            message[index].off = true;
            storeData();
        })
    }

    //play music
    function music(){
        var music=document.getElementById("alerter");
        music.play();
    }
})();


