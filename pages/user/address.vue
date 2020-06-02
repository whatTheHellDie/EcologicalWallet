<template>
	<view class="content b-t wrap">
		<sub-nav title="收货地址">
			<view class="text" @tap="$toPage('/pages/user/addressManage')">添加</view>
		</sub-nav>
		<view class="no-data" v-if="addressList.length==0&&finish">
			<image src="/static/no-data.png" class="img" mode=""></image>
			<view class="view">暂无数据!</view>
		</view>
		<view class="address-list">
			<view class="ul">
				<view class="li" v-for="item in addressList" @tap="isFrom(item)">
					<view class="content">
						<view class="radius">{{item.receiver[0]}}</view>
					<view class="item">
							<view class="name">{{item.receiver}}<text class="number">{{item.phone}}</text></view>
							<view class="address">{{item.provinceName}}{{item.cityName}}{{item.districtName}}{{item.address}}</view>
					</view>
					</view>
					<view class="default">
						<view class="left" @tap="setDefault(item.id)">
						<image :src="item.isDefault?'/static/ic_selected@2x.png':'/static/ic_not-selected@2x.png'" class="img" mode=""></image>
						<text>默认地址</text>
						</view>
						<view class="right space-between">
							<view class="btn-default" @tap="editAddress(item)">编辑</view>
							<view class="btn-default" @tap="deleteAddress(item.id)">删除</view>
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
				message:"",
				finish:false,
				source: 0,
				addressList: [],
				from:""
			}
		},
		onLoad(option){
			this.from=option.from
			this.getAddressList()
		},
		onShow(){
			this.getAddressList()
			if(this.showToastInInit){
				this.hideToastInfo()
				this.message=this.toastInfo;
				setTimeout(this.$refs.toast.show,200)
			}
		},
		computed: {
			...mapState(['hasLogin','userInfo','showToastInInit','toastInfo'])
		},
		methods: {
			...mapMutations(['addUserAddress','hideToastInfo']),
			isFrom(obj){
				if(this.from){
					this.addUserAddress(obj)
					setTimeout(this.$back,200)
				}
			},
			editAddress(obj){
				obj.receiptMan=obj.receiver;
				var editObj=JSON.stringify(obj)
				this.$toPage(`/pages/user/addressManage?obj=${editObj}`)
			},
			deleteAddress(id){
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				uni.request({
					url: this.$httpUrl("/app/shippingAddr/delete"),
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
							this.getAddressList()
						} else {
							this.message=res.data.msg
							this.$refs.toast.show() 
						}
					}
				});
			},
			setDefault(id){
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				uni.request({
					url: this.$httpUrl("/app/shippingAddr/setDefault"),
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
							this.getAddressList()
						} else {
							this.message=res.data.msg
							this.$refs.toast.show() 
						}
					}
				});
			},
			getAddressList(){
				uni.request({
					url: this.$httpUrl("/app/shippingAddr/list"),
					data: {
						userId:this.userInfo.id,
					},
					method:"POST",
					header:{
						"content-type":"application/x-www-form-urlencoded",
						token: getApp().globalData.token
					},
					success: (res) => {
						if (res.data.code === 0) {
							var data=res.data.data;
							this.addressList=data
							this.finish=true
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

<style lang='scss'>
	page{
		background: #fafafa;
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
