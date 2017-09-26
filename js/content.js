var JSOND = null;
function getJSON(url,callback,error){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            if(xhr.status == 200){
                var jsonTxt = xhr.responseText;
                callback(jsonTxt);
            }else{
                error();
            }
        }
    }
    xhr.open("GET",url,true);
    xhr.send(null);
}
//连接json
function jsonMain(){
    var newBtn = document.getElementById("newBtn");
    getJSON("/json/json.json",function(jsonTxt){
        JSOND = JSON.parse(jsonTxt);
        mainContent();
        hgroupHtml();
    });
}
window.onload = function(){
    jsonMain();
    backBtn();
}

//返回按钮
function backBtn(){
    var backBtn = document.getElementsByClassName("backBtn")[0];
    backBtn.onclick = function(){
        history.go(-1);
    }
}

function mainContent(){
    var content = document.getElementById("content");
    //类别
    var nav_id = sessionStorage.nav_id;
    //内容id
    var tt_group_id = sessionStorage.tt_group_id;
    var jsObj = JSOND.find(function(e){
        return e.id == nav_id;
    });
    var jsObjContent = jsObj.content;
    var conObj = jsObjContent.find(function(e){
        return e.cid == tt_group_id;
    });
    var con = ``;
    var article_content = "",
        discussCon = "",
        discuss = conObj.discuss,
        discuss_leng = discuss.length;
    var context = conObj.contentText,
        conImg = conObj.imgUrl,
        context_leng = context.length;
    //限制评论个数（先默认为3）
    var limitNum = 3;
    //内容
    for(var i = 0; i < context_leng; i++){
            article_content +=  `
                <p>
                    <img src="../img/${conImg[i]}">
                </p>
                <p>${context[i]}</p>
            `;
    }
    //评论
    for(var i = 0; i < discuss_leng; i++){
        if(i < limitNum){
            discussCon += `
                <li>
                   <span>${discuss[i].uid}</span>
                   <p>${discuss[i].disCon}</p>
                </li>
            `;
        }
    }
    con += `
        <h1>${conObj.title}</h1>
        <div>
            <a>${conObj.provenance}</a>
            <time>${conObj.pastTime}</time>
        </div>
        <div class="article_content" >${article_content}</div>
        <div class="discuss">
            <h2>热门评论</h2>
            <ul>
               ${discussCon}
            </ul>
        </div>
    `;
    content.innerHTML = con;
    $(".open").click(function(){
        $(this).remove();
        $("#content").css("height","auto");
    })
}
function hgroupHtml(){
    var hgroup = document.getElementsByTagName("hgroup")[0];
    var nav_id = sessionStorage.nav_id;
    var tt_group_id = sessionStorage.tt_group_id;
    var jsObj = JSOND.find(function(e){
        return e.id == nav_id;
    });
    var content = "";
    var cjsObj = jsObj.content,
        cjsObj_leng = cjsObj.length;
    var count = 0;
    recLoad();
    function recLoad(){
        var content = "";
        for(var i = count,leng= count+3; i < leng; i++){
            console.log(count);
            if(count >= cjsObj_leng){
                $(".load>a").text("暂无更多内容");
                break;
            } 
            var image = ``; 
            var imageUrl = cjsObj[i].imgUrl,
                imageUrl_leng = imageUrl.length;
            for(var j = 0; j < imageUrl_leng; j++){
                if(j < 3){
                    image += `
                        <li>
                            <div>
                                <img src="/img/${imageUrl[j]}">
                            </div>
                        </li>
                    `;
                }
            }
            //避免重复
            if(cjsObj[i].cid != tt_group_id){
                content += `
                <section>
                    <a tt_group_id="${cjsObj[i].cid}" nav_id="${nav_id}" href="javascript:;" class="article_link clearfix">
                        <h3>${cjsObj[i].title}</h3>
                        <!--图片-->
                        <div class="list_image">
                            <ul>${image}</ul>
                        </div>
                        <!--信息-->
                        <div class="item_info">
                            <span>${cjsObj[i].provenance}</span>
                            <!--评论-->
                            <span>                           
                                评论
                                ${(cjsObj[i].discuss).length}
                            </span>
                            <!--时间-->
                            <span>${cjsObj[i].pastTime}</span>
                        </div>
                    </a>
                </section>
                `;
            }
            count++;
        }
        $(content).appendTo("hgroup .rec");
    }
    clearfixBtn();
    $(".load").click(function(){
        if(count < cjsObj_leng){
            recLoad();
        }
    });
}
function clearfixBtn(){
    var clearfix = document.getElementsByClassName("clearfix"),
        clearfix_leng = clearfix.length;
    for(var i = 0; i < clearfix_leng; i++){
        clearfix[i].onclick = function(){
            var nav_id = this.getAttribute("nav_id");
            var tt_group_id = this.getAttribute("tt_group_id");
            sessionStorage.setItem("nav_id",nav_id);
            sessionStorage.setItem("tt_group_id",tt_group_id);
            location.href = "/html/content.html";
        }
    }
}
