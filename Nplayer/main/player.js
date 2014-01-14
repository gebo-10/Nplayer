var jsZplay = require('./zplay/zplay');
var player=new  Object();
player.zplay = new jsZplay.jsZplay();

player.volSign=1;	//静音状态
player.playStatus=1;	//播放状态

player.initBeforeDOM=function(){
	var json=String(fs.readFileSync('config.json',{"encoding":"UTF-8"} ));
	config=JSON.parse(json);//初始化config

	list.init();

	player.zplay.setVol(config.vol);
}
player.initAfterDOM=function(){
	if(!config.playLists[config.lastPlayList][0]){
		if(config.lastPlayList=="默认"){
			config.init=false;
		}else{
			if(!config.playLists["默认"][0]){
				config.init=false;
			}else{
				list.playingList=list.currentList=config.playLists["默认"];
				list.currentListName="默认";
				config.lastPlayQueue=0;
				config.init=true;
			}
		}

	}else{
		config.init=true;
	}
	if(config.init==true){
		var info=config.source[list.playingList[config.lastPlayQueue]];
		player.open(info);
	}


	$("#play_mode").css("background-image","url(ui/"+config.playMode+".png)"); //初始mode
	list.playList.update();		//播放列表的初始化
	$("li[list='"+config.lastPlayList+"']").addClass("listFoucs");
	/////////////////////////////////////////
	$( "#progressbar" ).slider({	//进度条 
		value: 0,
		orientation: "horizontal",
		range: "min",
		min: 0,
		max: 100,
		animate: true,
		slide: function( event, ui ) {
			player.zplay.seek(ui.value);
			if(player.playStatus==0)
				player.zplay.pause();
		},
		change: function( event, ui ) {
			console.log(ui.value);
			if(ui.value>=99)
				player.next();
		}
	});
	/////////////////////////////////////////
	$( "#slider-vol" ).slider({		//声音
		orientation: "vertical",
		range: "min",
		min: 0,
		max: 100,
		value: config.vol,
		animate: true,
		slide: function( event, ui ) {
			config.vol= ui.value;
			if(player.volSign==1)
				player.zplay.setVol(config.vol);
		},
		change: function( event, ui ) {
			if(ui.value==0){
				 $("#vol").css("background-image","url(ui/no_vol.png)");
			}else{
				if(player.volSign==0)return;
				$("#vol").css("background-image","url(ui/vol.png)");
			}
			
		}
	});
	/////////////////////////////////////////////////////////////////////////


}
player.open=function(info){
	var result=player.zplay.open(info.url);
	var title=info.name+"<br>"+info.author;
	$("#title > p").html(title);

	player.playStatus=1;
	$("#play_stop").css("background-image","url(ui/stop.png)");
	lrc.open(info.lrc);

	if(list.playingList==list.currentList)
		$("li[queue='"+list.lastPlayQueue+"']").children().addClass("playing");

	if(result.errorCode>0){
		//this.stop();
		alert(result.reason);
	}
}
player.pause=function(){
	player.playStatus=0;
	$("#play_stop").css("background-image","url(ui/play.png)");
	player.zplay.pause();
}
player.stop=function(){
	player.playStatus=0;
	$("#play_stop").css("background-image","url(ui/play.png)");
	$( "#progressbar" ).slider( "value",0);
	player.zplay.stop();
}
player.next=function(){					//手动下一曲 与播放完自动下一曲的逻辑不一样
	switch(config.playMode){
		case "once" :
			player.stop();
			break;
		case "order" :
			var index=config.lastPlayQueue;
			
			if( (index+1) ==playList.length){
				player.stop();
			}else{
				config.lastPlayQueue++;
				var info=config.source[playList[++index]];
				player.open(info);
			}
			break;
			
		case "loop_one" :
			player.zplay.seek(0);
			break;
		case "loop_all" :
			var index=config.lastPlayQueue;
			
			if( (index+1) ==playList.length){
				config.lastPlayQueue=0;
				var info=config.source[playList[0]];
				player.open(info);
			}else{
				config.lastPlayQueue++;
				var info=config.source[playList[++index]];
				player.open(info);
			}
			break;
		case "random" :
			var index=Math.floor(Math.random()*playList.length+1);
			config.lastPlayQueue=index;
			var info=config.source[playList[index]];
			player.open(info);
			break;
	}
}