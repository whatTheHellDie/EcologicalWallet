<template>
	<view class="content wrap">
		<image src="/static/missing-face.jpg" class="face" mode=""></image>
		<sub-nav title="登录">
		</sub-nav>
		<div class="context-shadow" v-if="showShadow" @tap="showShadow=false"></div>
		<view class="row b-b">
			<text class="tit tit-letter">账号：</text>
			<input type="text" class="input" placeholder="请输入手机号或会员号" v-model="loginUserInfo.userNumber" />
			<image src="/static/ic_down_gray.png" @tap="showRecord" class="img-gray" mode=""></image>
			<image src="/static/ic_close_circle_black.png" v-if="loginUserInfo.userNumber" @tap="clearInfo('userNumber')" class="img-gray del" mode=""></image>
			<view class="show-record"  v-if="showShadow">
				<view class="li" @tap="intoUser(item)" v-for="item in userNumber">{{item}}</view>
			</view>
		</view>
		<view class="row b-b">
			<text class="tit">密码：</text>
			<input class="input" type="password" v-if="!seeSource" v-model="loginUserInfo.password" placeholder="请输入密码" placeholder-class="placeholder" />
			<input class="input" type="text" v-if="seeSource" v-model="loginUserInfo.password" placeholder="请输入密码" placeholder-class="placeholder" />
			<image @tap="seeSource=!seeSource" :src="seeSource?'/static/ic_eye_open-password.png':'/static/ic_eye_close-password.png'" class="see-source"   mode=""></image>
			<image src="/static/ic_close_circle_black.png" v-if="loginUserInfo.password" @tap="clearInfo('password')" class="img-gray del" mode=""></image>
		</view>
		<view class="read-agree"><text class="text" @tap="$toPage('/pages/user/resetLoginPassword?title=找回密码&retrieve=true')">忘记密码</text></view>
		<view class="add-btn" @tap="toLogin">登录</view>
		<view class="add-btn" @tap="$toPage('/pages/user/register')">注册</view>
		<toast-model :message="message" verticalAlign="bottom" ref="toast" :duration="3000"></toast-model>
		<toast-model :message="message1" verticalAlign="bottom" ref="toast1" :duration="3000"></toast-model>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	export default {
		data() {
			return {
				message:"",
				message1:"",
				showShadow:false,
				loginUserInfo:{
					userNumber:"",
					password:""
				},
				seeSource:false
			}
		},
		computed:{
			...mapState(['userNumber', 'userInfo', 'showToastInInit', 'toastInfo'])
		},
		onLoad(option){
			setTimeout(()=>{
				this.loginUserInfo.userNumber=this.userNumber[0]
			},200)
			if (this.showToastInInit) {
				this.hideToastInfo()
				this.message1 = this.toastInfo;
				setTimeout(this.$refs.toast1.show, 200)
			}
		},
		onShow() {
			if (this.showToastInInit) {
				this.hideToastInfo()
				this.message1 = this.toastInfo;
				setTimeout(this.$refs.toast1.show, 200)
			}
			
		},
		methods: {
			...mapMutations(['login','addUserNumber', 'hideToastInfo',"addToken"]),
			clearInfo(name){
				this.loginUserInfo[name]=""
			},
			intoUser(userNumber){
				this.loginUserInfo.userNumber=userNumber;
				this.showShadow=false
			},
			showRecord(){
				this.showShadow=true
			},
			getUserInfo(userId){
				uni.request({
					url: this.$httpUrl("/app/base/info/userInfo"),
					data: {
						userId:userId
					},
					method:"POST",
					header:{
						"content-type":"application/x-www-form-urlencoded",
						token: getApp().globalData.token
					},
					success: (res) => {
						if (res.data.code === 0) {
							this.login(res.data.data)
							uni.switchTab({url:"/pages/user/user"})
						} else {
							this.message=res.data.msg
							this.$refs.toast.show() 
						}
					}
				});
			},
			toLogin(){
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				uni.request({
					url: this.$httpUrl("/app/base/login/login"),
					data: this.loginUserInfo,
					method:"POST",
					header:{
						"content-type":"application/x-www-form-urlencoded",
					},
					success: (res) => {
						uni.hideLoading();
						if (res.data.code === 0) {
							this.addUserNumber([this.loginUserInfo.userNumber])
							getApp().globalData.userId = res.data.data.id;
							this.addToken(res.data.data.token)
							getApp().globalData.token = res.data.data.token;
							getApp().globalData.userNumber = res.data.data.userNumber;
							this.getUserInfo(res.data.data.id)
						} else {
							this.message=res.data.msg
							this.$refs.toast.show() 
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	
	page{
		padding-top: 16rpx;
	}
	.face{width: 200rpx;height: 200rpx;margin: 100rpx auto 100rpx;display: block;border-radius: 50%;}
	.row{
		display: flex;
		align-items: center;
		position: relative;
		width: 500rpx;
		height: 80rpx;
		margin: 0 auto;
		
		.tit{
			flex-shrink: 0;
			font-size: 30rpx;
			color: $font-color-dark;
			    height: 100%;
			    align-items: center;
			    display: flex;
		}
		.input{
			    background: transparent;
			flex: 1;
			font-size: 30rpx;
			color: $font-color-dark;
			height: 100%;
			display: flex;
			align-items: center;
		}
		
		
	}
	.add-btn{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 500rpx;
		height: 70rpx;
		margin: 60rpx auto;
		font-size: $font-lg;
		color: #fff;
		background:$font-color-spec;
		border-radius: 50rpx;
	}
	.iconfont{    font-size: 54rpx;
	color: #8C8C8C;
	position: absolute;
	top: 28rpx;
	right: 32rpx;pointer-events: none;}
	.ab{position: absolute;
	top: 28rpx;
	right: 32rpx;}
	.read-agree{
		font-size: 28rpx;color: $font-color-spec;display: flex;
		width: 500rpx;margin: 0 auto;justify-content: flex-end;
		}
	.img-gray{
		position: absolute;
		right: 10rpx;top: 18rpx;width: 48rpx;height: 48rpx;
	}
	.del{width: 40rpx;
    height: 40rpx;
    top: 22rpx;
    right: 64rpx;}
	.see-source{position: absolute;right: 14rpx;top: 38rpx;width: 34rpx;height: 16rpx;}
	.context-shadow{background: transparent;}
	.show-record{position: absolute;top: 80rpx;background: #fff;z-index: 999;width: 500rpx;
	.li{
		display: flex;align-items: center;padding-left: 100rpx;height: 80rpx;
	}
	}
</style>
