/*
SK通用表单验证插件
SkValidForm version 1.0
By seven, during May 29, 2015- June 1, 2015
For more information, please visit http://bbs.sk-school.com
SkValidForm is available under the terms of the MIT license. */

(function($){
	
	 // 默认全部配置;
	 var config = {
		"isClear": 1,				//[公共配置]是否自动清空value值,1:是0:否
		"isFocus": 1,				//[公共配置]是否自动获取焦点,1:是0:否
		"isShowRight": 1,			//[公共配置]是否标志匹配成功,1:是0:否
		"tipsmsgFadeTime": 800,		//[公共配置]表单提示消失时间（s）
		"tipsStyle1Time": 3,		//[样式一]震动时间长（短循环长度）
		"tipsStyle1Wh": 10,			//[样式一]震动幅度（px）
		"tipsStyle1Style1Fx": 40,	//[样式一]动画速度（s）
	}
		
	// 默认验证规则（自定义规则名于与默认相同则替换）;
	var ruleType = {
	 	"isEq" : 'isEq',  												//判断两个节点是否一致
		"isEmpty" : 'isEmpty',   										//判断节点是否为空
		"select" : 'select',   											//下拉框
		"radio" : 'radio',   											//按钮
		"checkbox" : 'checkbox',   										//复选框
 		"account" : /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/, 					//匹配字母开头，5-16字符，字母数字下划线
 		"pwd" : /^[a-zA-Z]\w{5,17}$/, 									//匹配以字母开头，长度在6~18之间，只能包含字符、数字和下划线
 	 	"email" : /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,		//匹配Email
 		"isChinese": /^[\u4e00-\u9fa5]{6,10}$/,	 						//匹配中文（至少6,10个汉字）
 		"isQq": /^[1-9][0-9]{5,}$/,				 						//匹配QQ帐号
 		"isInt1" : /^\d+$/, 											//匹配非负整数（正整数+0）
 		"isInt2" : /^[0-9]*[1-9][0-9]*$/,  								//匹配正整数
 		"sfz" : /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}(\d|x|X)$/, //匹配中国大陆身份证
 	 	"ip" : /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/, //匹配IP
	}

	var skSetTimeout;
	
    // 通过字面量创造一个对象，存储我们需要的共有方法;
	var methods = {
		tipsStyle1: function (options,status,configs) 
		{
			var configs = JSON.parse(configs);
			var options = JSON.parse(options);
			$(options.node).css('border','solid 1px #e6e6e6');
			if (!status)
			{
				$.skTools.flash(options.node,configs.tipsStyle1Time,configs.tipsStyle1Wh,configs.tipsStyle1Style1Fx,configs,options,status);
			}else if (status == 3){
				$(options.node).css({'border':'solid 1px #0cafec'});
			}else{
				$(options.node).after("<span class='error-tip flashClass'><em class='error-ico'>&nbsp;</em><span class='error-msg'>"+options.errmsg+"</span></span>");
				$.skTools.flash(options.node,configs.tipsStyle1Time,configs.tipsStyle1Wh,configs.tipsStyle1Style1Fx,configs,options,status);
		    }
        },
        tipsStyle2: function (options,status,configs) 
        {
			$('.flashClass').remove();
        	clearTimeout(skSetTimeout);
        	var configs = JSON.parse(configs);
			var options = JSON.parse(options);
			$(options.node).parents('p').find('.right2').remove();
			if (!status)
			{
				$(options.node).parent('p').append("<span class='flashClass err2'>"+options.errmsg+"</span>");
			}else if (status == 3){
				$(options.node).parent('p').append("<span class='right2'>&nbsp;</span>");
			}else{
				$(options.node).after("<span class='flashClass err2'>"+options.errmsg+"</span>");
			}
			$.skTools.fadeTimeAct(options,status,configs);
        },
        tipsStyle3: function () {
            // ...
        },
        beforeSubmit: function (options) {
            // ...
        },
        err1: function (options) {
            if(options == '') options = 'null';
            alert('Parameter configuration errors, node：'+ options +' on jQuery.skValidForm');
            return;
		},
        err2: function () {
            alert("Method does not exist on jQuery.skValidForm");
            return;
		},
    };

    $.skTools = {
   		show:function(param) 
   		{          
   	    	$(param).css('display','block'); 
   	    	return;
   		},
   		hide:function(param) 
   		{          
   	    	$(param).css('display','none'); 
   	    	return;
   		},
   		print:function(param) 
   		{          
   	    	console.info(param); 
   	    	return;
  		},
  		flash:function(obj,time,wh,fx,configs,options,status)
  		{
  			$(function(){
  				var $panel = $(obj);
  				var offset = $panel.offset()-$panel.width();
  				var x= offset.left;
  				var y= offset.top;
  				var $panelTip = $(obj).next('.error-tip');
  				var offsetTip = $panelTip.offset()-$panelTip.width();
  				var xTip = offsetTip.left;
  				var yTip = offsetTip.top;
  				for(var i=1; i<=time; i++){
  					if(i%2==0)
  					{
  						$panel.animate({left:'+'+wh+'px'},fx);
  						$panelTip.animate({left:'+'+wh+'px'},fx);
  					}else
  					{
  						$panel.animate({left:'-'+wh+'px'},fx);
  						$panelTip.animate({left:'-'+wh+'px'},fx);
  					}
  				}
  				$panel.animate({left:'0px'},fx);
  				$panel.offset({ top: y, left: x });
  				$panelTip.animate({left:'0px'},fx);
  				$panelTip.offset({ top: yTip, left: xTip });
  				$.skTools.fadeTimeAct(options,status,configs);
  			})
  		},
  		fadeTimeAct:function(options,status,configs){
  			if(configs.tipsmsgFadeTime)
  			{
  				skSetTimeout = setTimeout(function(){
					if(options.ruleType != 'radio' && options.ruleType != 'checkbox' && configs.isClear == 1)
					{
						$('.flashClass').prev('input').val('');
						$('.flashClass').prev('textarea').html('');
					}
					$('.flashClass').remove();
				}, configs.tipsmsgFadeTime);
  			}
			if(options.ruleType != 'radio' && options.ruleType != 'checkbox' && configs.isClear == 1)
			{
				$('.flashClass').prev('input').val('');
				$('.flashClass').prev('textarea').html('');
			}
			if(configs.isFocus) { $(options.node).focus(); }
  		}
    }    
    
    $.fn.skValidForm = function(options) 
    {
    	if (typeof options === "object") 
        {
    		var configs = $.extend({}, config, options.config);
            var settings = $.extend({}, ruleType, options.ruleType);
            var ruleAdd = options.ruleAdd;
            var tipsStyle = (options.tipsStyle == '' || !options.tipsStyle) ? 'tipsStyle1' : options.tipsStyle;
                        	
   			for(var i = 0;i<ruleAdd.length;i++)
       		{
				if(ruleAdd[i]['node'] == '' || ruleAdd[i]['ruleType'] == '') 
				{
					methods.err1(ruleAdd[i]['node']);
					return;
				}
				var val = $(ruleAdd[i]['node']).val();
				
       			if(ruleAdd[i]['ruleType'] == 'radio' || ruleAdd[i]['ruleType'] == 'checkbox') 
           		{
       				val = $(ruleAdd[i]['node']+':checked').val();
           		}
       			if(ruleAdd[i]['ruleType'] == 'select') 
           		{
       				val = $(ruleAdd[i]['node']).val();
           		}
				if(val == '' || typeof val == 'undefined')
				{
			        eval("methods."+tipsStyle+"(\'"+JSON.stringify(ruleAdd[i])+"\',0,\'"+JSON.stringify(configs)+"\')");
					return;
				}
       			if(ruleAdd[i]['ruleType'] == 'isEq') 
           		{
       				if(ruleAdd[i]['node2'] == '') {methods.err1(ruleAdd[i]['node']); return;}
   					var val2 = $(ruleAdd[i]['node2']).val();
					if(val != val2)
	  				{
					    eval("methods."+tipsStyle+"(\'"+JSON.stringify(ruleAdd[i])+"\',1,\'"+JSON.stringify(configs)+"\')");
		  				return;
					}
       			}
       			if(ruleAdd[i]['ruleType'] != 'isEq' && ruleAdd[i]['ruleType'] != 'isEmpty' && ruleAdd[i]['ruleType'] != 'select' && ruleAdd[i]['ruleType'] != 'radio' && ruleAdd[i]['ruleType'] != 'checkbox') 
           		{
   					var reg = new RegExp(settings[ruleAdd[i]['ruleType']]);
   					if(val == '')
       				{
				        eval("methods."+tipsStyle+"(\'"+JSON.stringify(ruleAdd[i])+"\',0,\'"+JSON.stringify(configs)+"\')");
	  					return;
  					}else{
  						if(!reg.test(val))
  	  					{
  					        eval("methods."+tipsStyle+"(\'"+JSON.stringify(ruleAdd[i])+"\',1,\'"+JSON.stringify(configs)+"\')");
  		  					return;
  						}
  	   				}
           		}
       			if(ruleAdd[i]['ajaxPost'] == 1 &&　$(ruleAdd[i]['node']).attr('isValid') != 1) 
				{
       				if(ruleAdd[i]['ajaxUrl'] == '' || typeof ruleAdd[i]['ajaxData'] !== "object") 
    				{
    					methods.err1(ruleAdd[i]['node']+' ajax');
    					return;
    				}
					var ajaxStatus = 1;
					var ajaxNode = ruleAdd[i]['node'];
           			$.ajax({
    					type: "POST",
    					async: false,
    					url: ruleAdd[i]['ajaxUrl'],
    					data: ruleAdd[i]['ajaxData'],
    					dataType: "json",
    					success: function(data){
    						if(data.status)
    						{
    							$(ajaxNode).attr('isValid', 1);
    						}else{
        		   				eval("methods."+tipsStyle+"(\'"+JSON.stringify({node:ajaxNode, errmsg:data.msg})+"\',1,\'"+JSON.stringify(configs)+"\')"); 
								ajaxStatus = 0;
    							return;
    						}
    					},
    					error: function(){
    		   				eval("methods."+tipsStyle+"(\'"+JSON.stringify({node:ruleAdd[i]['node'], errmsg:"errCode 500"})+"\',1,\'"+JSON.stringify(configs)+"\')"); 
							ajaxStatus = 0;
    						return;
    					}
    				});
           			if(!ajaxStatus){return;};
				}
       			if(configs.isShowRight)
       			{
				    eval("methods."+tipsStyle+"(\'"+JSON.stringify(ruleAdd[i])+"\',3,\'"+JSON.stringify(configs)+"\')");
	  			}
       		}
   			options.beforeSubmit();return;
        } else {
			methods.err2();return;
        }
    }
})(jQuery);
