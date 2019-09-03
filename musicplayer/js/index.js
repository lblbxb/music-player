$(function(){
	//0自定义滚动条
//	$(".list").mCustomScrollbar();
    var $audio=$("audio");
    var player=new Player($audio);
    var $progressBar=$(".bar");
    var $progressLine=$(".line");
    var $progressDot=$(".dot");
    var progress=Progress($progressBar,$progressLine,$progressDot);
    var lyric;
    progress.progressClick(function(value){
    	player.musicSeekTo(value);
    });
    progress.progressMove(function(value){
    	player.musicSeekTo(value);
    });
    
    var $voiceBar=$(".voice_bar");
    var $voiceLine=$(".voice_line");
    var $voiceDot=$(".voice_dot");
    var voiceprogress=Progress($voiceBar,$voiceLine,$voiceDot);
    voiceprogress.progressClick(function(value){
    	player.musicVoiceSeekTo(value);
    });
    voiceprogress.progressMove(function(value){
    	player.musicVoiceSeekTo(value);
    });
//1加载歌曲列表
	getPlayList();
	function getPlayList(){
		$.ajax({
			url:"source/musiclist.json",
			dataType:"json",
			success:function(data){
				player.musiclist=data;
				//遍历获取到的数据，创建每一条音乐
				var $musiclist=$(".list>ul");
				$.each(data,function(index,ele){
					var $item=createMusicItem(index,ele);
					$musiclist.append($item);
					initMusicInfo(data[0]);
					initMusiclyric(data[0]);
				});
			},
			error:function(e){
				console.log(e);
			}
		});
	}
	  //2初始化给信息
	 function initMusicInfo(music){
		//获取对应的元素
		var $musicImage=$(".pic>img");
		var $musicName=$(".name>a");
		var $musicSinger=$(".singer>a");
		var $musicAblum=$(".ablum>a");
		var $musictopname=$(".top_name");
		var $musictoptime=$(".top_time");
		var $musicbg=$(".bg");
		//给对应的元素赋值
		$musicImage.attr("src",music.cover);
		$musicName.text(music.name);
		$musicSinger.text(music.singer);
		$musicAblum.text(music.album);
		$musictopname.text(music.name+" / "+music.singer);
		$musictoptime.text(" 00:00 / "+music.time);
		$musicbg.css("background","url('"+music.cover+"')");
	 };
	 function initMusiclyric(music){
	 	lyric=new Lyric(music.link_lrc);
	 	var $lyricContainer=$(".lyric");
	 	//清空上一首音乐的歌词
	 	$lyricContainer.html("");
	 	lyric.loadlyric(function(){
	 		//创建歌词列表
	 		$.each(lyric.lyrics,function(index,ele){
	 			var $item=$("<li>"+ele+"</li>");
	 			$lyricContainer.append($item);
	 		})
	 	});
	 }
	initEvents();
   function initEvents(){
   		//1.监听歌曲的移入移出事件
	$(".list").delegate(".music","mouseenter",function(){
				//显示子菜单
		$(this).find(".menu").stop().fadeIn(100);
		$(this).find(".time>a").stop().fadeIn(0);
		//隐藏时长
		$(this).find(".time>span").stop().fadeOut(0);
	});
	$(".list").delegate(".music","mouseleave",function(){
				//隐藏子菜单
		$(this).find(".menu").stop().fadeOut(100);
		$(this).find(".time>a").stop().fadeOut(0);
		//显示时长
		$(this).find(".time>span").stop().fadeIn(0);
	});
	//2.监听复选框的点击事件
	$(".list").delegate(".check","click",function(){
		$(this).toggleClass("checked")
	});
	//3.添加子菜单播放按钮的监听
	var $musicPlay=$(".play");
	$(".list").delegate(".menu_play","click",function(){
//		console.log($(this).parents(".music").get(0).index);
//		console.log($(this).parents(".music").get(0).music);
		//3.1切换播放图标
		$(this).toggleClass("menu_play2");
		//3.2复原其他的播放图标
		$(this).parents(".music").siblings().find(".menu_play").removeClass("menu_play2");
		//3.3同步底部的播放按钮
		if($(this).attr("class").indexOf("menu_play2")!=-1){
			//当前子菜单的播放按钮不是播放状态
			$musicPlay.removeClass("play2");
			$(this).parents(".music").find("div").css("color","white");
			$(this).parents(".music").siblings().find("div").css("color","rgba(255,255,255,0.5)");
		}
		else{
			$musicPlay.addClass("play2");
			$(this).parents(".music").find("div").css("color","rgba(255,255,255,0.5)");
		}
		$musicPlay.toggleClass("play2");
		//3.4切换序号的状态
		$(this).parents(".music").find(".number").toggleClass("number2");
		$(this).parents(".music").siblings().find(".number").removeClass("number2");
		//3.5播放音乐
		player.playMusic($(this).parents(".music").get(0).index,$(this).parents(".music").get(0).music);
		//3.6切换歌曲信息
		initMusicInfo($(this).parents(".music").get(0).music);
		initMusiclyric($(this).parents(".music").get(0).music);
	});
	   //4监听底部控制区域播放按钮的点击
	   $musicPlay.click(function(){
	   	if(player.currentIndex==-1){
	   		//没有播放过音乐
	   		$(".music").eq(0).find(".menu_play").trigger("click");
	   	}else{
	   		$(".music").eq(player.currentIndex).find(".menu_play").trigger("click");
	   	}
	   })
	   //5监听底部控制区域上一首按钮的点击
	   $(".pre").click(function(){
	   	$(".music").eq(player.preIndex()).find(".menu_play").trigger("click");
	   })
	   //6监听底部控制区域下一首按钮的点击
	   $(".next").click(function(){
	   		$(".music").eq(player.nextIndex()).find(".menu_play").trigger("click");
	   });
	   //7监听删除按钮的点击
	   $(".list").delegate(".menu_del","click",function(){
	   	var $item=$(this).parents(".music");
	   	if($item.get(0).index==player.currentIndex){
	   		$(".next").trigger("click");
	   	}
	   	    $item.remove();
	   	    player.changemusic($item.get(0).index);
	   	    //重新排序
	   	    $(".music").each(function(index,ele){
	   	    	ele.index=index;
	   	    	$(ele).find(".number").text(index+1);
	   	    });
	   });
	     //8监听播放速度
	     player.$audio.on("timeupdate",function(){
//	     	console.log(player.getMusicDuration());
//	     	console.log(player.getMusicCurrentTime());
	     	var duration=player.getMusicDuration();
	     	var currentTime=player.getMusicCurrentTime();
	     	var timeStr=formatDate(currentTime,duration);
	     	//同步时间
	     	$(".top_time").text(timeStr);
	     	//同步进度条
	     	//计算播放比例
	     	var value=currentTime/duration*100;
	     	progress.setProgress(value);
	     	//实现歌词同步
	     	var index=lyric.currentIndex(currentTime);
	     	var $item=$(".lyric>li").eq(index);
	     	$item.addClass("cur");
	     	$item.siblings().removeClass("cur");
	     	if(index<=2) return;
	     	$(".lyric").css({
	     		marginTop:(-index+2)*30
	     	})
	     })
	     //9监听声音按钮的点击
	     $(".voice>.laba").click(function(){
	     	$(this).toggleClass("laba2");
	     	if($(this).attr("class").indexOf("laba2") !=-1){
	     		//变为没声音
	     		player.musicVoiceSeekTo(0);
	     	}else{
	     		//变为有声音
	     		player.musicVoiceSeekTo(1);
	     	}
	     })
   }
	//定义一个方法创建一条音乐
	function createMusicItem(index,music){
		 var $item = $("" +
        "<li class=\"music\">\n" +
            "<div class=\"check\"><i></i></div>\n" +
            "<div class=\"number\">"+(index + 1)+"</div>\n" +
            "<div class=\"name\">"+music.name+"" +
            "     <div class=\"menu\">\n" +
            "          <a href=\"javascript:;\" title=\"播放\" class='menu_play'></a>\n" +
            "          <a href=\"javascript:;\" title=\"添加\"></a>\n" +
            "          <a href=\"javascript:;\" title=\"下载\"></a>\n" +
            "          <a href=\"javascript:;\" title=\"分享\"></a>\n" +
            "     </div>\n" +
            "</div>\n" +
            "<div class=\"singer\">"+music.singer+"</div>\n" +
            "<div class=\"time\">\n" +
            "     <span>"+music.time+"</span>\n" +
            "     <a href=\"javascript:;\" title=\"删除\" class='menu_del'></a>\n" +
            "</div>\n" +
        "</li>");
        $item.get(0).index=index;
        $item.get(0).music=music;
        return $item;
	}
    //定义一个格式化时间的方法
    function formatDate(currentTime,duration){
    	var endMin=parseInt(duration/60);
    	var endSec=parseInt(duration%60);
    	if(endMin<10){
    		endMin="0"+endMin;
    	}
    	if(endSec<10){
    		endSec="0"+endSec;
    	}
    	var startMin=parseInt(currentTime/60);
    	var startSec=parseInt(currentTime%60);
    	if(startMin<10){
    		startMin="0"+startMin;
    	}
    	if(startSec<10){
    		startSec="0"+startSec;
    	}
    	return startMin+":"+startSec+" / "+endMin+":"+endSec;
    }
});