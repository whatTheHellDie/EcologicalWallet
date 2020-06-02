<template>
	<view class="content wrap">
		<sub-nav :title="title">
			<view class="text" @tap="confirm">完成</view>
		</sub-nav>
		<view class="row b-b" v-if="!retrieve">
			<text class="tit">账号:</text>
			<view class="input">{{userInfo.userNumber}}</view>
			<!-- <input class="input" type="text" v-model="userPassword.name" placeholder="账号" placeholder-class="placeholder" /> -->
		</view>
		<view class="row b-b" v-else>
			<text class="tit">账号:</text>
			<input type="text" class="input" placeholder="请输入账号/手机号" v-model="userNumber" />
			<!-- <input class="input" type="text" v-model="userPassword.name" placeholder="账号" placeholder-class="placeholder" /> -->
		</view>
		<view class="row b-b" v-if="forget||retrieve">
			<text class="tit">验证码</text>
			<input class="input" type="text" v-model="captcha" placeholder="请输入验证码" placeholder-class="placeholder" />
			<view class="ab msg" v-if="isSendFinish" @tap="isRetrieveWay">发送验证码</view>
			<view class="ab msg" v-if="!isSendFinish">{{time}}秒后重发</view>
		</view>
		<view class="row b-b" v-if="!forget&&!retrieve">
			<text class="tit">旧密码</text>
			<input class="input" type="password" v-if="!seeSource" v-model="userPassword.oldPassword" placeholder="请输入旧密码" placeholder-class="placeholder" />
			<input class="input" type="text"  v-if="seeSource" v-model="userPassword.oldPassword" placeholder="请输入旧密码" placeholder-class="placeholder" />
			<image @tap="seeSource=!seeSource" :src="seeSource?'/static/ic_eye_open-password.png':'/static/ic_eye_close-password.png'" class="see-source"   mode=""></image>
		</view>
		<view class="row b-b">
			<text class="tit">新密码</text>
			<input class="input" type="password" v-model="userPassword.newPassword" placeholder="请输入新密码" placeholder-class="placeholder" />
			
		</view>
		<view class="row b-b">
			<text class="tit">确认新密码</text>
			<input class="input" type="password" v-model="userPassword.confirmPassword" placeholder="请输入再次输入新密码" placeholder-class="placeholder" />
		</view>
		<view class="warm-tip">温馨提示：由8-20位字母、数字和符号两种以上组合</view>
		<view class="warm-tip forget-password" @tap="toForget" v-if="hideForget">忘记旧密码？</view>
		<toast-model
		      :message="message"
		      verticalAlign="bottom"
		      ref="toast"
					:duration="3000"
		    ></toast-model>
	</view>
	
</template>

