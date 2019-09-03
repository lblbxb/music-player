(function(window){
	function Lyric(path){
		return new Lyric.prototype.init(path);
	}
	Lyric.prototype={
		constructor:Lyric,
		init:function(path){
          this.path=path;
		},
		times:[],
		lyrics:[],
		index:-1,
		loadlyric:function(callBack){
			var $this=this;
				$.ajax({
			url:$this.path,
			dataType:"text",
			success:function(data){
//              console.log(data);
                 $this.parselyric(data);
                 callBack();
			},
			error:function(e){
				console.log(e);
			}
		});
		},
		parselyric:function (data){
			var $this=this;
			//清空上一首歌曲的歌词和时间
			$this.times=[];
			$this.lyrics=[];
			var array=data.split("\n");
			//console.log(array);
             var timereg=/\[(\d*:\d*\.\d*)\]/
			//遍历取出每一条歌词
			$.each(array,function(index,ele){
				 var lrc=ele.split("]")[1];
//              console.log(lrc);
                  //排除空字符串
                  if(lrc.length==1) return true;
                  $this.lyrics.push(lrc);
//				console.log(ele);
				var res=timereg.exec(ele);
//				console.log(res);
                if(res==null)return true;
                var timestr=res[1];//00:00.92
                var res2=timestr.split(":");
                var min=parseInt(res2[0])*60;
                var sec=parseFloat(res2[1]);
                var time=parseFloat(Number(min+sec).toFixed(2));
//              console.log(time);
                $this.times.push(time);
                
			});
		},
        currentIndex:function(currentTime){
        	if(currentTime>=this.times[0]){
        		this.index++;
        		this.times.shift();//删除数组最前面的一个元素
        	}
        	return this.index;
        }
	}
	Lyric.prototype.init.prototype=Lyric.prototype;
	window.Lyric=Lyric;
})
(window);
