<template>
	<view>
	<view class="my-score">
		<view class="navbar sub-nav">
			<image src="/static/ic_left@2x.png" @tap="back" class="back" mode=""></image>
			<view class="title">
				{{title}} 
			</view>
		</view>
		<view>
			<view class="number">{{balance}}</view>
			<view class="end-time" v-if="overTime">到期时间：{{overTime}}</view>
		</view>
	</view>
	
	<view class="list-base name-list">
		<!-- 本版本积分不开放 -->
		<view class="ul" v-if="type==1">
			<view class="li li1" @tap="$toPage(`/pages/user/pointTransform?title=转成（TC）币&coinType=1&accountType=1`)">
				<view class="title-wrap">
				<text class="text">转成币(TC)</text>
				</view>
				<view class="iconfont">&#xe603;</view>
			</view>
			<view class="li li1" @tap="$toPage(`/pages/user/pointTransform?title=转账&coinType=2&accountType=1`)">
				<view class="title-wrap">
				<text class="text">转账</text>
				</view>
				<view class="iconfont">&#xe603;</view>
			</view>
			<view class="li li1" @tap="$toPage('/pages/user/scoreDetail?accountType=1')">
				<view class="title-wrap">
				<text class="text">明细</text>
				</view>
				<view class="iconfont">&#xe603;</view>
			</view>
	</view>
	<view class="ul" v-if="type==2">
		<view class="li li1" @tap="$toPage('/pages/user/chargeCoin?chargeType=1')">
			<view class="title-wrap">
			<text class="text">充币</text>
			</view>
			<view class="iconfont">&#xe603;</view>
		</view>
		<view class="li li1" @tap="$toPage('/pages/user/withdrawCoin?withdrawType=1')">
			<view class="title-wrap">
			<text class="text">提币</text>
			</view>
			<view class="iconfont">&#xe603;</view>
		</view>
			<view class="li li1" @tap="$toPage(`/pages/user/coinTransform?title=转成积分（TC）&coinType=1`)">
				<view class="title-wrap">
				<text class="text">转成积分（TC）</text>
				</view>
				<view class="iconfont">&#xe603;</view>
			</view>
			<view class="li li1" @tap="$toPage(`/pages/user/coinTransform?title=转账&coinType=2&accountType=3`)">
				<view class="title-wrap">
				<text class="text">转账</text>
				</view>
				<view class="iconfont">&#xe603;</view>
			</view>
			<view class="li li1" @tap="$toPage('/pages/user/scoreDetail?accountType=3')">
				<view class="title-wrap">
				<text class="text">明细</text>
				</view>
				<view class="iconfont">&#xe603;</view>
			</view>
	</view>
	<view class="ul" v-if="type==3">
		<view class="li li1" @tap="$toPage('/pages/index/chargeCoin')">
			<view class="title-wrap">
			<text class="text">充值</text>
			</view>
			<view class="iconfont">&#xe603;</view>
		</view>
		<view class="li li1" @tap="$toPage('/pages/index/withdrawCoin')">
			<view class="title-wrap">
			<text class="text">提现</text>
			</view>
			<view class="iconfont">&#xe603;</view>
		</view>
			<view class="li li1" @tap="$toPage('/pages/user/scoreDetail?accountType=4')">
				<view class="title-wrap">
				<text class="text">明细</text>
				</view>
				<view class="iconfont">&#xe603;</view>
			</view>
	</view>
	<view class="ul" v-if="type==4">
		<view class="li li1" @tap="$toPage('/pages/deposit/scoreInterestDetail?pid='+pid)">
			<view class="title-wrap">
			<text class="text">当前定存积分利息</text>
			</view>
			<view :style="{display:'flex'}">
				<view :style="{position:'relative',top:'4rpx'}">{{fixedInterest}}</view>
			<view class="iconfont">&#xe603;</view>
			</view>
		</view>
			<view class="li li1" @tap="$toPage(`/pages/user/TransferIntoInterest?title=转入生息&coinType=1`)">
				<view class="title-wrap">
				<text class="text">转入生息</text>
				</view>
				<view class="iconfont">&#xe603;</view>
			</view>
			<view class="li li1" @tap="$toPage(`/pages/deposit/transferOut`)">
				<view class="title-wrap">
				<text class="text">转出</text>
				</view>
				<view class="iconfont">&#xe603;</view>
			</view>
			<view class="li li1" @tap="$toPage('/pages/deposit/scoreDetail')">
				<view class="title-wrap">
				<text class="text">明细</text>
				</view>
				<view class="iconfont">&#xe603;</view>
			</view>
	</view>
	<view class="ul" v-if="type==5">
		<view class="li li1" @tap="$toPage('/pages/user/chargeCoin?chargeType=2')">
			<view class="title-wrap">
			<text class="text">充币</text>
			</view>
			<view class="iconfont">&#xe603;</view>
		</view>
		<view class="li li1" @tap="$toPage('/pages/user/withdrawCoin?withdrawType=2')">
			<view class="title-wrap">
			<text class="text">提币</text>
			</view>
			<view class="iconfont">&#xe603;</view>
		</view>
			<view class="li li1" @tap="$toPage(`/pages/user/coinTransform?title=转账&coinType=2&accountType=5`)">
				<view class="title-wrap">
				<text class="text">转账</text>
				</view>
				<view class="iconfont">&#xe603;</view>
			</view>
			<view class="li li1" @tap="$toPage('/pages/user/scoreDetail?accountType=5')">
				<view class="title-wrap">
				<text class="text">明细</text>
				</view>
				<view class="iconfont">&#xe603;</view>
			</view>
	</view>
	<view class="ul" v-if="type==6">
			<view class="li li1" @tap="$toPage('/pages/user/scoreDetail?accountType=6')">
				<view class="title-wrap">
				<text class="text">明细</text>
				</view>
				<view class="iconfont">&#xe603;</view>
			</view>
	</view>
	<view class="ul" v-if="type==7">
		<view class="li li1" @tap="$toPage('/pages/player/scoreInterestDetail?pid='+pid)">
			<view class="title-wrap">
			<text class="text">当前玩家合约利息</text>
			</view>
			<view :style="{display:'flex'}">
				<view :style="{position:'relative',top:'4rpx'}">{{fixedInterest}}</view>
			<view class="iconfont">&#xe603;</view>
			</view>
		</view>
			<view class="li li1" @tap="$toPage(`/pages/player/TransferIntoInterest?title=转入生息&coinType=1`)">
				<view class="title-wrap">
				<text class="text">转入生息</text>
				</view>
				<view class="iconfont">&#xe603;</view>
			</view>
			<view class="li li1" @tap="$toPage(`/pages/player/transferOut`)">
				<view class="title-wrap">
				<text class="text">转出</text>
				</view>
				<view class="iconfont">&#xe603;</view>
			</view>
			<view class="li li1" @tap="$toPage('/pages/player/scoreDetail')">
				<view class="title-wrap">
				<text class="text">明细</text>
				</view>
				<view class="iconfont">&#xe603;</view>
			</view>
	</view>
	</view>
	<toast-model :message="message" verticalAlign="bottom" ref="toast" :duration="3000"></toast-model>
	<toast-model :message="message1" verticalAlign="bottom" ref="toast1" :duration="3000"></toast-model>
	</view>
