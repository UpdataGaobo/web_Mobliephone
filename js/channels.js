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
function nav_meun(){
    var newBtn = document.getElementById("newBtn");
    getJSON("../json/json.json",function(jsonTxt){
        JSOND = JSON.parse(jsonTxt);
        meunHtml();
    });
    //console.log(objDate);
    backBtn();
}

window.onload = function(){
    nav_meun();
}
function newDelBtn(){
    var newBtn = document.getElementById("newBtn"),
        delBtn = document.getElementById("delBtn");
    var JSOND_leng = JSOND.length;
    var newContent = "";
    var delContent = "";
    var dataTk = [];
    var localTK = localStorage.tk;
    if(localTK){
        var localTKs = localTK.split(","),
            localTKs_leng = localTKs.length;
        for(var i = 0; i < localTKs_leng; i++){
            //取出json中的一条需要的数据
            var jsObj = JSOND.find(function(e){
                    return e.id == localTKs[i];
                });
            newContent += `
                    <li data-tk="${jsObj.id}">
                        <a href="javascripts:;">${jsObj.name}</a>
                    </li>
                `;
        }
        //删除按钮
        var jsonId = [];
        for(var i = 0; i < JSOND_leng; i++){
            jsonId.push(JSOND[i].id);
        }
        //删除数组中指定的元素
        for(var i = 0; i < localTKs_leng; i++){
            removeByValue(jsonId,localTKs[i]);
        }
        for(var i = 0,jsonId_leng = jsonId.length; i < jsonId_leng; i++){
            //取出json中的一条需要的数据
            var jsObj = JSOND.find(function(e){
                    return e.id == jsonId[i];
                });
            delContent += `
                    <li data-tk="${jsObj.id}">
                        <a href="javascripts:;">${jsObj.name}</a>
                    </li>
                `;
        }
        
    }else{
        //默认个数（规定默认个数12）
        var num = 12;
        for(var i = 0; i < JSOND_leng; i++){
            if(i < num){
                newContent += `
                    <li data-tk="${JSOND[i].id}">
                        <a href="javascripts:;">${JSOND[i].name}</a>
                    </li>
                `;
                dataTk.push(JSOND[i].id);
                localStorage.setItem("tk",dataTk);
            }else{
                delContent += `
                    <li data-tk="${JSOND[i].id}">
                        <a href="javascripts:;">${JSOND[i].name}</a>
                    </li>
                `;
            }
        }
        
    }
    newBtn.innerHTML = newContent;
    delBtn.innerHTML = delContent;
}
function meunHtml(){
    newDelBtn();
    newBtnFun();
    delBtnFun();
}
//有的按钮
function newBtnFun(){
    var newBtn = document.getElementById("newBtn"),
        li = newBtn.getElementsByTagName("li"),
        li_leng = li.length;
    for(var i = 0; i < li_leng; i++){
        li[i].onclick = function(){
            var dataTk = this.getAttribute("data-tk");
            var dataTks = localStorage.tk.split(",");
            //删除数组中指定元素
            removeByValue(dataTks,dataTk);
            localStorage.setItem("tk",dataTks);
            meunHtml();
        }
    }
}
//移除中的按钮
function delBtnFun(){
    var delBtn = document.getElementById("delBtn"),
        li = delBtn.getElementsByTagName("li"),
        li_leng = li.length;
    for(var i = 0; i < li_leng; i++){
        li[i].onclick = function(){
            var dataTk = this.getAttribute("data-tk");
            var dataTks = localStorage.tk.split(",");
            //添加数组中指定元素
            dataTks.push(dataTk);
            localStorage.setItem("tk",dataTks);
            meunHtml();
        }
    }
}
//删除数组中指定元素
function removeByValue(arr,val) {
  for(var i=0; i<arr.length; i++) {
    if(arr[i] == val) {
      arr.splice(i, 1);
      break;
    }
  }
}
//返回按钮
function backBtn(){
    var backBtn = document.getElementsByClassName("backBtn")[0];
    backBtn.onclick = function(){
        history.go(-1);
    }
}