var JSOND = null;
//每次加载条数
var LOADNUM = 6;
//当前加载条数
var LOAD_COUNT = 0;
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
    getJSON("/json/json.json",function(jsonTxt){
        JSOND = JSON.parse(jsonTxt);
        meunHtml();
        
    });
}
window.onload = function(){
    jsonMain();
    location.hash = "";
}

function meunHtml(){
    MenuBtn();
    
}
function MenuBtn(){
    var topMenu = document.getElementById("top_menu");
    var JSOND_leng = JSOND.length;
    var navContent = "";
    var dataTk = [];
    var localTK = localStorage.tk;
    //本地缓存tk是否有值
    
    if(localTK){
        var localTKs = localTK.split(","),
            localTKs_leng = localTKs.length;
        for(var i = 0; i < localTKs_leng; i++){
            //取出json中的一条需要的数据
            var jsObj = JSOND.find(function(e){
                    return e.id == localTKs[i];
                });
            navContent += `
                    <a date-channel="${jsObj.id}" href="#${jsObj.id}" class="btn">${jsObj.name}</a>
                `;
        }
    //本地缓存tk无值
    }else{
        //默认个数（规定默认个数12）
        var num = 12;
        for(var i = 0; i < JSOND_leng; i++){
            if(i < num){
                navContent += `
                        <a date-channel="${JSOND[i].id}" href="#${JSOND[i].id}" class="btn">${JSOND[i].name}</a>
                `;
                dataTk.push(JSOND[i].id);
                localStorage.setItem("tk",dataTk);
            }
        }
    }
    topMenu.innerHTML = navContent;
    btncup();
    hashFun();
   // topMenuBtnBind();
}
function topMenuBtnBind(){
    var cup = document.getElementsByClassName("cup")[0];
    var btn = document.getElementsByClassName("btn")[0];
    if(!cup){
        btn.classList.add("cup");
    }
}
function topMenuBtn(){
    var btn = document.getElementsByClassName("btn"),
        btn_leng = btn.length;
    for(var i = 0; i < btn_leng; i++){
        btn[i].onclick = function(){
        }
    }
    
}

function btncup(){
    var btn = document.getElementsByClassName("btn"),
        btn_leng = btn.length;
    for(var i = 0; i < btn_leng; i++){
        btn[i].onclick = function(){
            for(var j = 0; j < btn_leng; j++){
                btn[j].classList.remove("cup");
            }
            this.classList.add("cup");
        }
    }
}


function hashFun(){
    var btn = document.getElementsByClassName("btn");
    if(location.hash == ""){
        location.hash = btn[0].getAttribute("date-channel");
        btn[0].classList.add("cup");
    }
    window.onhashchange = function(){
        LOAD_COUNT = 0;
        mainContent();
        $(document).ready(function() {
            $(window).scroll(function() {
                
                //滚动条距离底部还有10px时加载
                if ($(document).scrollTop() >= $(document).height() - $(window).height() - 10) {
                    $(".loadPrompt").remove();
                    mainContent();
                    console.log(LOAD_COUNT);
                }
                
            });
        });
    }
}
function mainContent(){
    //中间内容
    var mainContent = document.getElementById("content");
    var hashState = location.hash;
    var hash = hashState.slice(1);
    //获取当前hash值的对象
    var jsObj = JSOND.find(function(e){
        return e.id == hash;
    });
    var content = "";
    var cjsObj = jsObj.content,
        cjsObj_leng = cjsObj.length;
    //每次加载6条数据
    for(var i = LOAD_COUNT, leng = LOAD_COUNT + LOADNUM; i < leng; i++){
        //当没有数据时跳出循环（或者也可以再次请求数据，留下一个可扩展）
        if(LOAD_COUNT >= cjsObj_leng) {
            content += `<div class="loadPrompt"><a>暂无更多内容</a></div>`
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
        content += `
        <section>
            <a tt_group_id="${cjsObj[i].cid}" nav_id="${hash}" href="javascript:;" class="article_link clearfix">
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
        LOAD_COUNT++;
    }
    $(content).appendTo("#content");
    contentBtn();
}

function contentBtn(){
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
