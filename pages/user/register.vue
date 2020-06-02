<template>
	<view class="content wrap">
		<sub-nav title="注册">
		</sub-nav>
		<view class="row b-b">
			<text class="tit tit-letter">会员号：</text>
			<view class="input">{{registerData.userNumber}}</view>
		</view>
		<view class="row b-b">
			<text class="tit tit-letter">邀请码：</text>
			<input class="input" v-if="!readOnly" type="text" v-model="registerData.referrerNumber"  placeholder="请输入邀请码" placeholder-class="placeholder" />
			<view class="input" v-else>{{registerData.referrerNumber}}</view>
		</view>
		<view class="row b-b">
			<text class="tit">登录密码：</text>
			<input class="input" type="password" v-model="registerData.password" placeholder="8-20位,需包含数字和字符" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">支付密码：</text>
			<input class="input" type="password" v-model="registerData.payPassword" placeholder="8-20位,需包含数字和字符" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit tit-letter1">姓名：</text>
			<input class="input" type="text" v-model="registerData.name" placeholder="请输入真实姓名" placeholder-class="placeholder" />
		</view>
		<view class="row b-b zone-picker" >
			<image src="/static/triangel-down.png" class="arrow" mode=""></image>
				<view class="picker" @tap='toggleTab("selector1")' >{{resultInfo1.result}}</view>
			    <input class="input" type="number" v-model="registerData.phone" placeholder="请输入手机号码" placeholder-class="placeholder" />

		</view>
		<view class="row b-b">
			<text class="tit">短信验证</text>
			<input class="input" type="text" v-model="registerData.captcha" placeholder="请输入验证码" placeholder-class="placeholder" />
			<view class="ab msg" v-if="isSendFinish" @tap="getPhoneCaptcha">发送验证码</view>
			<view class="ab msg" v-if="!isSendFinish">{{time}}秒后重发</view>
		</view>
		<view class="read-agree"><checkbox class="checkbox" value="cb" @tap="choose=!choose" :checked="choose" color="#006934" style="transform:scale(0.7)" />阅读并同意<text class="text" @tap="toPro">《用户注册协议》</text></view>
		<view class="add-btn" @tap="confirm">注册</view>
	<w-picker
		v-if="countryCode.length!=0&&loadCountryCode"
		mode="selector" 
		@confirm="onConfirm1" 
		ref="selector1" 
		themeColor="#006934"
		:selectList="countryCode"
	></w-picker>
	<toast-model :message="message" verticalAlign="bottom" ref="toast" :duration="3000"></toast-model>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	import wPicker from "@/components/w-picker/w-picker.vue";
	export default {
		components:{
			wPicker,
		},
		data() {
			return {
				choose:false,
				message:"",
				time:120,
				isSendFinish:true,
				countryCode:[],
				countryCodeIndex:0,
				loadCountryCode:false,
				array: [],
				index: 0,
				readOnly:false,
				registerData: {
					userNumber: '',
					referrerNumber: '',
					password: '',
					payPassword: '',
					name: '',
					phone: '',
					captcha: '',
					smsCode: '86',
					
				},
				resultInfo:{
					result:"请选择"
				},
				resultInfo1:{
					result:"中国（86）"
				}
			}
		},
		onLoad(option){
			
			
			if(option.userNumber){
				this.registerData.referrerNumber=option.userNumber
				this.readOnly=true
			}
			this.getNumberForRegister()
			this.getCountryCode()
		},
		methods: {
			...mapMutations(['login','addUserNumber','addToastInfo']),
			toPro(){
				this.$toPage('/pages/common/externalLink?url='+this.$httpUrl('/swagger/usersRegister/usersRegister.html'))
			},
			//提交
			confirm(){
				let data = this.registerData;
				if(!data.referrerNumber){
					this.message="邀请码不能为空"
					this.$refs.toast.show();
					return;
				}
				var pwdReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;//8到20位数字与字母组合
				if(!pwdReg.test(data.password)){
					this.message="登录密码应为由8-20位字母、数字和符号两种以上组合"
					this.$refs.toast.show()
					return;
				}
				if(!pwdReg.test(data.payPassword)){
					this.message="支付密码应为由8-20位字母、数字和符号两种以上组合"
					this.$refs.toast.show()
					return;
				}
				if(!data.name){
					this.message="姓名不能为空"
					this.$refs.toast.show();
					return;
				}
				if(!data.phone){
					this.message="手机号不能为空"
					this.$refs.toast.show();
					return;
				}
				if(!data.captcha){
					this.message="验证码不能为空"
					this.$refs.toast.show();
					return;
				}
				if(!this.choose){
					this.message="请先同意用户注册协议"
					this.$refs.toast.show();
					return;
				}
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				uni.request({
					url: this.$httpUrl("/app/base/register/register"),
					method:"POST",
					data:this.registerData,
					header:{
						"content-type":"application/x-www-form-urlencoded"
					},
					success: (res) => {
						
						if (res.data.code === 0) {
							this.addUserNumber([this.registerData.userNumber])
							this.addToastInfo(res.data.msg)
							this.message=res.data.msg
							this.$refs.toast.show() 
							setTimeout(()=>{
								if(this.readOnly){
									this.$toPage('/pages/user/download')
								}else{
								this.$toPage('/pages/user/login')
								}
							},2000)
							
							// uni.redirectTo({
							//     url: '/pages/user/login'
							// });
						} else {
							uni.hideLoading();
							this.message=res.data.msg
							this.$refs.toast.show() 
						}
					}
				});
			},
			getPhoneCaptcha(){
				uni.request({
					url: this.$httpUrl("/app/base/pwd/phoneCaptchaZC"),
					method:"POST",
					data:{
						phone:this.registerData.phone,
						countryCode:this.registerData.smsCode
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
			onConfirm1(val){
				this.registerData.smsCode=val.checkArr.code
				this.resultInfo1=val;
			},
			getCountryCode(){
				uni.request({
					url: this.$httpUrl("/app/countryCode"),
					header:{
						"content-type":"application/x-www-form-urlencoded"
					},
					success: (res) => {
						if (res.data.code === 0) {
							var data=res.data.data
							data.forEach((item,i)=>{
								data[i].label=item.name+`(${item.code})`
							})
							this.countryCode=data
								this.countryCode.forEach((item,i)=>{
										this.resultInfo.result=item.name
								})
							this.loadCountryCode=true;
						} else {
							this.message=res.data.msg
							this.$refs.toast.show() 
						}
					}
				});
			},
			toggleTab(name){
				this.$refs[name].show();
			},
			getNumberForRegister(){
				uni.request({
					url: this.$httpUrl("/app/base/register/getNumberForRegister"),
					success: (res) => {
						if (res.data.code === 0) {
							this.registerData.userNumber=res.data.data.userNumber
						} else {
							this.message=res.data.msg
							this.$refs.toast.show() 
						}
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	page{
		background: $page-color-base;
		padding-top: 16rpx;
	}

	.row{
		display: flex;
		align-items: center;
		position: relative;
		padding:0 30rpx;
		height: 110rpx;
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
		.tit-letter{letter-spacing: 10rpx;}
		.tit-letter1{letter-spacing: 28rpx;}
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
	.ab{position: absolute;
	top: 28rpx;
	right: 32rpx;}
	.msg{color: #006934;font-size: 32rpx;}
	.zone-picker{
		position: relative;
		.picker{width: 240rpx;display: inline-block;}
		.arrow{
			    position: absolute;
			    width: 30rpx;
			    height: 30rpx;
			    top: 42rpx;
			    left: 224rpx;
				pointer-events: none;
		}
	}
	.read-agree{
		font-size: 32rpx;
		margin: 20rpx 32rpx;
		.text{color: $font-color-spec;}
		}
</style>
