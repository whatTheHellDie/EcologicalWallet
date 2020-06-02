<template>
	<view class="wrap">
		<view class="navbar sub-nav" >
			<view class="fixed-status-bar"></view>
			<image src="/static/ic_left@2x.png" @tap="$back" class="back" mode=""></image>
			<view class="title">
				邀请好友
			</view>
			<view class="text" :style="{color:'#333'}" @click="share"><image src="/static/shareIcon.png" class="share-icon" mode=""></image></view>

		</view>
		<view class="invite-friend">
			<image src="/static/inviteFriend.png" class="img" mode=""></image>
			<tki-qrcode
			 class="qrcode"
			  ref="qrcode"
			  :val="address"
			  :size="310"
			  unit="upx"
			  :onval="true"
			  :loadMake="true"
			  :showLoading="false"
							:icon="icon"
							:iconSize="iconsize"
							:usingComponents="true"
							
			   />
		<view class="qrcode qr-text">
			<view>扫描注册并下载APP</view>
			<view class="invite-code">我的邀请码：{{code}}</view>
		</view>
		</view>
		<div class="fans clearfix" @click="$toPage('/pages/fans/fans')">
		      <div class="li active"><image src="/static/ic_fan_purple@2x.png" class="img"/>我的粉丝</div>
		    </div>
		<toast-model :message="message" verticalAlign="bottom" 
		 ref="toast" :duration="3000" @confirmx="copyAddress"></toast-model>
		 <toast-model :message="message1" verticalAlign="bottom"
		  ref="toast1" :duration="3000" @confirmx="copyAddress"></toast-model>
	</view>
</template>

<script>
	import tkiQrcode from "@/components/tki-qrcode/tki-qrcode.vue";
	import NativeShare from '@/utils/NativeShare.js'
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		components:{
			tkiQrcode
		},
		data() {
			return {
				code:"",
				message: "",
				message1: "",
				address:"",
				load:false,
				icon:'/static/logo.png',
				iconsize:30
			}
		},
		computed: {
			...mapState(['hasLogin', 'userInfo', 'showToastInInit', 'toastInfo'])
		},
		onLoad() {
			this.getInviteCode()
		},
		methods: {
			getInviteCode(){
				uni.request({
					url: this.$httpUrl("/app/base/register/invitationCode"),
					data: {
						userNumber: this.userInfo.userNumber
					},
					method: "POST",
					header: {
						"content-type": "application/x-www-form-urlencoded",
						"token":getApp().globalData.token
					},
					
					success: (res) => {
						if (!res.data.code) {
							this.address=window.location.protocol+"//"+window.location.host+"/pages/user/register?userNumber="+res.data;
							window.shareUrl=this.address
							console.log(shareUrl)
							this.code=res.data
						} else {
							this.message = res.data.msg
							this.$refs.toast.show()
						}
					}
				});
			},
			copyAddress(){
				uni.setClipboardData({ data:window.location.protocol+"//"+window.location.host+"/pages/user/register?userNumber="+getApp().globalData.userNumber, success:(data)=>{
					this.message1="复制成功"
					this.$refs.toast1.show()
				}, fail:function(err){
					this.message="复制失败，您的浏览器不支持自动复制，请长按地址复制"
					this.$refs.toast.show()
				}, complete:function(res){} })
			},
			share(){
				var obj={ 
						icon: window.location.protocol+"//"+window.location.host+"/static/logo.png",
						link: this.address,
						title: 'Tree Bank',
						desc: '快邀请好友来Treebank赚钱吧！'
					}
					console.log(obj)
					obj=JSON.stringify(obj)
				if(window.Ecologic){
					
					window.Ecologic.AppShare(obj)
				}else if(window.webkit){
					window.webkit.messageHandlers.appShare.postMessage({"params":obj});
					
				}else{
				// 先创建一个实例
				var nativeShare = new NativeShare()
				// 如果你需要在微信浏览器中分享，那么你需要设置额外的微信配置
				// 特别提示一下微信分享有一个坑，不要分享安全域名以外的链接(具体见jssdk文档)，否则会导致你配置的文案无效
				// 创建实例应该带参数
				var nativeShare = new NativeShare({
				    wechatConfig: {
				        appId: '',
				        timestamp: '',
				        nonceStr: '',
				        signature: '',
				    },
				  	// 让你修改的分享的文案同步到标签里，比如title文案会同步到<title>标签中
					// 这样可以让一些不支持分享的浏览器也能修改部分文案，默认都不会同步
				  	syncDescToTag: false,
				  	syncIconToTag: false,
				  	syncTitleToTag: false,
				})
				
				// 你也可以在setConfig方法中设置配置参数
				nativeShare.setConfig({
				    wechatConfig: {
				        appId: '',
				        timestamp: '',
				        nonceStr: '',
				        signature: '',
				    }
				})
				
				
				// 设置分享文案
				nativeShare.setShareData({
				    icon:  window.location.protocol+"//"+window.location.host+"/static/logo.png",
				    link: this.address,
				    title: 'Tree Bank',
				    desc: '快邀请好友来Treebank赚钱吧！',
				    from: '@fa-ge',
				})
				
				// 唤起浏览器原生分享组件(如果在微信中不会唤起，此时call方法只会设置文案。类似setShareData)
				try {
					nativeShare.call()
				    // 如果是分享到微信则需要 nativeShare.call('wechatFriend')
				    // 类似的命令下面有介绍
				} catch(err) {
					if(err.toString()=="Error: the browser may not support command default!"){
						this.message="该浏览器不支持自动分享，请长按手动复制分享地址分享 "+this.address
						this.$refs.toast.showConfirmBox2()
						return;
					}
					if(err.toString()=="ReferenceError: browser is not defined"){
						this.message="浏览器开小差，请稍候再试"
						this.$refs.toast.show()
						return;
					}
				  // 如果不支持，你可以在这里做降级处理
				  this.message="该浏览器不支持自动分享，请长按手动复制 "+this.address+
				  "。 失败原因："+err
				  this.$refs.toast.showConfirmBox2()
				}
				}
			},
		}
	}
</script>

<style lang="scss">
	.wrap{padding-bottom: 82rpx;background: #fff;}
	page{background: #01b2ab;}
	.sub-nav{
		background: transparent;
	}
	.invite-friend{
		.img{
		width: 100%;height: 1297rpx;display: block;position: absolute;top: 0;left: 0;
		}
		.qrcode{position: absolute;top: 728rpx;left: 222rpx;}
		.qr-text{    top: 1052rpx;left: 96rpx;color: #cb4117;
    text-align: center;width: 560rpx;}
	}
	.invite-code{font-size: 36rpx;margin-top: 10rpx;}
	.share-icon{width: 46rpx;height: 44rpx;position: relative;top: -4rpx;}
	.fans {
	      position: absolute;
	      width: 600rpx;
	      top: 1224rpx;
	      border-radius: 34rpx;
	      left: 75rpx;
	      background: #007f8e;
		  margin-bottom: 20rpx;
	}
	
	.fans .li {
	  height: 82rpx;
	  font-size: 27rpx;
	  line-height: 82rpx;
	  text-align: center;
	  max-height: 9999px;position: relative;
	  color: #fff;
	}
	
	.fans .img {
	  width: 36rpx;
	  height: 36rpx;
	  margin-right: 12rpx;
	  display: inline-block;
	  vertical-align: -8rpx;
	}
</style>
