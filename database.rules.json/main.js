
var database = firebase.database();

$(window).scroll(function() {
    var height = $(window).scrollTop();
    if(height > 75) {
        $('#header_contents').animate({padding: "10px 0"});
        // $('#header_contents').removeClass('header_down').addClass('header_up');
        $('aside').addClass('aside_up');
    } else {
        $('#header_contents').animate({padding: "25px 0"});
        // $('#header_contents').removeClass('header_up').addClass('header_down');
        $('aside').removeClass('aside_up');
    }   
});


$("#soso_add").click(function() { // 아이디 누르면 쏘쏘 추가 팝업창 뜸
    $("#add_soso").fadeIn("slow");
});
$("#logo").click(function(){
    sosoTimeline_update();
});
$(".tagid").click(function() {
    var search_Arr = $(this).text.split("#");
    var search = search_Arr[1];
    $("#searchbox").val(search);
    $("#search_button").trigger("click");
});


var fileuploader=document.getElementById("file_input");
var file;
//var storageRef;
fileuploader.addEventListener('change',function(e){
    console.log("z");
    file=e.target.files[0];
    console.log(file.name);
    var storageRef=firebase.storage().ref(file.name);
    console.log("z2");
    var task=storageRef.put(file);
    console.log("z3");
})

var storage=firebase.storage();
var fileadd=document.getElementById("add");

fileadd.addEventListener('click', function(){
    var fileref=storage.ref(file.name);
    console.log(file.name);
    var fileurl;
    var tag_arr = [];
    $(".soso_tag").each(function(index) {
        if($(this).val()!="")
        tag_arr.push($(this).val());
    });
    fileref.getDownloadURL().then(function(url){
        database.ref().child('soso/').once('value', function(data) { 
            var soso_index = data.numChildren();
            database.ref().child('soso/'+soso_index+'/').set(
            {
                "uploader":split[1],
                "liker":["default"],
                "soso_url":url,
                "tag":tag_arr
            });
        });
        $("#add_soso").fadeOut("fast");
    })
})

$("#add_soso").addClass("popup");

var mainurl=window.location.href;
var split=mainurl.split("=");
$("#mypage").click(function(){
    location.replace("mypage.html?val="+split[1]);
})
$("#myId").text(split[1]);

$(document).ready(function(){
    sosoTimeline_update();
    toptag_update();
    topsoso();
});
var str="";
var soso_index_arr=[];

var search_text;
$("#search_button").click(function() {
    search_text = $("input[id=searchbox]").val();
    tag_soso_print();
});

var tag_index=[];
function tag_soso_print() {
    var tag_soso = [];
    
    $("#soso_content").empty();
    database.ref().child('soso/').once('value', function(data) {    
        var soso_data = data.val();
        for(var i=0; i<soso_data.length; i++) {
            for(var j=0; j<soso_data[i].tag.length; j++) {
                if(("#"+search_text) == soso_data[i].tag[j]) {
                    tag_soso.push(soso_data[i]);
                    tag_index.push(i);
                }
            }
        }

        for(var z=0; z<tag_soso.length; z++) {
            var tag_str = "";
            for(var h=0; h<tag_soso[z].tag.length; h++)
                tag_str += tag_soso[z].tag[h] +" ";
            str = "<div class='sosoes'><div class='followingOK'>@"+tag_soso[z].uploader
            +"</div><div class='soso'><audio src="+tag_soso[z].soso_url
            +" controls></audio><img src='plusf.png' id='plusf' width='25' height='25' onclick='follow("+z+");'><p>"+tag_str
            +"</p></div></div>";

            $("#soso_content").append(str);
        }
    });
}


