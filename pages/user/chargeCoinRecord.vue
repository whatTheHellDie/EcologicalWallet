<template>
	<view class="wrap">
		<sub-nav title="充币记录"></sub-nav>
		<view class="order-detail-choose">
			<view class="ul">
				<view class="li" v-for="(item, i) in orderStatus" @tap="toStatus(i)" :class="{ active: status == i }">{{ item }}</view>
			</view>
		</view>
		<view class="no-data" v-if="confirmList.length == 0 && finish">
			<image src="/static/no-data.png" class="img" mode=""></image>
			<view class="view">您还没有相关的订单</view>
		</view>
		<view class="comfirm-list order-detail-list my-order-list">
			<view class="ul">
				<view class="li" v-for="item in confirmList" v-if="confirmList.length > 0">
					<view class="title">
						编号：
						<text class="from">{{ item.serialNumber }}</text>
						<text class="status red" v-if="item.status == '系统不受理 '">{{ item.status }}</text>
						<text class="status" v-else>{{ item.status }}</text>
					</view>
					<view class="info">
						<view>交易号</view>
						<view class="gray">{{ item.imSerialNumber }}</view>
					</view>
					<view class="info">
						<view>充值金额</view>
						<view class="gray">{{ item.chargeAmount }}</view>
					</view>
					<view class="info">
						<view>到账金额</view>
						<view class="gray">{{ item.gotAmount }}</view>
					</view>
					<view class="info">
						<view>账户类型</view>
						<view class="gray">{{ item.accountType }}</view>
					</view>
					<view class="info">
						<view>充值时间</view>
						<view class="gray">{{ item.createTime }}</view>
					</view>
					<view class="info">
						<view class="pin">
							<text>凭</text>
							<text>证</text>
						</view>
						<view><image class="user-img" :src="item.proofUrl" mode=""></image></view>
					</view>
					<view class="not-wrap" v-if="item.status == '系统不受理 '">
						<view class="again-btn-wrap"><view class="again-btn btn-default" @click="submitAgain(item)">再次提交</view></view>
						<view class="reason">不受理原因：{{ item.reason }}</view>
					</view>
				</view>
			</view>
		</view>
		<toast-model :message="message" verticalAlign="bottom" ref="toast" @confirm="confirmCancel" :duration="3000"></toast-model>
	</view>
</template>

<script>
import md5 from '../../utils/md5';
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			confirmList: [],
			addressData: [],
			message: '',
			finish: false,
			orderStatus: ['全部', '待处理', '已完成', '不受理'],
			searchStatus: '',
			status: null,
			confirmList: [],
			chargeType:""
		};
	},
	onLoad(option) {
		this.chargeType=option.chargeType;
		this.queryStatus(option.status);
	},
	methods: {
		submitAgain(obj){
			let item=JSON.stringify(obj)
			console.log(obj)
			uni.redirectTo({
				url: '/pages/user/chargeCoin?obj='+item+"&chargeType="+this.chargeType
			});
		},
		toStatus(i) {
			uni.redirectTo({
				url: `/pages/user/chargeCoinRecord?status=${i}`+"&chargeType="+this.chargeType
			});
		},
		getData(status) {
			uni.request({
				url: this.$httpUrl('/app/about/capital/chargeOptimizeList'),
				data: {
					userId: getApp().globalData.userId,
					pageNum: 1,
					pageSize: 20,
					status: this.searchStatus,
					type:this.chargeType==="1"?3:5,//3为TC，5为TB
					p4: '1.0.3'
				},
				method: 'POST',
				header: {
					'content-type': 'application/x-www-form-urlencoded',
					token: getApp().globalData.token
				},
				success: res => {
					if (res.data.code === 0) {
						var data = res.data.data;
						this.confirmList = data;
					} else {
						this.message = res.data.msg;
						this.$refs.toast.show();
					}
				}
			});
		},
		queryStatus(i) {
			this.status = i;
			if (i == 0) {
				this.searchStatus = 100;
			} else {
				this.searchStatus = i;
			}
			this.finish = false;
			this.confirmList = [];
			this.getData(this.searchStatus);
		}
	}
};
</script>

<style lang="scss">
.order-detail-choose {
	z-index: 1;
	position: fixed;
	width: 100%;
	.ul {
		display: flex;
		justify-content: space-around;
		background: #fff;
		line-height: 88rpx;
	}
	.li {
		text-align: center;
		border-bottom: 2px solid #fff;
		font-size: 28rpx;
	}
	.li.active {
		color: $font-color-spec;
		font-size: 32rpx;
		font-weight: 800;
	}
}
.comfirm-list {
	.status {
		color: $font-color-spec;
		float: right;
		&.red {
			color: #f21d1d;
		}
	}
	margin-top: 20rpx;
	padding: 20rpx 36rpx 34rpx;
	.li {
		background: #fff;
	}
	.sign {
		vertical-align: middle;
		margin-right: 18rpx;
		width: 53rpx;
		height: 46rpx;
		background: #000;
	}
	.content {
		border-top: 1px solid #eee;
		border-bottom: 1px solid #eee;
		background: #faf9fe;
		display: flex;
		margin: 20rpx -36rpx;
		padding: 20rpx 36rpx;
	}
	.name {
		margin-top: 14rpx;
		position: relative;
		display: flex;
		justify-content: space-between;
		font-size: 32rpx;
		overflow-x: hidden;
		overflow-y: visible;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.number {
		position: absolute;
		right: 0;
		top: 26rpx;
		font-size: 28rpx;
	}
	.coin {
		width: 44rpx;
		height: 44rpx;
		margin-right: 8rpx;
	}
	.right {
		width: 496rpx;
		position: relative;
	}
}
.my-order-list {
	background: transparent;
	padding: 0;
	margin-top: 112rpx;
	.li {
		background: #fff;
		margin: 0 auto 20rpx;
		padding: 20rpx 0 0;
	}
	.title {
		padding: 0 20rpx 20rpx;
		font-weight: 800;
		font-size: 28rpx;
		border-bottom: 1px solid $border-color-base;
		margin-bottom: 10rpx;
	}
	.content {
		margin: 20rpx 0;
	}
	.total {
		margin: 0 20rpx;
		padding-top: 0;
		padding-bottom: 20rpx;
	}
	.info {
		display: flex;
		justify-content: space-between;
		padding: 10rpx 20rpx;
	}
	.gray {
		color: #666;
	}
	.pin {
		display: flex;
		justify-content: space-between;
		width: 110rpx;
	}
	.user-img {
		width: 544rpx;
		height: 288rpx;
		background: #f1f1f1;
	}
	.not-wrap{margin: 0 20rpx;padding-bottom: 20rpx;}
	.again-btn-wrap {
		display: flex;
		justify-content: flex-end;
	}
	.again-btn {
		margin-top: 36rpx;
		width: 180rpx;
		height: 80rpx;
		border-radius: 80rpx;
		background: $font-color-spec;
		color: #fff;
		font-size: 28rpx;
	}
	.reason{color: #ff0000;}
}
</style>
