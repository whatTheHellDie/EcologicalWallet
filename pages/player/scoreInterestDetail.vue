<template>
	<view>
	<view class="my-score">
		<view class="navbar sub-nav">
			<image src="/static/ic_left@2x.png" @tap="$back" class="back" mode=""></image>
			<view class="title">
				{{title}} 
			</view>
		</view>
		<view>
			<view class="deposit-text">玩家合约利息（TC）</view>
			<view class="number">{{balance}}</view>
			<view class="end-time"><image class="end-img" src="/static/ic_mark@2x.png" mode=""></image>未到期转出，则利息按活期TC积分日利率计算！</view>
		</view>
	</view>
	<view class="deposit-list">
		<view class="li" v-for="item in records">
			<view class="title">
				利息<view>{{item.amount>0?item.amount:"0.00"}}</view>
			</view>
			<view class="time">{{item.createTime}}</view>
		</view>
	</view>
	<view class="no-data" v-if="noData">
		<image src="/static/no-data.png" class="img" mode=""></image>
		<view class="view">暂无记录</view>
	</view>
	<view class="no-more-data loading" v-if="loadingPage">加载中...</view>
	<view class="no-more-data" v-if="noMoreData">没有更多数据了~</view>
	<toast-model :message="message" verticalAlign="bottom" ref="toast" :duration="3000"></toast-model>
	</view>
</template>

<script>
	import { mapState,mapMutations } from 'vuex';  
	export default {
		data() {
			return {
				loadingPage:false,
				overTime:"",
				message:"",
				type:"",
				title:"玩家合约利息明细",
				userNumber:"",
				balance:"",
				fixedInterest:"",
				records:[],
				pageNum:1,
				noData:false,
				noMoreData:false,
			}
		},
		computed: {
			...mapState(['hasLogin','userInfo','showToastInInit','toastInfo'])
		},
		onLoad(option) {
			this.pid=option.pid
			this.getDetail()
		},
		onReachBottom(){
			if(!this.noMoreData&&!this.noData){
				this.loadingPage=true;
				this.pageNum+=1;
				this.getDetail()
			}
		},
		methods: {
			...mapMutations(['login','hideToastInfo']),
			getDetail(){
				uni.request({
					url: this.$httpUrl("/app/about/holdthecode/hcDepositInterests/getCurrentDetails"),
					data: {
						pid:this.pid,
						pageIndex:this.pageNum,
						pageSize:20
					},
					method:"POST",
					header:{
						"content-type":"application/x-www-form-urlencoded"
					},
					success: (res) => {
						if (res.data.code === 0) {
							var data=res.data.data.pageInfo
							this.balance=data.total.toFixed(2)
							this.loadingPage=false
							if(data.page===1&&data.records==0){
								this.noData=true
							}
							if(data.records.length<20&&!this.noData){
								this.noMoreData=true
							}
							data.records.forEach((item,i)=>{
								this.records.push(item)
							})
						} else {
							this.message=res.data.msg
							this.$refs.toast.show() 
						}
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	.navbar{
		background: transparent;
		.xi{font-size: 24rpx;}
	}
	.my-score{background: linear-gradient(318deg,rgba(0,105,52,1) 0%,rgba(34,172,56,1) 100%);height: 364rpx;position: relative;
	padding-top: 124rpx;color: #fff;
	.number{
		font-size: 60rpx;padding: 0 20rpx;
	}
	.deposit-text{font-size: 24rpx;padding: 0 20rpx;}
	.text{font-size: 28rpx;margin-top: 24rpx;}
	.end-img{width: 36rpx;height: 36rpx;vertical-align: -4rpx;margin-right: 20rpx;}
	.end-time{position: absolute;bottom: 0;left: 0;width: 100%;padding: 0 20rpx;font-size: 26rpx;background:rgba(245,245,245,.1);height: 88rpx;display: flex;align-items: center;
}
	}
	.deposit-list{
		.li{padding: 20rpx 32rpx;border-bottom: 1px solid #f0f0f0;}
		.title{display: flex;justify-content: space-between; font-size: 32rpx;font-weight: 800;margin-bottom: 10rpx;}
		.time{font-size: 24rpx;}
	}
	
</style>
