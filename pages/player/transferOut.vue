<template>
	<view class="wrap-content wrap">
		<sub-nav title="转出">
		</sub-nav>
		<view>
			<view class="info-tip"><image class="mark-img" src="/static/ic_mark2@2x.png" mode=""></image>未到期转出，则利息按活期TC积分日利率计算！</view>
		<view class="row b-b into-interest">
			<text class="tit">转出数额：</text>
			<view class="interest-input">{{balance}}</view>
			<view class="balance">合约账户余额: {{balance}}</view>
		</view>
		<view class="row b-b">
			<text class="tit">到期时间</text>
			<view class="input">{{overTime}}</view>
		</view>
		<view class="row b-b">
			<text class="tit">支付密码</text>
			<input class="input" type="password" v-model="password" placeholder="请输入支付密码" placeholder-class="placeholder" />
		</view>
		</view>
		<view class="add-btn" @tap="confirm">立即转出</view>
		<toast-model :message="message" verticalAlign="bottom" ref="toast" :duration="3000"></toast-model>
	</view>
</template>

<script>
	import { mapState,mapMutations } from 'vuex';  
	export default {
		data() {
			return {
				message:"",
				title:"",
				result:'',
				index:null,
				scoreNumber:"",
				overTime:"",
				password:"",
				balance:"",
			}
		},
		onLoad(option){
			this.getDeposit()
			this.getDetail()
		},
		computed: {
			...mapState(['hasLogin','userInfo','showToastInInit','toastInfo'])
		},
		methods: {
			...mapMutations(['login','hideToastInfo','addToastInfo']),
			getDeposit(){
				uni.request({
					url: this.$httpUrl("/app/about/holdthecode/deposits/index"),
					data: {
						userId:this.userInfo.id
					},
					method:"POST",
					header:{
						"content-type":"application/x-www-form-urlencoded",
						token: getApp().globalData.token
					},
					success: (res) => {
						if (res.data.code === '0') {
							var data=res.data.data
							this.balance=data.amount.toFixed(2)
							this.overTime=data.overTime;
							this.pid=data.id
							this.fixedInterest=data.fixedInterest.toFixed(2)
						} else {
							this.message=res.data.msg
							this.$refs.toast.show() 
						}
					}
				});
			},
			confirm(){
				uni.request({
					url: this.$httpUrl("/app/about/holdthecode/deposits/out"),
					data: {
						userId:getApp().globalData.userId,
						password:this.password,
					},
					method:"POST",
					header:{
						"content-type":"application/x-www-form-urlencoded",
						"token":getApp().globalData.token
					},
					success: (res) => {
						if (res.data.code === '0') {
							var data=res.data.data
							this.addToastInfo("转出成功")
							this.$back()
						} else {
							this.message=res.data.msg
							this.$refs.toast.show() 
						}
					}
				});
			},
			getDetail(){
				uni.request({
					url: this.$httpUrl("/app/about/holdthecode/deposits/listTerm"),
					data: {
						username:this.userInfo.userNumber
					},
					method:"POST",
					header:{
						"content-type":"application/x-www-form-urlencoded"
					},
					success: (res) => {
						if (res.data.code === '0') {
							var data=res.data.data
							this.overTime=data[0].overTime
						} else {
							this.message=res.data.msg
							this.$refs.toast.show() 
						}
					}
				});
			},
			
			bindPickerChange: function(e) {
			            this.index = e.target.value
			        },
			toggleTab(){
				this.$refs['region'].show();
			},
			onConfirm(val){
				this.result=val.result
				//如果页面需要调用多个mode类型，可以根据mode处理结果渲染到哪里;
			},
			switchChange(e){
				this.addressData.default = e.detail;
			},
			
		}
	}
</script>

<style lang="scss">
	page{
		background: $page-color-base;
		padding-top: 16rpx;
	}
	.info-tip{
		min-height:80rpx;
		color: #006934;
		background:#d7e4e8;font-size: 26rpx;display: flex;align-items: center;
		.mark-img{width: 36rpx;height: 36rpx;margin: 0 20rpx 0 32rpx;vertical-align: top;}
	}
	
	.wrap-content{
		position: absolute;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		top: 0;left: 0;
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
			align-items: center;
			display: flex;
			justify-content: flex-end;
			text-align: right;
		}
		.picker{
			padding-right: 60rpx;
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
		width: 100%;
		height: 80rpx;
		font-size: $font-lg;
		color: #fff;
		background:$font-color-spec;
		border-radius: 0;
		position: fixed;
		bottom: 0;left: 0;width: 100%;
	}
	.textarea{width: 100%;height: 100%;padding-top: 10rpx;}
	.iconfont{    font-size: 54rpx;
    color: #8C8C8C;
    position: absolute;
    top: 28rpx;
    right: 8rpx;pointer-events: none;}
	.spec{text-align: right;flex: 1;
	.fee{color: $font-color-spec;font-size: 24rpx;}
		
	}
	.into-interest{
		margin-bottom: 20rpx;
			display: block;padding-bottom: 10rpx;
			height: auto;
			.tit{width: 100%;padding-top: 32rpx;}
			.interest-input{
				margin: 20rpx 0;font-size: 60rpx;
			}
			.balance{color: $font-color-spec;}
		}
</style>
