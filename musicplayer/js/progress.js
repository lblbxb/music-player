(function(window){
		function Progress($progressBar,$progressLine,$progressDot){
			return new Progress.prototype.init($progressBar,$progressLine,$progressDot);
		}
		Progress.prototype={
			constructor:Progress,
			init:function ($progressBar,$progressLine,$progressDot){
				this.$progressBar=$progressBar;
				this.$progressLine=$progressLine;
				this.$progressDot=$progressDot;
			},
			isMove:false,
			progressClick:function(callBack){
				var $this=this;//此刻this是progress
				//监听背景的点击
				this.$progressBar.click(function(event){
					//获取背景距离窗口默认的位置
					var normalLeft=$(this).offset().left;
//					console.log(normalLeft);
					//获取点击的位置距离窗口的位置
					var eventLeft=event.pageX;
//					console.log(evventLeft);
                    
					$this.$progressLine.css("width",eventLeft-normalLeft);
					$this.$progressDot.css("left",eventLeft-normalLeft);
					//计算进度条的比例
					var value=(eventLeft-normalLeft)/$(this).width();
					callBack(value);
					
					
				})
			},
			progressMove:function(callBack){
				 var $this=this;
				 //监听鼠标的按下事件
				this.$progressBar.mousedown(function(){
					$this.isMove=true;
				//获取背景距离窗口默认的位置
					var normalLeft=$(this).offset().left;
					 var barwidth=$this.$progressBar.width();
					$(document).mousemove(function(){
						
					//监听鼠标的移动事件
//					console.log(normalLeft);
					//获取点击的位置距离窗口的位置
					var evventLeft=event.pageX;
//					console.log(evventLeft);
                    var offset=evventLeft-normalLeft;
                    if(offset>=0&&offset<=barwidth){
					$this.$progressLine.css("width",evventLeft-normalLeft);
					$this.$progressDot.css("left",evventLeft-normalLeft);}
//					if (evventLeft-normalLeft<=0) {
//						$this.$progressLine.css("width",0);
//					$this.$progressDot.css("left",0);
//					}
//					if(evventLeft-normalLeft>=600){
//						$this.$progressLine.css("width",600);
//					$this.$progressDot.css("left",600);
//					}
				})
				//监听鼠标的抬起事件
				$(document).mouseup(function(){
					$(document).off("mousemove");
					$this.isMove=false;
					//计算进度条的比例
					var value=(eventLeft-normalLeft)/$(this).$progressBar.width();
					callBack(value);
					});
				});
			},
		    setProgress:function(value){
		    	if(this.isMove) return;
		    	if(value<0||value>100)return;
		    	this.$progressLine.css({
		    		width:value+"%"
		    	});
		    	this.$progressDot.css({
		    		left:value+"%"
		    	})
		    }
		}
        Progress.prototype.init.prototype=Progress.prototype;
        window.Progress=Progress;
})(window);
