var database = firebase.database();

var mypageurl=window.location.href;
var split=mypageurl.split("=");
$("#myID").text(split[1]);
$("#logo").click(function(){
    location.replace("main.html?val="+split[1]);
})
$("#logo2").click(function(){
	location.replace("login.html");
});

var postcount=0;
$(document).ready(function(){
	mySOSO_update();
	likeSOSO_update();
	database.ref().child('soso/').once('value', function(data) {
		var soso_index = data.numChildren();
		var soso_data = data.val();
		for(var i=0;i<soso_index;i++){
			if(split[1]==soso_data[i].uploader){
				postcount++;
			}
		}
		$("#postnum").text("게시글 "+postcount);
	});
	database.ref().child('user/').once('value', function(data) { 
		var user_index = data.numChildren();
		var user_data = data.val();
		for(var i=0;i<user_index;i++){
			if(split[1]==user_data[i].id) {
				if(user_data[i].follower==null)
					$("#wernum2").text("팔로워 0");
				else
					$("#wernum2").text("팔로워 "+user_data[i].follower.length);
				if(user_data[i].following==null)
					$("#ingnum2").text("팔로잉 0");
				else
					$("#ingnum2").text("팔로잉 "+user_data[i].following.length);      
			}       
		}
	});
});

function mySOSO_update() {
	$("#mySOSO").empty();
	var myID = split[1];
	database.ref().child('soso/').once('value', function(data) { 
		var soso_data = data.val();
		for(var i=0;i<soso_data.length;i++) {
			if(myID == soso_data[i].uploader) {
				var tag_str = "";
        		
        		for(var j=0; j<soso_data[i].tag.length; j++)
        			tag_str += soso_data[i].tag[j] +" ";
        		var str = "<div class='item'><div class='left'><p>"+tag_str
        		+"<br />　<img id='like' src='empty_heart.png' width='18' height='16'></p></div><div class='right'><audio src="+
        		soso_data[i].soso_url+" controls></audio></div></div>";
        		$("#mySOSO").append(str);
        	}
        	if(soso_data[i].liker!=null){
        		var likernum=0;
        		for(var j=0;j<soso_data[i].liker.length;j++){
	        		if(myID==soso_data[i].liker[j]){
	        			$("#like").attr("src","heart.png");
	        			break;
	        		}
	        		if(soso_data[i].liker[j]!=null)
	        			likernum++;
	        	}
	        	$("#likenum").text(likernum);
        	}
        	else
        		$("#likenum").text(0);
	        	
        	
        }

    });
}

function likeSOSO_update(){
 $("#likeSOSO").empty();
 var myid=$(".myId > p").text();
 database.ref().child('soso/').once('value',function(data){
  var soso_data=data.val();
  for(var i=0;i<soso_data.length;i++){
     var liker=soso_data[i].liker;
     var likernum=0;
     if(liker!=null){
     	for(var j=0;j<liker.length;j++){
	      if(myid==soso_data[i].liker[j]){
	        var tag="";
	        for(var k=0;k<soso_data[i].tag.length;k++){
	          tag+=soso_data[i].tag[k]+" ";
	        }
	        var str = "<div class='item'><div class='left'><p style='font-size: 8pt;'>@"+soso_data[i].uploader+"</p><p>"+tag
	        +"<br />　<img id='like' src='heart.png' width='18' height='16'></p></div><div class='right'><audio src="+
	        soso_data[i].soso_url+" controls></audio></div></div>";
	        $("#likeSOSO").append(str);
	      }
	       if(liker[j]!=null)
	       	likernum++;
	    }
	    $("#likenum").text(likernum);
     }
     else
        $("#likenum").text(0);
	    
  }
 });
}


function myFunction() {
	$("#myPopup").empty();
    var popup = document.getElementById("myPopup");
    database.ref().child('user/').once('value', function(data) { 
		var user_index = data.numChildren();
		var user_data = data.val();
		for(var i=0;i<user_index;i++){
			if(split[1]==user_data[i].id) {
				database.ref().child('user/'+i+'/follower/').once('value', function(data) { 
					var user_follower = data.val();
					for(var j=0; j<user_follower.length; j++) {
						$("#myPopup").append(user_follower[j]+"<br>");
					}
				});
				break;         
			}       
		}
	});
    popup.classList.toggle("show");
}

function myFunction2() {
	$("#myPopup2").empty();
    var popup = document.getElementById("myPopup2");
    database.ref().child('user/').once('value', function(data) { 
		var user_index = data.numChildren();
		var user_data = data.val();
		for(var i=0;i<user_index;i++){
			if(split[1]==user_data[i].id) {
				database.ref().child('user/'+i+'/following/').once('value', function(data) { 
					var user_following = data.val();
					for(var j=0; j<user_following.length; j++) {
						$("#myPopup2").append(user_following[j]+"<br>");
					}
				});
				break;         
			}       
		}
	});
    popup.classList.toggle("show");
}