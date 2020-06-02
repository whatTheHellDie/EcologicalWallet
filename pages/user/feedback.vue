<template>
	<view class="content wrap">
		<sub-nav title="意见反馈">
		</sub-nav>
		<view class="text-wrap">
		<textarea v-model="value" class="textarea" @keyup="getValueLength" maxlength="200" placeholder="请输入文字" />
		<text class="text">{{valueLength}}/200</text>
		</view>
		<view class="add-btn" @tap="confirm">提交</view>
		<toast-model :message="message" verticalAlign="bottom" ref="toast" :duration="3000"></toast-model>
	</view>
</template>

<script>
	import { mapState,mapMutations } from 'vuex';  
	export default {
		data() {
			return {
				message:"",
				value:"",
				valueLength:0
			}
		},
		computed:{
		},
		methods: {
			...mapMutations(['addToastInfo']),
			getValueLength(){
				this.valueLength= this.value.length
			},
			confirm(){
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				uni.request({
					url: this.$httpUrl("/app/base/files/feedback"),
					data: {
						userId:getApp().globalData.userId,
						content:this.value
					},
					method:"POST",
					header:{
						"content-type":"application/x-www-form-urlencoded",
						token: getApp().globalData.token
					},
					success: (res) => {
						uni.hideLoading();
						if (res.data.code === 0) {
							this.addToastInfo("意见反馈成功")
							this.$back()
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
		background: $page-color-base;
		padding-top: 16rpx;
	}
	.text-wrap{position: relative;width: 678rpx;height: 600rpx;display: flex;margin: 50rpx auto;
	.textarea{position: relative;background: #f4f5f5;width: 678rpx;height: 600rpx;display: flex;
	padding: 10rpx 40rpx;
	
	}
	.text{position: absolute;right: 20rpx;bottom: 20rpx;color: #C0C4CC;}
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
</style>
