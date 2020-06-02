<template>
	<view class="wrap">
		<sub-nav title="游戏大厅">
			<view class="text" @click="isLogin('/pages/index/gameChargeRecord')">充值记录</view>
		</sub-nav>
		<view class="show-list">
			<view class="ul">
				<view class="li" @tap="toCharge">
					<view>
					<image src="/static/game.png" class="game-img" mode=""></image>
					</view>
					<view>
						<view class="title">梦幻森林</view>
						<view class="second-title">梦幻森林上线啦</view>
					</view>
				</view>
				<view class="li" @tap="toH5">
					<view>
					<image src="/static/ic_piture3_clearance@2x.png" class="game-img" mode=""></image>
					</view>
					<view>
						<view class="title">H5小游戏</view>
						<view class="second-title">敬请期待</view>
					</view>
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
		},
		methods: {
			isLogin(path){
				if(this.userInfo.userNumber){
					this.$toPage(path)
				}else{
					this.$toPage('/pages/user/login')
				}
			},
			toH5(){
				this.message="敬请期待"
				this.$refs.toast.show()
			},
			toCharge(){
				if(this.userInfo.userNumber){
				window.location.href=`http://www.baful.net/?account=${this.userInfo.userNumber}&phone=${this.userInfo.phone}&token=${getApp().globalData.token}&referrerNumber=${this.userInfo.referrerNumber}`
				}else{
					this.$toPage('/pages/user/login')
				}
				
			},
		}
	}
</script>

<style lang="scss" scoped>
	page{background: #2B3150;}
	.wrap{background: transparent;}
	.sub-nav{background: #2b3150;}
	.show-list {
		.ul {
			border-top: 20rpx solid #1D2238;
			padding-top: 32rpx;
		}
		.li {
			width: 686rpx;
			margin: 0 auto 20rpx;
			background: #1D2238;
			background-size: cover;
			color: #fff;
			padding: 30rpx;
			font-size: 32rpx;
			display: flex;
			
		}
		.game-img{
			width: 140rpx;height: 140rpx;margin-right: 30rpx;display:block;
		}
		.title{margin-top: 8rpx;line-height: 44rpx;}
		.second-title{font-size: 28rpx;margin-top: 34rpx;}
	}
</style>
