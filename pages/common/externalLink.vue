<template>
	<view class="wrap">
		<sub-nav :title="title"></sub-nav>
		<web-view :src="url" class="wrap"></web-view>
	</view>
</template>

<script>
	var wv;//计划创建的webview
	export default {
		data() {
			return {
				url:"",
				title:"Tree Bank",
				type:""
			}
		},
		
		onLoad(option) {
			if(option.title&&option.title!="undefined"){
				this.title=option.title
			}
			if(option.type&&option.type=="vip"){
				this.url=option.url+`?${getApp().globalData.userId}`
			}else{
				this.url=option.url
			}
			
		},
		onReady() {
		        // #ifdef APP-PLUS
		        var currentWebview = this.$mp.page.$getAppWebview() //获取当前页面的webview对象
		        setTimeout(function() {
		            wv = currentWebview.children()[0]
					document.getElementById("")
		            wv.setStyle({top:150,height:300})
		        }, 1000); //如果是页面初始化调用时，需要延时一下
		        // #endif
				// #ifdef H5
				var navbar=document.querySelector(".navbar")
				var top=window.getComputedStyle(navbar, null).height
				var iframe=document.querySelector("iframe")
				iframe.style.top=top
				var iframeHeight=iframe.style.height
				iframe.style.height="100%"
				iframe.style.width="100%"
				if(iframe.contentWindow.document){
					if(iframe.contentWindow.document.title){
						this.title=iframe.contentWindow.document.title
					}
				}
				
				                console.log(iframeHeight,999)

				// this.title=iframe.contentWindow.document.title
				// var currentWebview = this.$mp.page.$getAppWebview() //获取当前页面的webview对象
				// setTimeout(function() {
				//     wv = currentWebview.children()[0]
				// 	document.getElementById("")
				//     wv.setStyle({top:150,height:300})
				// }, 1000); //如果是页面初始化调用时，需要延时一下
				// #endif
		        }
		
		}
</script>

<style>
</style>
