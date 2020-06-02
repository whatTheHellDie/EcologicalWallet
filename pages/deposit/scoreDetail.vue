<template>
	<view class="wrap">
		<sub-nav title="明细">
		</sub-nav>
		<view class="context-shadow" v-if="seeShowList&&start" @tap="seeShowList=false"></view>
		<view class="choose-list">
			<view v-for="item,i in chooseList" :class="{active:index===i,left:i==0,right:i==2}" @tap="activeEvent(i)" class="li btn-default">
				{{item.name}}
			</view>
			<view v-for="item,itemIndex in showList" :class="{active:index===itemIndex&&seeShowList}"  class="show-list">
				<view class="ul1">
					<view class="li1"  v-for="itemx,itemxIndex in item" :class="{active:showIndex[itemIndex].activeIndex===itemxIndex}" @tap="activeWay(itemIndex,itemxIndex,itemx.type,itemIndex)">
						{{itemx.name}}
					</view>
				</view>
			</view>
		</view>
		<view class="score-wrap">
			<view class="left">
				<view class="title" v-if="accountType==1">积分（TC）:</view>
				<div class="number">{{account?account.toFixed(2):"0.00"}}</div>
			</view>
		</view>
		<view class="detail-list">
			<view class="ul" v-if="!noData">
				<view class="li" v-for="item in detailList">
					<view class="name">{{item.flowType==1?"收入":"支出"}}<text class="text  active">{{item.amount?item.amount.toFixed(2):""}}</text></view>
					<view class="name">余额<text class="text">{{item.oldAmount?item.oldAmount.toFixed(2):"0.00"}}</text></view>
					<view class="name">摘要<text class="text">{{item.digest}}</text></view>
					<view class="name">交易时间<text class="text">{{item.createTime}}</text></view>
					<view class="name">记账日<text class="text">{{item.createDate}}</text></view>
					<view class="name">交易地点/附言<text class="text">{{item.remark}}</text></view>
				</view>
			</view>
		</view>
		<view class="no-data" v-if="noData">
			<image src="/static/no-data.png" class="img" mode=""></image>
			<view class="view">您还没有相关的订单</view>
		</view>
		<view class="no-more-data loading" v-if="loadingPage">加载中...</view>
		<view class="no-more-data" v-if="noMoreData">没有更多数据了~</view>
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
				loadingPage:false,
				pageNum:1,
				noData:false,
				noMoreData:false,
				freezeAccount:"",
				account:"",
				flowType:0,//收支类型;0:全部 1:收入; 2：支出	
				message:"",
				sort:1,// 0:由远及近 ；1:由近及远
				dateInterval:6,//时间	1:当天, 2:7天 , 3:一个月,4:三个月,5:六个月,6：全部
				accountType:"",//账户类型;1:TreeBank积分, 2:LB积分, 3:TreeBank， 4:LB,
				detailList:[],
				start:false,
				index:null,
				showIndex:[{activeIndex:null},{activeIndex:null},{activeIndex:null}],
				chooseList:[{name:"时间"},{name:"收支"},{name:"排序"},],
				seeShowList:true,
				showList:[
					[{name:"全部",type:6},{name:"当天",type:1},
					{name:"7天",type:2},{name:"一个月",type:3},
					{name:"三个月",type:4},{name:"六个月",type:5}],
					[{name:"全部",type:0},{name:"收入",type:1},{name:"支出",type:2}],
					[{name:"由近至远",type:1},{name:"由远至近",type:0}],
					]
			}
		},
		onLoad(option){
			this.accountType=1;
			this.getDetail()
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		onReachBottom(){
			if(!this.noMoreData&&!this.noData){
				this.loadingPage=true;
				this.pageNum+=1;
				this.getDetail()
			}
		},
		methods: {
			getDateIntervalInfo(type,i){
				if(i==0){
					this.dateInterval=type;
					
				}else if(i==1){
					this.flowType=type
				}else if(i==2){
					this.sort=type
				}
				this.noData=false;
				this.noMoreData=false;
				this.pageNum=1;
				this.detailList=[]
				this.getDetail()
			},
			getDetail() {
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				//明细
				uni.request({
					url: this.$httpUrl("/app/about/holdthecode/depositRecord/depositDetail"),
					data: {
						userId: this.userInfo.id,
						accountType: this.accountType,
						dateInterval: this.dateInterval,
						sort: this.sort,
						flowType:this.flowType,
						pageSize:20,
						pageNum:this.pageNum,
						version:1
					},
					method: "POST",
					header: {
						"content-type": "application/x-www-form-urlencoded",
						"token":getApp().globalData.token
					},
					success: (res) => {
						uni.hideLoading();
						if (res.data.code === '0') {
							var data=res.data.data;
							if(this.pageNum===1&&data.financeList==0){
								this.noData=true
							}
							this.loadingPage=false
							if(data.financeList.length<20&&!this.noData){
								this.noMoreData=true
							}
							data.financeList.forEach((item,i)=>{
								this.detailList.push(item)
							})
							this.account=data.account;
						} else {
							this.message = res.data.msg;
							this.$refs.toast.show()
						}
					}
				});
			},
			activeWay(itemIndex,itemxIndex,type,i){
				this.showIndex[itemIndex].activeIndex=itemxIndex;
				this.seeShowList=false;
				this.getDateIntervalInfo(type,i)
			},
			activeEvent(i){
				this.start=true
				if(this.index===i){
					// this.index=null;
					this.seeShowList=!this.seeShowList;
					this.index=i;
					return ;
				}else{
					this.seeShowList=true;
					this.index=i;
				}
				
			}
		}
	}
