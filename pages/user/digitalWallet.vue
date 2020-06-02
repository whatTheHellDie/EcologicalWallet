<template>
	<view class="content b-t wrap">
		<sub-nav title="数字钱包">
			<view class="text" @tap="$toPage('/pages/user/digitalWalletManage')">添加</view>
		</sub-nav>
		<view class="no-data" v-if="addressList.length==0&&finish">
			<image src="/static/no-data.png" class="img" mode=""></image>
			<text class="view">暂无数据!</text>
		</view>
		<view class="address-list">
			<view class="ul">
				<view class="li" @tap="addWallet(item)" v-for="item,index in addressList">
					<view class="content">
						<image :src="item.logoUrl" class="radius" mode="" @error="onImageError('addressList', index)"></image>
					<view class="item">
							<view class="name">{{item.digitalTypeName}}</view>
							<view class="address">{{item.type}}</view>
							<view class="address">{{item.walletAddr}}</view>
					</view>
					</view>
					<view class="default">
						<view class="left" @tap.stop="setDefault(item.id)">
						<image :src="item.isDefault?'/static/ic_selected@2x.png':'/static/ic_not-selected@2x.png'" class="img" mode=""></image>
						<text>默认地址</text>
						</view>
						<view class="right space-between">
							<view class="btn-default" @tap.stop="editAddress(item)">编辑</view>
							<view class="btn-default" @tap.stop="deleteAddress(item.id)">删除</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<toast-model :message="message" verticalAlign="bottom" ref="toast" :duration="3000"></toast-model>
	</view>
</template>

<script>
	import { mapState,mapMutations } from 'vuex';  
	export default {
		data() {
			return {
				finish:false,
				addressList: [],
				message:"",
				type:""
			}
		},
		computed: {
			...mapState(['hasLogin','userInfo','showToastInInit','toastInfo','wallet'])
		},
		onLoad(option){
			if(option.type){
				this.type=option.type;
			}
			this.getList()
		},
		onShow(){
			this.getList()
			if(this.showToastInInit){
				this.hideToastInfo()
				this.message=this.toastInfo;
				setTimeout(this.$refs.toast.show,200)
			}
		},
		
		methods: {
			...mapMutations(['addUserAddress','hideToastInfo','adduseWallet']),
			addWallet(obj){
				if(this.type){
					this.adduseWallet(obj)
					setTimeout(this.$back,200)
				}
			},
			editAddress(obj){
				var editObj=JSON.stringify(obj)
				this.$toPage(`/pages/user/digitalWalletManage?obj=${editObj}`)
			},
			setDefault(id){
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				uni.request({
					url: this.$httpUrl("/app/digitwallet/setDefault"),
					method:"POST",
					data:{
						id:id
					},
					header:{
						"content-type":"application/x-www-form-urlencoded"
					},
					success: (res) => {
						uni.hideLoading();
						if (res.data.code === 0) {
							this.getList()
						} else {
							this.message=res.data.msg
							this.$refs.toast.show() 
						}
					}
				});
			},
			deleteAddress(id){
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				uni.request({
					url: this.$httpUrl("/app/digitwallet/delete"),
					method:"POST",
					data:{
						id:id
					},
					header:{
						"content-type":"application/x-www-form-urlencoded"
					},
					success: (res) => {
						uni.hideLoading();
						if (res.data.code === 0) {
							this.getList()
						} else {
							this.message=res.data.msg
							this.$refs.toast.show() 
						}
					}
				});
			},
			getList(){
				uni.request({
					url: this.$httpUrl("/app/digitwallet/list"),
					method:"POST",
					data:{
						userId:getApp().globalData.userId
					},
					header:{
						"content-type":"application/x-www-form-urlencoded",
						token: getApp().globalData.token
					},
					success: (res) => {
						if (res.data.code === 0) {
							this.addressList=res.data.data
						} else {
							this.message=res.data.msg
							this.$refs.toast.show() 
						}
					}
				});
			},
			onImageError(key, index) {
				this[key][index].img = '/static/placeholder.png';
			}
		}
	}
</script>

<style lang='scss'>
	page{
		padding-bottom: 120rpx;
	}
	.content{
		position: relative;
	}
	.list{
		display: flex;
		align-items: center;
		padding: 20rpx 30rpx;;
		background: #fff;
		position: relative;
	}
	.wrap{background: #fafafa;}
	.wrapper{
		display: flex;
		flex-direction: column;
		flex: 1;
		
	}
	.address-box{
		display: flex;
		align-items: center;
		.tag{
			font-size: 24rpx;
			color: $base-color;
			margin-right: 10rpx;
			background: #fffafb;
			border: 1px solid #ffb4c7;
			border-radius: 4rpx;
			padding: 4rpx 10rpx;
			line-height: 1;
		}
		.address{
			font-size: 30rpx;
			color: $font-color-dark;
		}
	}
	.u-box{
		font-size: 28rpx;
		color: $font-color-light;
		margin-top: 16rpx;
		.name{
			margin-right: 30rpx;
		}
	}
	.icon-bianji{
		display: flex;
		align-items: center;
		height: 80rpx;
		font-size: 40rpx;
		color: $font-color-light;
		padding-left: 30rpx;
	}
	
	.add-btn{
		position: fixed;
		left: 30rpx;
		right: 30rpx;
		bottom: 16rpx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690rpx;
		height: 80rpx;
		font-size: 32rpx;
		color: #fff;
		background-color: $base-color;
		border-radius: 10rpx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);		
	}
</style>
