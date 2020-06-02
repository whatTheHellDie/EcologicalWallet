<template>
	<view class="content wrap">
		<sub-nav :title="title">
		</sub-nav>
		<view class="row b-b">
			<text class="tit">姓名</text>
			<view class="input">{{userInfo.realName}}</view>
		</view>
		<view class="row b-b">
			<text class="tit">手机/邮箱</text>
			<input class="input" type="number" v-model="registerData.phone" placeholder="请输入您注册的手机号或邮箱" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">国家地区</text>
			<view class="input" @tap='toggleTab("selector1")' >{{resultInfo1.result}}</view>
			<view class="iconfont">&#xe603;</view>
		</view>
		<view class="row b-b">
			<text class="tit">短信验证</text>
			<input class="input" type="text" v-model="registerData.verificationCode" placeholder="请输入验证码" placeholder-class="placeholder" />
			<view class="ab msg" v-if="isSendFinish" @tap="getPhoneCaptcha">获取验证码</view>
			<view class="ab msg" v-if="!isSendFinish">{{time}}秒后重发</view>
		</view>
		<view class="warm-tip">
			<view class="view">温馨提示：</view>
			1.如果您已经注册交易所账号但未实名，此操作默认使用钱包，已实名信息同步注册交易所账号；
			<view>
				2.如果之前您没有注册过交易所账号，将使用钱包已实名信息同步注册并实名交易所认证
			</view>
			
		</view>
		<view class="add-btn" @tap="confirm">注册</view>
		<view class="daibiao">点击注册即代表您已经同意操作</view>
		<toast-model
		      :message="message"
		      verticalAlign="bottom"
		      ref="toast"
					:duration="3000"
		    ></toast-model>
			<w-picker
				v-if="countryCode.length!=0&&loadCountryCode"
				mode="selector" 
				@confirm="onConfirm1" 
				ref="selector1" 
				themeColor="#006934"
				:selectList="countryCode"
			></w-picker>
	</view>
</template>

<script>
	import { mapState,mapMutations } from 'vuex';  
	import wPicker from "@/components/w-picker/w-picker.vue";
	export default {
		components:{
			wPicker,
		},
		data() {
			return {
				time:120,
				isSendFinish:true,
				title:"注册",
				message:"",
				countryCode:[],
				countryCodeIndex:0,
				loadCountryCode:false,
				countryCodeNumber:"",
				resultInfo1:{
					result:"中国（86）"
				},
				registerData: {
					userId:getApp().globalData.userId,
					verificationCode:"",
					areaCode:"86",
					phone: '',
				},
				load:false,
				
			}
		},
		computed:{
			...mapState(["userInfo"])
		},
		onLoad(option){
			this.getCountryCode()
		},
		methods: {
			...mapMutations(['addToastInfo']),
			confirm(){
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				uni.request({
					url: this.$httpUrl("/app/mine/easyRegister"),
					data:{
						userId:getApp().globalData.userId,
						verificationCode:this.registerData.verificationCode,
						phone:this.registerData.phone,
						areaCode:this.registerData.areaCode
					},
					method:"POST",
					header:{
						"content-type":"application/x-www-form-urlencoded",
						token: getApp().globalData.token
					},
					success: (res) => {
						uni.hideLoading();
						if (res.data.code === 0) {
							var data=res.data.data;
							this.addToastInfo("交易所注册成功")
							this.$back()
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
							this.loadCountryCode=true;
						} else {
							this.message=res.data.msg
							this.$refs.toast.show() 
						}
					}
				});
			},
			onConfirm1(val){
				this.registerData.areaCode=val.checkArr.code
				this.resultInfo1=val;
			},
			getPhoneCaptcha(){
				uni.request({
					url: this.$httpUrl("/app/mine/captchaRegister"),
					method:"POST",
					data:{
						phone:this.registerData.phone,
						areaCode:this.registerData.areaCode
					},
					header:{
						"content-type":"application/x-www-form-urlencoded"
					},
					success: (res) => {
						if (res.data.code === 10100) {
							// if(res.data.msg=="频繁获取"){
							// 	uni.showModal({
							// 		content: res.data.msg
							// 	});
							// }else{
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
							// }
						} else {
							this.message=res.data.msg
							this.$refs.toast.show() 
						}
					}
				});
			},
			setAddress(){
				uni.request({
					url: this.$httpUrl("/app/index/Anjoy/regionalList"),
					method:"POST",
					header:{
						"content-type":"application/x-www-form-urlencoded"
					},
					success: (res) => {
						if (res.data.code === 0) {
							var data=res.data.data
							this.multiArray[0]=data;
							for (let i=0;i<data.length;i++) {
								if(data[i].name==this.registerData.provinceName){
									this.registerData.provinceCode=data[i].code
									this.multiIndex[0]=i;
									this.multiArray[1] =this.multiArray[0][this.multiIndex[0]].cityList
									for(let x=0;x<this.multiArray[1].length;x++){
										if(this.multiArray[1][x].name==this.registerData.cityName){
											this.registerData.cityCode=this.multiArray[1][x].code
											this.multiIndex[1]=x;
											this.multiArray[2] = this.multiArray[1][this.multiIndex[1]].countyList
											for(let y=0;y<this.multiArray[2].length;y++){
												if(this.multiArray[2][y].name==this.registerData.districtName){
													this.registerData.districtCode=this.multiArray[2][y].code
													this.multiIndex[2]=y;
													this.load=true;
													return;
												}
											}
										}
									}
								}
							}
							
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
		border-radius: 10rpx;
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
	.warm-tip{font-size: 28rpx;padding: 0 32rpx;color: #999;padding-top: 12rpx;
		.view{margin-bottom: 16rpx;}
	}
	.daibiao{color: #000;text-align: center;margin-top: -24rpx;}
</style>
