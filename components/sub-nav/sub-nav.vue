<template>
	<view class="navbar sub-nav" :style="style">
		<view class="fixed-status-bar"></view>
		<image src="/static/ic_left@2x.png" @tap="back" class="back" mode=""></image>
		<view class="title">
			{{title}}
		</view>
		<slot></slot>
	</view>
</template>

<script>
	export default {
		data(){
			return {
			}
		},
		props:{
			title:[String,Number]
		},
		computed: {
		    style() {
		        //#ifdef MP-WEIXIN
		        var systemInfo = uni.getSystemInfoSync()
		        return `top:${systemInfo.statusBarHeight}px`
		        //#endif
		        //#ifdef APP-PLUS
		        //#endif
		    }
		},
		methods:{
			back(){
				//#ifdef H5
					window.history.go(-1)
				//#endif
				//#ifdef APP-PLUS
					uni.navigateBack()
				//#endif
				
			}
		}
	}
</script>

<style>
</style>