</script>

<style lang="scss">
	page{
	}
	
	.choose-list{
		position: fixed;
		top: 88rpx;left: 0;width: 100%;
		display: flex;
		z-index: 999;
		background: #fff;
		border-bottom: 1px solid $border-color-base;
		.li{height: 96rpx;flex: 1;font-size: 32rpx;
		&:after{
			content: '';
			width: 32rpx;height: 32rpx;
			display: flex;
			background-image: url(/static/ic_down@2x.png);
			background-size: cover;
		}
		&.active{
			color: $font-color-spec;
			&:after{
				background-image: url(/static/ic_up_violet@2x.png);
			}
		}
		}
		.show-list{
			background: #fff;
			position: absolute;
			top: 96rpx;
			width: 100%;
				display: none;
				&.active{display: block;}
			.li1{height: 90rpx;
			display: flex;
			align-items: center;
			padding: 0 48rpx;
			font-size: 32rpx;
			justify-content: space-between;
			&.left{
				justify-content: flex-start;
			}
			&.right{justify-content: flex-end;}
			&.active{color: #006934;
			&:after{
				content: '';
				background-image: url(/static/ic_ture_violet@2x.png);
				display: block;
				-webkit-background-size: cover;
				background-size: cover;
				width: 48rpx;
				height: 48rpx;
			}
			}
			}
		}
	}
	.score-wrap{
		padding: 0 0 20rpx;
		    margin-bottom: 20rpx;
		    background-color: #fff;
		    position: fixed;
		    top: 186rpx;
		    left: 0;
			width: 100%;
			display: flex;
			.left{width: 50%;padding-left: 20rpx;
			&.active{
				border-left: 1px solid $border-color-base;
			}
			}
		.title{padding-top: 22rpx;}
		.number{font-size: 40rpx;margin-top: 10rpx;}
	}
	.detail-list{
		padding-top: 264rpx;
		.li{
			margin-bottom: 20rpx;
			padding: 20rpx 32rpx;
			background-color: #fff;
		}
		.name{color: #999;display: flex;margin-bottom: 20rpx;
		justify-content: space-between;
		
		}
		.text{color: #585858;    width: 354rpx;
    text-align: right;
	&.active{
		color: $font-color-spec;
	}
	}
	}
</style>