function follow(num){
    var folindex=tag_index[num];
    console.log("1");

    database.ref().child('soso/').once('value', function(data) {
        var ID;
        var soso_index = data.numChildren();
        var soso_data = data.val();
        ID=soso_data[folindex].uploader;
        if(ID==split[1]){
            return;
        }
        database.ref().child('user/').once('value', function(data) {
            console.log("2"); 
            var user_index = data.numChildren();
            var user_data = data.val();
            for(var i=0;i<user_index;i++){
                if(split[1]==user_data[i].id) {
                    // 팔로우 목록에 해당 아이디 추가
                    console.log("3");

                    if(user_data[i].following!=null){
                        for(var j=0;j<user_data[i].following.length;j++){
                            if(user_data[i].following[j]==ID){
                                alert("이미 팔로우한 계정입니다 ");return;
                            }
                            if(j==user_data[i].following.length-1){
                                database.ref().child('user/'+i+'/following/'+user_data[i].following.length).set(ID);
                                for(var k=0;k<user_index;k++){
                                    if(ID==user_data[k].id) {
                                         // 누른 아이디의 팔로워 목록에 현재 내 아이디 추가
                                            if(user_data[k].follower!=null){
                                                database.ref().child('user/'+k+'/follower/'+user_data[k].follower.length).set(split[1]);
                                                alert(ID+" following");
                                            }
                                            else{
                                                database.ref().child('user/'+k+'/follower/'+"0").set(split[1]);
                                                alert(ID+" following");
                                            }
                                         break;
                                     }
                                 }
                            }
                        }

                    }
                    else{
                        database.ref().child('user/'+i+'/following/'+"0").set(ID);
                        for(var k=0;k<user_index;k++){
                                    if(ID==user_data[k].id) {
                                         // 누른 아이디의 팔로워 목록에 현재 내 아이디 추가
                                        if(user_data[k].follower!=null){
                                            database.ref().child('user/'+k+'/follower/'+user_data[k].follower.length).set(split[1]);
                                            alert(ID+" following");
                                        }
                                        else{
                                            database.ref().child('user/'+k+'/follower/'+"0").set(split[1]);
                                            alert(ID+" following");
                                        }
                                        
                                         break;
                                     }
                        }

                    }
                    break;         
                }       
            }
        });

    });

}


var str="";
var soso_index_arr=[];