<script>
	 import { mapState,mapMutations } from 'vuex';  
	export default {
		computed: {
			...mapState(['userInfo'])
		},
		data() {
			return {
				retrievePhone:"",
				userNumber:"",
				isSendFinish:true,
				time:120,
				forget:false,
				retrieve:false,
				message:"",
				seeSource:false,
				title:"",
				captcha:"",
				userPassword: {
					oldPassword:'',
					newPassword:'',
					confirmPassword:''
				},
				hideForget:true,
				isPhone:false
			}
		},
		onLoad(option){
			if(option.forget){
				this.forget=true
			}else if(option.retrieve){
				this.retrieve=true
			}
			this.title=option.title
			setTimeout(()=>{
				
			},200)
		},
		methods: {
			isRetrieveWay(){
				if(this.retrieve){
					if(/^1[3456789]\d{9}$/.test(this.userNumber)){ 
							  this.isPhone=true
					          this.getPhoneCaptcha()
					        return false; 
					    } 
					uni.request({
						url: this.$httpUrl("/app/base/pwd/getUserPhone"),
						method:"POST",
						data:{
							userNumber:this.userNumber
						},
						header:{
							"content-type":"application/x-www-form-urlencoded"
						},
						success: (res) => {
							if (res.data.code === 0) {
								this.retrievePhone=res.data.data.phone
								this.getPhoneCaptcha()
							} else {
								this.message=res.data.msg
								this.$refs.toast.show() 
							}
						}
					});
				}else{
					this.getPhoneCaptcha()
				}
			},
			getPhoneCaptcha(){
				let phone;
				if(this.retrieve){
					if(this.isPhone){
						phone=this.userNumber
					}else{
						phone=this.retrievePhone
					}
				}else{
					phone=this.userInfo.phone
				}
				uni.request({
					url: this.$httpUrl("/app/base/pwd/phoneCaptcha"),
					method:"POST",
					data:{
						phone:phone
					},
					header:{
						"content-type":"application/x-www-form-urlencoded"
					},
					success: (res) => {
						if (res.data.code === 0) {
							if(res.data.msg=="频繁获取"){
								uni.showModal({
									content: res.data.msg
								});
							}else{
								this.isSendFinish=false;
								let interval=setInterval(()=>{
									if(this.time&&this.time>0){
										this.time--;
									}else{
										clearInterval(interval)
										this.time=120
										this.isSendFinish=true;
									}
								},1000)
							}
						} else {
							this.message=res.data.msg
							this.$refs.toast.show() 
						}
					}
				});
			},
			...mapMutations(['logout']),
			toForget(){
				this.forget=true
				this.hideForget=false
			},
			retrieveLoginPassword(){
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				var phoneNumber;
				if(this.isPhone){
					//如果是忘记密码和手机
					phoneNumber=this.userNumber
					uni.request({
						url: this.$httpUrl("/app/base/pwd/resetPassword2"),
						method:"POST",
						data:{
							userNumber:this.userNumber,
							password:this.userPassword.newPassword,
							phone:phoneNumber,
							captcha:this.captcha,
							operate:2
							
						},
						header:{
							"content-type":"application/x-www-form-urlencoded",
						},
						success: (res) => {
							uni.hideLoading();
							if (res.data.code === 0) {
								uni.redirectTo({url:"/pages/user/login"})
							} else {
								this.message=res.data.msg
								this.$refs.toast.show() 
							}
						}
					});
				}else{
					phoneNumber=this.retrievePhone
					uni.request({
						url: this.$httpUrl("/app/base/pwd/resetPassword"),
						method:"POST",
						data:{
							userNumber:this.userNumber,
							password:this.userPassword.newPassword,
							phone:phoneNumber,
							captcha:this.captcha,
							operate:2
							
						},
						header:{
							"content-type":"application/x-www-form-urlencoded",
							token: getApp().globalData.token
						},
						success: (res) => {
							uni.hideLoading();
							if (res.data.code === 0) {
								uni.redirectTo({url:"/pages/user/login"})
							} else {
								this.message=res.data.msg
								this.$refs.toast.show() 
							}
						}
					});
				}
				
			},
			forgetPamentPassword(){
				uni.request({
					url: this.$httpUrl("/app/base/pwd/resetPassword"),
					method:"POST",
					data:{
						userId:getApp().globalData.userId,
						payPassword:this.userPassword.newPassword,
						phone:this.userInfo.phone,
						captcha:this.captcha,
						operate:2
						
					},
					header:{
						"content-type":"application/x-www-form-urlencoded",
						token: getApp().globalData.token
					},
					success: (res) => {
						if (res.data.code === 0) {
							uni.switchTab({
							    url: '/pages/user/user'
							});
						} else {
							
							this.message=res.data.msg
							this.$refs.toast.show() 
						}
					}
				});
			},
			forgetLoginPassword(){
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				uni.request({
					url: this.$httpUrl("/app/base/pwd/resetPassword"),
					method:"POST",
					data:{
						userId:getApp().globalData.userId,
						password:this.userPassword.newPassword,
						phone:this.userInfo.phone,
						captcha:this.captcha,
						operate:2
						
					},
					header:{
						"content-type":"application/x-www-form-urlencoded",
						token: getApp().globalData.token
					},
					success: (res) => {
						uni.hideLoading();
						if (res.data.code === 0) {
							this.logout()
							uni.redirectTo({url:"/pages/user/login"})
						} else {
							
							this.message=res.data.msg
							this.$refs.toast.show() 
						}
					}
				});
			},
			resetPamentPassword(){
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				uni.request({
					url: this.$httpUrl("/app/base/pwd/resetPassword"),
					method:"POST",
					data:{
						userId:getApp().globalData.userId,
						payPassword:this.userPassword.newPassword,
						rawPayPassword:this.userPassword.oldPassword,
						operate:2
						
					},
					header:{
						"content-type":"application/x-www-form-urlencoded",
						token: getApp().globalData.token
					},
					success: (res) => {
						uni.hideLoading();
						if (res.data.code === 0) {
							this.$back()
						} else {
							this.message=res.data.msg
							this.$refs.toast.show() 
						}
					}
				});
			},
			resetLoginPassword(){
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				uni.request({
					url: this.$httpUrl("/app/base/pwd/resetPassword"),
					method:"POST",
					data:{
						userId:getApp().globalData.userId,
						password:this.userPassword.newPassword,
						rawPassword:this.userPassword.oldPassword,
						operate:1
						
					},
					header:{
						"content-type":"application/x-www-form-urlencoded",
						token: getApp().globalData.token
					},
					success: (res) => {
						uni.hideLoading();
						if (res.data.code === 0) {
							this.logout()
							uni.redirectTo({url:"/pages/user/login"})
						} else {
							this.message=res.data.msg
							this.$refs.toast.show() 
						}
					}
				});
			},
			confirm(){
				if(!this.userPassword.newPassword){
					this.message="新密码不能为空"
					this.$refs.toast.show()
					return;
				}
				if(!this.userPassword.confirmPassword){
					this.message="确认新密码不能为空"
					this.$refs.toast.show()
					return;
				}
				if(this.userPassword.confirmPassword!=this.userPassword.newPassword){
					this.message="输入的两次密码不一致"
					this.$refs.toast.show()
					return;
				}
				var pwdReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;//8到20位数字与字母组合
				if(!pwdReg.test(this.userPassword.newPassword)){
					this.message="密码应为由8-20位字母、数字和符号两种以上组合"
					this.$refs.toast.show()
					return;
				}
				if(!this.forget&&!this.retrieve){
					if(!this.userPassword.oldPassword){
						this.message="旧密码不能为空"
						this.$refs.toast.show()
						return;
					}
					if(this.title=="重置登录密码"){
						this.resetLoginPassword()
					}else{
						this.resetPamentPassword()
					}
				}else if(this.retrieve){
					this.retrieveLoginPassword()
				}else{
					if(this.title=="重置登录密码"){
						this.forgetLoginPassword()
					}else{
						this.forgetPamentPassword()
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	page{
		background: $page-color-base;
		padding-top: 16rpx;
	}
	.see-source{position: absolute;right: 30rpx;top: 44rpx;width: 34rpx;height: 16rpx;}
.warm-tip{color: #999;font-size: 24rpx;margin: 10rpx 24rpx;}
.forget-password{color: #006934;font-size: 28rpx;margin-top: 24rpx;}
	.row{
		display: flex;
		align-items: center;
		position: relative;
		padding:0 30rpx;
		height: 100rpx;
		background: #fff;
		
		.tit{
			flex-shrink: 0;
			width: 200rpx;
			font-size: 30rpx;
			color: $font-color-dark;
			    height: 100%;
			    align-items: center;
			    display: flex;
		}
		.input{
			flex: 1;
			font-size: 30rpx;
			color: $font-color-dark;
			height: 100%;
			display: flex;
			align-items: center;
		}
	}
	.default-row{
		margin-top: 16rpx;
		.tit{
			flex: 1;
		}
		switch{
			transform: translateX(16rpx) scale(.9);
		}
	}
	.add-btn{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690rpx;
		height: 80rpx;
		margin: 60rpx auto;
		font-size: $font-lg;
		color: #fff;
		background:$font-color-spec;
		border-radius: 50rpx;
	}
	.change-address{
		width: 100%;
		height: 110rpx;
		display: flex;
		align-items: center;
	}
	.textarea{width: 100%;height: 100%;padding-top: 10rpx;}
	.iconfont{    font-size: 54rpx;
    color: #8C8C8C;
    position: absolute;
    top: 28rpx;
    right: 32rpx;pointer-events: none;}
</style>
