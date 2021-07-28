var check=false;
var database = firebase.database();

$("#check").click(function(){
	database.ref().child('user/').once('value', function(data) { 
		var user_index = data.numChildren();
		var user_data = data.val();
		var checkid = document.getElementById("id").value;
		var str="";
		for(var i=0;i<user_index;i++){
			if(checkid==user_data[i].id) {
				str+="이미 등록된 아이디입니다. 다른 아이디를 사용해주세요.";
				alert(str);
				break;
			}
			if(i==user_index-1) {
				str+="사용가능한 아이디입니다.";
				alert(str);
				check=true;
			}
		}
	});
});
$("#join").click(function(){
	var str="";
	var id=document.getElementById("id").value;
	var name=document.getElementById("name").value;
	var pw=document.getElementById("pw").value;
	var answer=document.getElementById("answer").value;
	if(id.length==0){
		str+="아이디를 입력해주세요.";
		alert(str);
	}
	else if(name.length==0){
		str+="이름을 입력해주세요.";
		alert(str);
	}
	else if(pw.length==0){
		str+="비밀번호를 입력해주세요.";
		alert(str);
	}
	else if(answer.length==0){
		str+="비밀번호 찾기 답을 입력해주세요.";
		alert(str);
	}
	else if(check==false){
		str+="아이디 중복확인을 해주세요.";
		alert(str);
	}
	else{
		var form=document.myform;
		var que=form["question"].value;
		database.ref().child('user/').once('value', function(data) { 
			var user_index = data.numChildren();
			database.ref().child('user/'+user_index+'/').set(
			{
				"id":id,
				"name":name,
				"password":pw,
				"question":que,
				"answer":answer,
				"following" : [null],
				"follower" : [null]
			});
		});
		str+="회원가입이 완료되었습니다. 로그인해주세요";
		alert(str);
		location.replace("index.html");
	}
});