</template>

<script>
	import { mapState,mapMutations } from 'vuex';  
	export default {
		data() {
			return {
				overTime:"",
				message:"",
				message1:"",
				type:"",
				title:"",
				userNumber:"",
				balance:"",
				fixedInterest:"",
				pid:""
			}
		},
		onLoad(option){
			this.title=option.title
			this.type=option.type //type 1.TC积分 2.TC币 3.TB币 4.定存积分
			this.userNumber=option.userNumber
		},
		onShow() {
			if(this.type==7){
				this.getDeposits()
			}else if(this.type!=4){
				this.getUserInfo()
			}else{
				this.getDeposit()
			}
			if(this.showToastInInit){
				this.hideToastInfo()
				this.message1=this.toastInfo;
				setTimeout(this.$refs.toast1.show,200)
			}
		},
		computed: {
			...mapState(['hasLogin','userInfo','showToastInInit','toastInfo'])
		},
		methods: {
			...mapMutations(['login','hideToastInfo']),
			getDeposits(){
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
			getDeposit(){
				uni.request({
					url: this.$httpUrl("/app/about/holdthecode/deposit/index"),
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
			stayTuned(){
				this.message="敬请期待"
				this.$refs.toast.show();
			},
			show(){
				this.$refs.toast.show()
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
							this.login(data)
							var balance
							if(this.type==1){
								balance=data.lovebirdPoint.toFixed(2)
							}else if(this.type==2){
								balance=data.lovebirdAccount.toFixed(2)
							}else if(this.type==3){
								balance=data.LBAccount.toFixed(2)
								
							}else if(this.type==4){
								balance=data.lovebirdPointFreeze.toFixed(2)
							}else if(this.type==5){
								balance=data.tbCurrencyNum.toFixed(2)
							}else if(this.type==6){
								balance=data.tpCurrencyNum.toFixed(2)
							}
							this.balance=balance
						} else {
							this.message=res.data.msg
							this.$refs.toast.show() 
						}
					}
				});
			},
			back(){
				//#ifdef H5
					window.history.go(-1)
				//#endif
				//#ifdef APP-PLUS
					uni.navigateBack()
				//#endif
			}
		}
	}
</script>

<style lang="scss">
	.navbar{
		background: transparent;
		.xi{font-size: 24rpx;}
	}
	.my-score{background: linear-gradient(318deg,rgba(0,105,52,1) 0%,rgba(34,172,56,1) 100%);height: 364rpx;position: relative;
	padding-top: 138rpx;color: #fff;
		text-align: center;
	.number{
		font-size: 70rpx;
	}
	.text{font-size: 28rpx;margin-top: 24rpx;}
	.end-time{position: absolute;bottom: 0;left: 0;width: 100%;padding: 0 20rpx;font-size: 28rpx;background:rgba(245,245,245,.1);height: 88rpx;display: flex;align-items: center;
}
	}
	
</style>
