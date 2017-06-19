// 1、tab切换
var idx;//此处定义的下标作用于整个执行环境
var tab_obj = {
	tabTitleChange_init: function (clickPic,tabTitle,tabBox) {
		var picW,toLeft,tabPosition;
		function titleToRight () {
			idx++;
			// 1、到最后一张时切换到第一张，并且将相应的tabtitle和tabBox切换到对应位置
			if ((idx+1) > $(tabTitle).length) {
				idx = 0;
				$(tabTitle).parent().offset().left = 0 + "px";
				$(tabTitle).parent().css({"left":$(tabTitle).parent().offset().left})
			};
			if (idx == 0) {
				$(tabTitle).parent().css({"left":0});
			};
				// 锚点，跳转到指定的tabTitle
			$(clickPic).attr("href","#a"+idx);
			// 2、title改变样式
			$(tabTitle).eq(idx).addClass("click-css");
			$(tabTitle).eq(idx).removeClass("click-none");
			$(tabTitle).eq(idx).siblings().removeClass("click-css");
			$(tabTitle).eq(idx).siblings().addClass("click-none");

			// 3、tab容器切换
			$(tabBox).eq(idx).show();
			$(tabBox).eq(idx).siblings().hide();
		};
		// 将此时的idx保存，与tabChange_init中的idx同步
		if ($(tabTitle).hasClass("click-css")) {
			idx = $(tabTitle+".click-css").index();
		}
		$(clickPic).click(titleToRight);
	},
	tabChange_init: function (tabTitle,tabBox) {
		function tabChange () {
			// 1、先判断tab的下标
			if ($(tabTitle).hasClass("click-css")) {
				idx = $(tabTitle+".click-css").index();
				console.log(idx)
			};

			// 2、此处保存的下标在点击向右函数中用到，为了使其拿到对应的下标
			idx = $(this).index();

			$(tabBox).eq(idx).show();
			$(tabBox).eq(idx).siblings().hide();
			$(this).addClass("click-css");
			$(this).removeClass("click-none");
			$(this).siblings().removeClass("click-css");
			$(this).siblings().addClass("click-none");
		};
		function initialize () {
			$(tabBox).not($(tabBox).eq(0)).hide();
		};
		initialize();
		$(tabTitle).click(tabChange);
	}
}
tab_obj.tabTitleChange_init(".pic",".nav-top a",".mian-change");
tab_obj.tabChange_init(".nav-top a",".mian-change");
