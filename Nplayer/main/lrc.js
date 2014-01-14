var lrc=new Object();
lrc.open=new Function();

lrc.scroll=new Function();
lrc.lrcJson={0:"<br/>"};

lrc.scroll=function(time){

		while(time){
			if(lrc.lrcJson[time])
				break;
			time--;
		}
		var obj=$("p[time=\""+time+"\"]");
		var nextTime=0;
		if(obj.next()){
			nextTime=obj.next().attr("time");	//下个段落的时间
		}
		var pos=obj.attr("lang");
		$("#lrc #container").stop().animate({marginTop: -pos}, (nextTime-time+1)*1000);
		$(".lrcNow").removeClass("lrcNow");
		obj.addClass("lrcNow");

}

lrc.open=function(lrcFile){

	var lrc=String(fs.readFileSync(lrcFile,{"encoding":"UTF-8"}));
	var lrcArray = lrc.split('\n');
	
	//lrc.lrcJson[0]="<br/>";
	var time;
	for(var i = 0,l = lrcArray.length;i < l;i++){
		//正则匹配 删除[00:00.00]格式或者 [00:00:00]格式
		//所有的 lrc 都应该 decode 一下，因为各种语言都可能有
		clause = decodeURIComponent(lrcArray[i]).replace(/\[\d*:\d*((\.|\:)\d*)*\]/g,'');
		timeRegExpArr = decodeURIComponent(lrcArray[i]).match(/\[\d*:\d*((\.|\:)\d*)*\]/g);
		if(timeRegExpArr) {
			for(var k = 0,h = timeRegExpArr.length;k < h;k++) { //第一遍循环，JSON存储歌词，数组存储时间
				min = Number(String(timeRegExpArr[k].match(/\[\d*/i)).slice(1));
				sec = Number(String(timeRegExpArr[k].match(/\:\d*/i)).slice(1));
				time = min * 60 + sec;
				this.lrcJson[time] = clause + '<br />';
			}
		} 
	}
	var pos=player.zplay.getPos();
	this.lrcJson[pos.minute*60+pos.second-3] ='<br/>';

	//console.log(this.lrcJson);
	$("#lrc #container").stop().empty().css("margin-top","0");

	for(var time in this.lrcJson){
		//console.log(time);
		$("#lrc #container").append("<p time=\""+time+"\" >"+this.lrcJson[time]+"</p>");
		var obj=$("p[time=\""+time+"\"]");
		var pos=obj.position();
		obj.attr("lang",pos.top-285);

	}
};
var lrcSign=new Object();
	lrcSign.status=false;
	lrcSign.lastY=0;
	lrcSign.newTime=0;
$(document).ready(function(){ 
	
$("#lrc").mousemove(function(e){
	if(lrcSign.status==false) return;
	


	var offset=e.pageY-lrcSign.lastY;

	var newTime=$(".lrcNow").attr("time")-offset*2;
	if (newTime<0) {newTime=0;};
	while(newTime){
		if(lrc.lrcJson[newTime])
			break;
		newTime--;
	}
	var obj=$("p[time=\""+newTime+"\"]");
	if(obj){
		console.log("newTime=",newTime);
		var pos=obj.attr("lang");
		$("#lrc #container").stop().animate({marginTop: -pos}, "fast");

		pos=player.zplay.getPos();
		var num=Number(newTime/(pos.minute*60+pos.second)*100);
		$( "#progressbar" ).slider('value',num);
		console.log("num2=",num);

	}else{
		//$("#lrc #container").stop().animate({marginTop: 0}, "fast");
	}


	lrcSign.newTime=newTime;
	//lrcSign.lastY=e.pageY;

	console.log("mousemove",offset);
});
$("#lrc").mouseup(function(e){
	//alert(lrcSign.status);
	if(lrcSign.status==false) return;
	var offset=e.pageY-lrcSign.lastY;
	if (offset==0) {lrcSign.status=false;return true;};

	var pos=player.zplay.getPos();
	var num=Number(lrcSign.newTime/(pos.minute*60+pos.second)*100)
	$( "#progressbar" ).slider('value',num);

	player.zplay.seek(num);
	if (player.playStatus==0)
		player.zplay.pause();
	lrc.scroll(lrcSign.newTime);
	


	lrcSign.status=false;
	console.log("num=",num);
	
	return true;
});
$("#lrc").mousedown(function(e){
	lrcSign.status=true;
	lrcSign.lastY=e.pageY;
	console.log("mousedown",e.pageY);
});

$("#lrc").mouseleave(function(e){
	if(lrcSign.status==false) return;
	lrcSign.status=false;
	
	var obj=$(".lrcNow");
	var pos=obj.attr("lang");
	$("#lrc #container").stop().animate({marginTop: -pos}, "fast");

});
});
