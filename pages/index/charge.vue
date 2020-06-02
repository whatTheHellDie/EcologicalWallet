<template>
	<view class="wrap">
		<sub-nav title="充值">
			<view class="text" @tap="toRule">规则说明</view>
		</sub-nav>
		<view class="show-list">
			<view class="ul">
				<view class="li" @tap="toCharge">
					数字货币充值
				</view>
				<view class="li" @tap="toExchange">
					法币充值
				</view>
			</view>
		</view>
		<toast-model :message="message" verticalAlign="bottom" @confirm="$toPage('/pages/user/bindExchangeAccount')" 
		 ref="toast" :duration="3000"></toast-model>
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
				message: "",
			}
		},
		computed: {
			...mapState(['hasLogin', 'userInfo', 'showToastInInit', 'toastInfo'])
		},
		onShow() {
			this.getUserInfo()
			uni.showLoading({
				title: '加载中'
			});
		},
		methods: {
			toExchange(){
				window.open('https://biliex.com/otc?s=OtcAdv.ListView&m=otc&sign=e316bdbddd9aedcf5fffe58231210c24','_blank')
			},
			toRule(){
				this.$toPage("/pages/common/externalLink?url="+this.$httpUrl("/swagger/wallter/voucherCenter/voucherCenter.html")+"&title=规则说明")
				
			},
			getUserInfo(userId){
				uni.request({
					url: this.$httpUrl("/app/base/info/userInfo"),
					data: {
						userId:this.userInfo.id
					},
					method:"POST",
					header:{
						"content-type":"application/x-www-form-urlencoded",
						token: getApp().globalData.token
					},
					success: (res) => {
						if (res.data.code === 0) {
							var data=res.data.data
							this.isExchange(data.whetherBinding)
						} else {
							this.message=res.data.msg
							this.$refs.toast.show() 
						}
					}
				});
			},
			toCharge(){
				if (this.userInfo.whetherBinding) {
					this.$toPage('/pages/index/toCharge')
				}
			},
			cancel() {
				this.$back()
			},
			isExchange(whetherBinding) {
				if (!whetherBinding) {
					this.message = "您LB账号未绑定交易所账号？"
					this.$refs.toast.showConfirmBox1()
				} 
					uni.hideLoading();

			}
		}
	}
</script>

<style lang="scss">
	.show-list {
		.ul {
			padding-top: 40rpx;
		}

		.li {
			width: 670rpx;
			height: 240rpx;
			margin: 0 auto 40rpx;
			background-image: url(/static/ic_data_community@2x.png);
			background-size: cover;
			color: #fff;
			font-size: 40rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>
