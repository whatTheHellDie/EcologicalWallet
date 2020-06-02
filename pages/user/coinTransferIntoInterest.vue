<template>
	<view class="wrap-content wrap">
		<sub-nav :title="title">
		</sub-nav>
		<view>
			<view class="row b-b">
				<text class="tit">账户类型</text>
				<view class="input">币账户(Tree Bank)</view>
			</view>
			<view class="row b-b">
				<text class="tit">目标账户</text>
				<view class="input">积分(TC)</view>
			</view>
			<view class="row b-b">
				<text class="tit">账户余额</text>
				<view class="input">{{userInfo.lovebirdAccount.toFixed(2)}}</view>
			</view>
			
			<view class="row b-b">
				<text class="tit">转账数量</text>
				<input class="input" @blur="getTransfer" v-model="transferAmount" type="number" placeholder="请输入提币数量"
				 placeholder-class="placeholder" />
			</view>
			<view class="row b-b">
				<text class="tit">到账数量</text>
				<view class="input">{{arrival}}</view>
			</view>
			<view class="row b-b">
				<text class="tit">支付密码</text>
				<input class="input" type="password" v-model="password" placeholder="请输入支付密码" placeholder-class="placeholder" />
			</view>
			<!-- <view class="row b-b">
				<text class="tit">矿费</text>
				<view class="spec">{{feeRateAmount}}
					<view class="fee">(转账需要0.1%手续费)</view>
				</view>
			</view> -->
		</view>
		<view class="add-btn" @tap="confirm">确认</view>
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
				accountType:"",//转账选传到后台的类型。coinType为2使用，accountType：1:TreeBank积分; 2:LB积分;3:TreeBank币; 4:LB币
				toUserName:"",
				toUserNumber:"",
				message: "",
				title: "转入生息",
				password: "",
				transferAmount: "",
				arrival: "0",
				feeRateAmount: "0.00",
				walletAddress:"请选择数字钱包地址"
			}
		},
		watch:{
			wallet(val){
				if(val.walletAddr){
					this.walletAddress=val.walletAddr
				}else{
					this.walletAddress="请选择数字钱包地址"
				}
			}
		},
		onLoad(option) {
			this.accountType=option.accountType
		},
		onShow(){
			this.wallet
		},
		computed: {
			...mapState(['hasLogin', 'userInfo','wallet'])
		},
		methods: {
			getTransfer() {
				uni.request({
					url: this.$httpUrl("/app/about/capital/convertAssetRealityAccountCount"),
					data: {
						type:1,
						amount: this.transferAmount
					},
					method: "POST",
					header: {
						"content-type": "application/x-www-form-urlencoded",
						"token":getApp().globalData.token
					},
					success: (res) => {
						if (res.data.code === 0) {
							var data = res.data.data
							this.arrival = data.actualAccount.toFixed(2)
							this.feeRateAmount = data.feeRateAmount.toFixed(2)
						} else {
							this.message = res.data.msg;
							this.$refs.toast.show()
						}
					}
				});
			},
			transformLoveBird() {
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				//转成(Tree Bank)币
				uni.request({
					url: this.$httpUrl("/app/about/capital/transform"),
					data: {
						userId: this.userInfo.id,
						sourceType: 1,
						amount: this.transferAmount,
						payPassword: this.password
					},
					method: "POST",
					header: {
						"content-type": "application/x-www-form-urlencoded",
						"token":getApp().globalData.token
					},
					success: (res) => {
						uni.hideLoading();
						if (res.data.code === 0) {
							this.addToastInfo("转账成功")
							this.$back()
						} else {
							this.message = res.data.msg;
							this.$refs.toast.show()
						}
					}
				});
			},
			confirm() {
					if (!this.transferAmount) {
						this.message = "金额不能为空或0";
						this.$refs.toast.show()
					}
					if (!this.password) {
						this.message = "支付密码不能为空";
						this.$refs.toast.show()
					}
					this.transformLoveBird()//币转成(Tree Bank积分)
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-top: 16rpx;
	}

	.wrap-content {
		position: absolute;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		top: 0;
		left: 0;
	}

	.row {
		display: flex;
		align-items: center;
		position: relative;
		padding: 0 30rpx;
		height: 110rpx;
		background: #fff;

		.tit {
			flex-shrink: 0;
			width: 200rpx;
			font-size: 30rpx;
			color: $font-color-dark;
			height: 100%;
			align-items: center;
			display: flex;
		}

		.input {
			flex: 1;
			font-size: 30rpx;
			color: $font-color-dark;
			height: 100%;
			align-items: center;
			display: flex;
			justify-content: flex-end;
			text-align: right;
		}
		.digital{padding-right: 40rpx;
		color: #999;word-break: break-all;
		&.active{color: #333;}
		}
	}

	.default-row {
		margin-top: 16rpx;

		.tit {
			flex: 1;
		}

		switch {
			transform: translateX(16rpx) scale(.9);
		}
	}

	.add-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 80rpx;
		font-size: $font-lg;
		color: #fff;
		background: $font-color-spec;
		border-radius: 0;
		position: fixed;
		bottom: 0;
		left: 0;
	}

	.textarea {
		width: 100%;
		height: 100%;
		padding-top: 10rpx;
	}

	.iconfont {
		font-size: 54rpx;
		color: #555;
		position: absolute;
		top: 28rpx;
		right: 24rpx;
		pointer-events: none;
	}

	.spec {
		text-align: right;
		flex: 1;

		.fee {
			color: $font-color-spec;
			font-size: 24rpx;
		}

	}
</style>
