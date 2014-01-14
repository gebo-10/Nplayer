var list=new Object();
list.playList=new Object();		//左边 音乐列表
list.musicList=new Object();	//右边 音乐列表
list.currentListName="";
list.currentList= new Array();
list.playingList= new Array();
list.lastPlayQueue=0;
list.init=function(){
	list.currentListName=config.lastPlayList;
	list.currentList=list.playingList=config.playLists[config.lastPlayList];
	list.lastPlayQueue=config.lastPlayQueue;
}
list.playList.update=function(){
	$("#playList-ul").empty();
	for (var list in config.playLists){
		var str="<li list="+list+"><p>"+list+"</p></li>";
		$("#playList-ul").append(str);
	}
	$("li[list='"+list.currentListName+"']").addClass("listFoucs");
}
list.playList.addList=function(name){
	config.playLists[name]=Array();
	list.playList.update();
}
list.musicList.update=function(alist){
	$("#musicList-ul").empty();
	for(var i=0;i<alist.length;i++){
		var info=config.source[alist[i]];
		var str="<li queue=\""+i+"\" ><div class=\"normalItem\">"+info.name+"</div><div class=\"selectedItem\" >"+info.name+"<span queue=\""+i+"\" class=\"playThis\">play</span><span queue=\""+i+"\" class='delThis'>del</span></div></li>";
		$("#musicList-ul").append(str);
	}
	if(list.playingList==list.currentList)
		$("li[queue='"+list.lastPlayQueue+"']").children().addClass("playing");

}
list.musicList.addMusic=function(playListTo,url){
	var info={"name":"","author":""}
	var tmp=url;
	var tmp2=tmp.match(/[^\\](?=\.(mp3|mp2|mp1|ogg|flac|ac3|aac|oga|wav|and|pcm)\b)/);
	info["name"]=tmp2[0];
	//info["author"]=;
	info["url"]=url;
	info["lrc"]=url.replace(/\.(mp3|mp2|mp1|ogg|flac|ac3|aac|oga|wav|and|pcm)\b/,".lrc");
	config.source[++config.uid]=info;
	playListTo.push(String(config.uid));

	var str="<li><div class=\"normalItem\">"+info.name+"</div><div class=\"selectedItem\" >"+info.name+"<span queue=\""+i+"\" class=\"playThis\">play</span><span queue=\""+i+"\" class='delThis'>del</span></div></li>";
	$("#musicList-ul").append(str);
}