var database = firebase.database();

$("#idcheck").click(function(){
	database.ref().child('user/').once('value', function(data) { 
		var user_index = data.numChildren();
		var user_data = data.val();
		var form=document.myform;
		var str="";
		var index;
		for(var i=0;i<user_index;i++){
			if(form["id"].value==user_data[i].id){
				index=i;
				if(user_data[i].question=="q1")
					$("#question").text("어렸을적 별명은?");
				else if(user_data[i].question=="q2")
					$("#question").text("가장 존경하는 교수님은?");
				else 
					$("#question").text("좋아하는 색깔은?");
				$("#questionbox").css("display","block");
				$("#qcheck").click(function(){
					var ans=document.getElementById("qans").value;
					if(ans==user_data[i].answer){
						alert("비밀번호는 "+user_data[i].password+"입니다.");
						location.reload();
					}
					else
						alert("질문에 대한 답이 틀렸습니다.");
				})
				
				break;
			}
			if(i==user_index-1){
				alert("등록된 id가 아닙니다.");
			}
		}
	});
});
