<template>
	
	<view class="view container wrap">
		<sub-nav title="设置">
		</sub-nav>
		<view class="list-cell b-b" @tap="isLogin('/pages/user/address')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">收货地址</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell" @tap="isLogin('/pages/user/digitalWallet')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">数字钱包</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell" @tap="isLogin('/pages/user/resetLoginPassword?title=重置登录密码')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">重置登录密码</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell" @tap="isLogin('/pages/user/resetLoginPassword?title=重置支付密码')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">重置支付密码</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<!-- <view class="list-cell" v-if="userId" @tap="needAuth" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">实名认证</text>
			<view class="status" v-if="status.idCardstatus==='0'">未认证</view>
			<view class="status" v-if="status.idCardstatus==='1'">待审核</view>
			<view class="status-pass"  v-if="status.idCardstatus==='2'">
			{{status.realName}}<image src="/static/ic_certified.png" class="img" mode=""></image></view>
			<view class="status" v-if="status.idCardstatus==='3'">未通过</view>
			<view class="status" v-if="status.idCardstatus==='4'">信息不完整</view>
			<text class="cell-more yticon icon-you" v-if="status.idCardstatus!=='2'"></text>
		</view> -->
		<view class="list-cell log-out-btn" v-if="userId" @tap="toLogout">
			<text class="cell-tit">退出登录</text>
		</view>
		<toast-model :message="message" verticalAlign="bottom" ref="toast" :duration="3000"></toast-model>
	</view>
</template>

<script>
	import {  
	    mapMutations  
	} from 'vuex';
	export default {
		data() {
			return {
				message:"",
				userId:getApp().globalData.userId,
				status:{
					idCard: "",
					idCardFront: "",
					idCardOverall: "",
					idCardReverse: "",
					idCardstatus: "",
					realName: "",
					reason: ""
				}
			};
		},
		onLoad() {
			this.getAuthentication()
		},
		methods:{
			needAuth(){
				if(this.status.idCardstatus==='1'){
					this.message="审核中..."
					this.$refs.toast.show()
				}else if(this.status.idCardstatus==2){
					
				}else{
				var obj=JSON.stringify(this.status)
				this.$toPage(`/pages/user/verified?obj=${obj}`)
				}
			},
			...mapMutations(['logout']),
			isLogin(url){
				if(this.userId){
					this.$toPage(url)
				}else{
					this.$toPage('/pages/user/login')
				}
			},
			getAuthentication(){
				if(this.userId){
				uni.request({
					url: this.$httpUrl("/app/identity/getAuthenticationResult"),
					data: {
						userId:getApp().globalData.userId
					},
					method:"POST",
					header:{
						"content-type":"application/x-www-form-urlencoded",
						token: getApp().globalData.token
					},
					success: (res) => {
						if (res.data.code === 0) {
							var data=res.data.data
							this.status=data
						} else {
							this.message=res.data.msg
							this.$refs.toast.show() 
						}
					}
				});
				}
			},
			//退出登录
			toLogout(){
				uni.showModal({
				    content: '确定要退出登录么',
				    success: (e)=>{
				    	if(e.confirm){
				    		this.logout();
							uni.switchTab({
							    url: '/pages/user/user'
							});
				    	}
				    }
				});
			},

		}
	}
</script>

<style lang='scss'>
	page{
		background: $page-color-base;
	}
	.list-cell{
		display:flex;
		align-items:baseline;
		padding: 20rpx $page-row-spacing;
		line-height:60rpx;
		position:relative;
		background: #fff;
		justify-content: center;
		&.log-out-btn{
			margin-top: 40rpx;
			.cell-tit{
				text-align: center;
				margin-right: 0;
			}
		}
		&.cell-hover{
			background:#fafafa;
		}
		&.b-b:after{
			left: 30rpx;
		}
		&.m-t{
			margin-top: 16rpx; 
		}
		.cell-more{
			align-self: baseline;
			font-size:$font-lg;
			color:$font-color-light;
			margin-left:10rpx;
		}
		.cell-tit{
			flex: 1;
			font-size: $font-base + 2rpx;
			color: $font-color-dark;
			margin-right:10rpx;
		}
		.cell-tip{
			font-size: $font-base;
			color: $font-color-light;
		}
		.status{color: #ff0000;}
		.status-pass{
			color: #999;display: flex;align-items: center;
			.img{width: 130rpx;margin-left: 20rpx;
			height: 44rpx;}
		}
	}
</style>
