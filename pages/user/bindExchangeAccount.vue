<template>
	<view class="content wrap wrap-white">
		<sub-nav title="绑定交易所账号">
		</sub-nav>
		<view v-if="!userInfo.bindingNumber">
		<view class="please-bind">请绑定交易所账号</view>
		<view class="row b-b">
			<input class="input" type="text" v-model="account"  placeholder="请输入交易所账号" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<input class="input" type="number" v-model="verification"  placeholder="请输入验证码" placeholder-class="placeholder" />
			<view class="valid btn-default" v-if="isSendFinish" @tap="getPhoneCaptcha">获取验证码</view>
			<view class="valid btn-default" v-if="!isSendFinish">{{time}}秒后重发</view>
		</view>
		<view class="add-btn" @tap="binding">立即绑定</view>
		</view>
		<view v-else>
			<view class="binging-info">
				<view class="title">已绑定信息</view>
				<view class="name">
					<view>姓名：</view><view>{{userInfo.realName}}</view>
				</view>
				<view class="name">
					<view>交易所账号：</view><view>{{userInfo.bindingNumber}}</view>
				</view>
			</view>
		</view>
		<toast-model :message="message" verticalAlign="bottom" ref="toast" :duration="3000"></toast-model>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				message:"",
				time:120,
				isSendFinish:true,
				account:"",
				verification:"",
			}
		},
		computed: {
			...mapState(['hasLogin', 'userInfo', 'showToastInInit', 'toastInfo'])
		},
		onLoad(option){
		},
		methods: {
			...mapMutations(['addToastInfo']),
			binding(){
				uni.request({
					url: this.$httpUrl("/app/mine/binding"),
					method:"POST",
					data:{
						bourseNumber:this.account,
						userId:getApp().globalData.userId,
						verification:this.verification
					},
					header:{
						"content-type":"application/x-www-form-urlencoded",
						token: getApp().globalData.token
					},
					success: (res) => {
						if (res.data.code === 0) {
							var data=res.data.data;
							this.addToastInfo("绑定交易所成功")
							this.$back();
						} else {
							this.message=res.data.msg
							this.$refs.toast.show() 
						}
					}
				});
			},
			getPhoneCaptcha(){
				uni.request({
					url: this.$httpUrl("/app/mine/phoneCaptcha"),
					method:"POST",
					data:{
						bourseNumber:this.account
					},
					header:{
						"content-type":"application/x-www-form-urlencoded"
					},
					success: (res) => {
						if (res.data.code === 10100) {
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
		background: #fff;
		padding-top: 16rpx;
	}
	.please-bind{margin: 20rpx 20rpx 32rpx;}
	.row{
		display: flex;
		align-items: center;
		position: relative;
		margin:0 20rpx 20rpx;
		height: 90rpx;
		
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
			padding-left: 20rpx;
			background: #fff;border-radius: 10rpx;
		}
		.valid{
			width: 260rpx;
			height: 87rpx;
			color: $font-color-spec;
			margin-left: 20rpx;
			border: 1px solid $font-color-spec;
			box-sizing: border-box;
			border-radius: 10rpx;
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
		background: $font-color-spec;
	}
	.binging-info{
		
		.title{font-size: 40rpx;height: 100rpx;display: flex;padding-left: 20rpx;align-items: center;}
		.name{display: flex;justify-content: space-between;padding: 0 20rpx;border-bottom: 1px solid $border-color-base;height: 80rpx;align-items: center;margin-top: 40rpx;font-size: 32rpx;}
	}
</style>
