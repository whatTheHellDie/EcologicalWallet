<template>
	<view class="content wrap">
		<sub-nav title="加入VIP会员">
		</sub-nav>
		<view class="row b-b">
			<text class="tit">推荐号</text>
			<input class="input" type="text" v-model="joinData.referrerNumber" placeholder="请输入推荐号" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">接点号</text>
			<input class="input" type="text" v-model="joinData.parentPointNumber" placeholder="请输入接点号" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">接点区</text>
			<picker class="input picker" @change="bindPickerChange" :value="index" :range="array">
			                        <view class="uni-input">{{array[index]}}</view>
			                    </picker>
								<view class="iconfont">&#xe603;</view>
		</view>
		<view class="row b-b">
			<text class="tit">手机号</text>
			<input class="input" type="number" v-model="joinData.phone" placeholder="输入手机号码" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">验证码</text>
			<input class="input" type="number" v-model="joinData.verify" placeholder="输入手机号码" placeholder-class="placeholder" />
			<view class="validate" v-if="isSendFinish" @tap="getPhoneCaptcha">获取验证码</view>
			<view class="validate" v-if="!isSendFinish">{{time}}秒后重发</view>
		</view>
		<view class="add-btn" @tap="joinVIP">确认</view>
		<view class="warm-tip">
			温馨提示： <br>
			请确保以上信息输入正确，便于成为VIP后接入节点网络
		</view>
		<toast-model :message="message" verticalAlign="bottom" ref="toast" :duration="3000"></toast-model>
	</view>
</template>

<script>
	import { mapState,mapMutations } from 'vuex';  
	export default {
		data() {
			return {
				message:"",
				time:120,
				isSendFinish:true,
				result:'',
				index:0,
				array: ['A区',"B区"],
				joinData: {
					referrerNumber: '',
					parentPointNumber: '',
					area: 0,
					phone: '',
					verify: ""
				}
			}
		},
		onLoad(option){
		},
		methods: {
			...mapMutations(['addToastInfo']),
			joinVIP(){
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				uni.request({
					url: this.$httpUrl("/app/base/vip/enterNode"),
					data: {
						userId:getApp().globalData.userId,
						...this.joinData
					},
					method:"POST",
					header:{
						"content-type":"application/x-www-form-urlencoded",
						token: getApp().globalData.token
					},
					success: (res) => {
						uni.hideLoading();
						if (res.data.code === "0") {
							var data=res.data.data;
							this.addToastInfo("加入VIP成功")
							this.$back()
						} else {
							this.message=res.data.msg
							this.$refs.toast.show() 
						}
					}
				});
			},
			getPhoneCaptcha(){
				uni.request({
					url: this.$httpUrl("/app/base/pwd/phoneCaptcha"),
					method:"POST",
					data:{
						phone:this.joinData.phone
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
			
			bindPickerChange: function(e) {
						this.joinData.area=e.target.value;
			            this.index = e.target.value
			        },
			onConfirm(val){
				this.result=val.result
				//如果页面需要调用多个mode类型，可以根据mode处理结果渲染到哪里;
			},
			switchChange(e){
				this.joinData.default = e.detail;
			}
			
			
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
		.validate{font-size: 32rpx;color: $font-color-spec;padding: 20rpx 0 20rpx 20rpx;border-left: 1px solid $border-color-base;}
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
		border-radius: 0;
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
	.warm-tip{margin: -10rpx 32rpx;color: #666;}
</style>