function sosoTimeline_update() {
    // 메인의 쏘쏘 뜨는 뉴스피드
    // soso.json에 시간 노드 추가해야함
    // soso 중 팔로잉한 유저들 것만 배열에 저장
    // 시간에 따라 정렬(가장 최근에 올린게 위로가도록)
    $("#soso_content").empty();
    var following_soso_arr = [];
    // var soso_index_arr=[];
    database.ref().child('user/').once('value', function(data) { 
        var user_index = data.numChildren();
        var user_data = data.val();
        for(var i=0;i<user_index;i++){
            if(split[1]==user_data[i].id) { // 현재 내 아이디의 index를 DB에서 찾음
                database.ref().child('user/'+i+'/following/').once('value', function(user_data) { 
                    var user_following_data = user_data.val(); // 내 아이디의 팔로잉 정보 가져옴
                    database.ref().child('soso/').once('value', function(data) {    
                        var soso_data = data.val(); // 전체 쏘쏘(소리) 데이터 가져옴
                        for(var j=0; j<soso_data.length; j++) {
                            if(user_following_data!=null){
                                for(var k=0;k<user_following_data.length;k++) {
                                    if(soso_data[j].uploader == user_following_data[k]) { // 쏘쏘 데이터 업로드 자가 내 팔로잉 목록에 있는지 체크
                                        following_soso_arr.push(soso_data[j]); // 모든 soso 중 팔로잉한 유저들의 soso들이 배열에 저장
                                        //console.log("1"+j);
                                        soso_index_arr.push(j);
                                        //console.log(soso_index_arr[0]);
                                    }
                                }
                            }
                            
                        }
                        // SOSO 올린 시간에 따라 정렬
                        // 모든 soso data를 읽음 (var i 하는데 왜 같은 인덱스를 참조하는지?)
                        // var tag_str = "";
                        
                        for(var z=0; z<following_soso_arr.length; z++) {
                            var tag_str = "";
                            str = "<div class='sosoes'><p>@"+following_soso_arr[z].uploader
                            +"</p><div class='soso'><audio src="+following_soso_arr[z].soso_url
                            +" controls></audio><p>";
                            if(following_soso_arr[z].liker!=null){
                                for(var h=0;h<following_soso_arr[z].liker.length;h++){
                                    //console.log("2"+z);
                                    if(following_soso_arr[z].liker[h]==split[1]){
                                        //console.log(z);
                                        //$("#sosoheart").html("<img id="+"like"+" src="+"heart.png"+" width="+"30"+">");
                                        //whoindex=j;
                                        str+="<img class="+"like"+z+" src="+"heart.png"+" width="+"30"+" onclick="+"heartclick("+z+");>";
                                        
                                        break;
                                    }
                                    if(h==following_soso_arr[z].liker.length-1){
                                        //console.log(z);
                                        //$("#sosoheart").html("<img id="+"like"+" src="+"empty_heart.png"+" width="+"30"+">");
                                        str+="<img class="+"like"+z+" src="+"empty_heart.png"+" width="+"30"+" onclick="+"heartclick("+z+");>";
                                        
                                    }
                                }
                            }
                            // else{
                            //     console.log(z);
                            //     str+="<img class="+"like"+(z+1)+" src="+"empty_heart.png"+" width="+"30"+" onclick="+"heartclick("+z+");>";
                            //     temp++;
                            // }
                            
                            str+="<br>";
                            for(var h=0; h<following_soso_arr[z].tag.length; h++)
                                tag_str += following_soso_arr[z].tag[h] +" ";
                            str+=tag_str+"</p></div></div>";
                            $("#soso_content").append(str);
                        }
                    });
                });
            }

        }
    });
}

function heartclick(num){   //num은 following_soso_arr에서 몇번째 쏘쏘인지 값 
    //console.log(soso_index_arr.length);
    var sosoindex=soso_index_arr[num];  //전체 쏘쏘에서 몇번째 쏘쏘인지 sosoindex에 저장 
    //console.log(sosoindex);
    database.ref().child('soso/').once('value', function(data) { 
        var soso_index = data.numChildren();
        var soso_data = data.val();
        var heartimg=$(".like"+num+"").attr("src");        
        if(heartimg=="empty_heart.png"){
            $(".like"+num+"").attr("src","heart.png");
            var last;
            if(soso_data[sosoindex].liker!=null){
                last=soso_data[sosoindex].liker.length;
            }
            else{
                last=0;
            }
            var foo={};
            foo[last]=split[1];
            database.ref().child('soso/'+sosoindex+'/liker/').update(foo);
        }        

        else{
            $(".like"+num+"").attr("src","empty_heart.png");
            if(soso_data[sosoindex].liker!=null){
                for(var i=0;i<soso_data[sosoindex].liker.length;i++){
                    if(split[1]==soso_data[sosoindex].liker[i]){
                        whoindex=i;
                    }
                }
            }
            var foo={};
            foo[whoindex]=null;
            database.ref().child('soso/'+sosoindex+'/liker/').update(foo);
        }

    })
}



