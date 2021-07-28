var database = firebase.database();
$("#login").click(function(){
	database.ref().child('user/').once('value', function(data) { 
		var user_index = data.numChildren();
		var user_data = data.val();
		var form=document.myform;
		var str="";
		for(var i=0;i<user_index;i++){
			if(form["id"].value==user_data[i].id){
				if(form["pw"].value==user_data[i].password){
					location.replace("main.html?val="+form["id"].value);
				}
				else{
					str+="비밀번호가 다릅니다.";
					alert(str);
					break;
				}
				break;
			}
			if(i==user_index-1){
				str+="등록되지 않은 아이디입니다.";
				alert(str);
			}
		}
	});
});