function toptag_update(){
    var tagarr=[];
    var numarr=[];
    database.ref().child('soso/').once('value', function(data) { 
        var soso_index = data.numChildren();
        var soso_data = data.val();
        for(var i=0;i<soso_index;i++){
            for(var j=0;j<soso_data[i].tag.length;j++){
                if(tagarr.length!=0){
                    for(var k=0;k<tagarr.length;k++){
                        if(soso_data[i].tag[j]==tagarr[k]){
                            numarr[k]=numarr[k]+1;
                            break;
                        }
                        if(k==tagarr.length-1){
                            tagarr.push(soso_data[i].tag[j]);
                            numarr.push(1);
                            break;
                        }
                    }
                }
                else{
                    tagarr.push(soso_data[i].tag[j]);
                    numarr.push(1);
                }         
            }
        }
        for(var i=0;i<tagarr.length-1;i++){
            for(var j=0;j<tagarr.length;j++){
                if(numarr[j+1]>numarr[j]){
                    var temp=tagarr[j];
                    tagarr[j]=tagarr[j+1];
                    tagarr[j+1]=temp;
                    var temp2=numarr[j];
                    numarr[j]=numarr[j+1];
                    numarr[j+1]=temp2;
                }
            }
        }
        for(var i=0;i<tagarr.length-1;i++){
            for(var j=1;j<tagarr.length;j++){
                console.log(tagarr[i]+numarr[i]);
            }
        }
        for(var i=0;i<7;i++){
            if(tagarr[i]!=null)
                $("#pophash").append("<div class='tagid'>"+tagarr[i]+"</div");
        }
    })


}

var click=new Array;
for(var p=0;p<3;p++){
    click.push(true);
}
function topsoso(){
    database.ref().child('soso/').once('value',function(data){
        var top_data=data.val();

        var one=0,two=0,three=0;
        var s1=0,s2=0,s3=0;

        for(var i=0;i<top_data.length;i++){
            if(one<top_data[i].liker.length){
                one=top_data[i].liker.length;
                s1=i;
                for(var j=0;j<one;j++){
                    if(top_data[i].liker[j]==null){
                        one--;
                    }
                }
            }
            else
                continue;
        }

        for(var i=0;i<top_data.length;i++){
            if(two<top_data[i].liker.length){
                if(top_data[i].liker.length<=one&&s1!=i){
                    two=top_data[i].liker.length;
                    s2=i;
                    for(var j=0;j<two;j++){
                        if(top_data[i].liker[j]==null){
                            two--;
                        }
                    }
                }
                else
                    continue;
            }
        }

        for(var i=0;i<top_data.length;i++){
            if(three<top_data[i].liker.length){
                if(top_data[i].liker.length<=two&&s2!=i){
                    three=top_data[i].liker.length;
                    s3=i;
                    for(var j=0;j<three;j++){
                        if(top_data[i].liker[j]==null){
                            three--;
                        }
                    }
                }
                else
                    continue;
            }
        }

        if(one!=0){
            one--;
        }

        if(two!=0){
            two--;
        }

        if(three!=0)
            three--;

        $("#tag1").append("@"+top_data[s1].uploader);
        $("#heart1").append(one);


        $("#tag2").append("@"+top_data[s2].uploader);
        $("#heart2").append(two);


        $("#tag3").append("@"+top_data[s3].uploader);
        $("#heart3").append(three);

        $("#play1").click(function(){

            if(click[0]==true){
                $("#play1").append("<audio id='p1' autoplay src='"+
                    top_data[s1].soso_url+"'></audio>");
                click[0]=false;
                $("#play1").attr("src","stop.png");
            }
            else if(click[0]==false){
                $("#p1").remove();
                click[0]=true;
                $("#play1").attr("src","play.png");
            }
        });

        $("#play2").click(function(){
            if(click[1]==true){
                $("#play2").append("<audio id='p1' autoplay src='"+
                    top_data[s2].soso_url+"'></audio>");
                click[1]=false;
                $("#play2").attr("src","stop.png");
            }
            else if(click[1]==false){
                $("#p1").remove();
                click[1]=true;
                $("#play2").attr("src","play.png");
            }
        });

        $("#play3").click(function(){
            if(click[2]==true){
                $("#play3").append("<audio id='p1' autoplay src='"+
                    top_data[s3].soso_url+"'></audio>");
                click[2]=false;
                $("#play3").attr("src","stop.png");
            }
            else if(click[2]==false){
                $("#p1").remove();
                click[2]=true;
                $("#play3").attr("src","play.png");
            }
        });
    });
}


