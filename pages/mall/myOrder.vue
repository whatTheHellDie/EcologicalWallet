<template>
	<view class="wrap">
		<mall-nav title="我的订单"> </mall-nav>
		<view class="order-detail-choose">
			<view class="ul">
				<view class="li" v-for="item,i in orderStatus" @tap="toStatus(i)" :class="{active:status==i}">{{item}}</view>
			</view>
		</view>
		<view class="no-data" v-if="confirmList.length==0&&finish">
			<image src="/static/no-data.png" class="img" mode=""></image>
			<view class="view">您还没有相关的订单</view>
		</view>
		<view class="comfirm-list order-detail-list my-order-list">
			<view class="ul">
				<view class="li" v-for="item in confirmList" v-if="confirmList.length>0" @tap="toOrderDetail(item.orderId)">
					<view class="title"><img :src="item.brandImgUrl" class="sign" alt="" /><text class="from">{{item.brandName}}</text>
						<text class="status" v-if="item.status==0">待付款</text>
						<text class="status" v-if="item.status==1">待发货</text>
						<text class="status" v-if="item.status==2">待收货</text>
						<text class="status" v-if="item.status==3">交易成功</text>
						<text class="status" v-if="item.status==4">交易完成</text>
						<text class="status" v-if="item.status==5">交易关闭</text>
						<text class="status" v-if="item.status==7">商品已退款</text>
					</view>
					<view class="content" v-for="itemx in item.productList">
						<img :src="itemx.goodsImgUrl" class="pic" alt="" />
						<view class="right">
							<view class="name">{{itemx.goodsName}}</view>
							<view class="type">{{itemx.nameA}} <text class="number">x{{item.buySum}}</text></view>
							<view class="type" v-if="itemx.nameB">{{itemx.nameB}}</view>
							<view class="price">
								<image :src="item.currencyImg" alt="" class="coin" />{{itemx.price?itemx.price.toFixed(2):0.00}}</view>
						</view>
					</view>
					<view class="total"><text class="ji">合计：<text class="sub">{{item.payPrice}}{{item.currencyName}}</text></text></view>
					<view class="need-pay" v-if="item.status!=1">
						<view class="btn-default cancel" @tap.stop="cancelOrder(item.orderId)" v-if="item.status==0">取消订单</view>
						<view class="btn-default pay" @tap.stop="payOrder(item.orderId,item.payPrice,item.currency,item.currencyName)" v-if="item.status==0">付款</view>
						<view class="btn-default cancel" @tap.stop="confirmOrder(item.orderId)" v-if="item.status==2">确认收货</view>
						<view class="btn-default cancel" @tap.stop="deleteOrder(item.orderId)" v-if="item.status==3||item.status==4||item.status==5||item.status==7">删除订单</view>
					</view>
				</view>
			</view>
		</view>
		<view class="context-shadow" v-if="server1||transform" @tap="hideChosen"></view>
		<view class="pei user-confirm user-confirm1 clearfix" :class="{active:server1}">
			<view class="name">
				请输入支付密码
				<image src="/static/ic_wrong.png" alt="" @tap="hideChosen" class="close" />
			</view>
			<view class="balance">
				{{sub}}  {{currencyName}}币
			</view>
			<view class="relative">
				<input type="password" v-model="password" class="password" placeholder="请输入支付密码" />
			</view>
			<view class="forget" @tap="$toPage('/pages/user/resetLoginPassword?title=重置支付密码')">忘记密码？</view>
			<view class="confirm" @tap="useCoin">确认</view>
		</view>
		<view class="pei user-confirm user-confirm1 user-tranform clearfix" :class="{active:transform}">
			<view class="message">
				{{transformMessage}}
			</view>
			<view class="btn-box">
				<view class="confirm" @tap="userPoint">确认</view>
				<view class="confirm cancel" @tap="cancelPay">取消</view>
			</view>
		</view>
		<toast-model :message="message" verticalAlign="bottom" ref="toast" @confirm="confirmCancel" :duration="3000"></toast-model>
		<toast-model :message="message1" verticalAlign="bottom" ref="toast1" @confirm="confirmReceipt" :duration="3000"></toast-model>
		<toast-model :message="message2" verticalAlign="bottom" ref="toast2" @confirm="confirmDelete" :duration="3000"></toast-model>
	</view>
</template>

<script>
	import md5 from '../../utils/md5'
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				currencyName:"",
				payWay: 2,
				payOrderId: "",
				server1: false,
				transform: false,
				transformMessage: "",
				confirmList: [],
				addressData: [],
				password: "",
				sub: "",
				id: "",
				message: "",
				message1: "",
				message2: "",
				finish: false,
				orderStatus: ['全部', '待付款', '待发货', '待收货'],
				searchStatus: "",
				status: null,
				confirmList: [],
				status:"",
				firstIn:true
			}
		},
		onLoad(option) {
			// this.queryStatus(option.status)
			uni.setStorage({
			    key: 'myOrderStatus',
			    data: option.status,
			});
			this.firstIn=false;
		},
		onShow(){
			uni.getStorage({ key: 'myOrderStatus',
			 success:(res)=>{
				 if(res.data&&!this.firstIn){
				 	this.queryStatus(res.data);
				 }
				 }
			 })
			
		},
		methods: {
			payOrder(payOrderId, payPrice,currency,currencyName) {
				this.currencyName=currencyName
				this.payOrderId = payOrderId;
				this.sub = payPrice;
				this.server1 = true
				this.payWay=currency==1?2:7;
			},
			cancelPay() {
				this.hideChosen();
				this.password = ""
			},
			useCoin() {
				this.checkoutOrder();
			},
			userPoint() {
				this.payWay = 1;
				this.checkoutOrder();
			},
			checkoutOrder() {
				if (!this.password) {
					this.message = "支付密码不能为空"
					this.$refs.toast.show()
					return;
				}
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				uni.request({
					url: this.$httpUrl("/app/order/checkout"),
					data: {
						userId: getApp().globalData.userId,
						data: JSON.stringify({
							"orderIds": [{
								"id": this.payOrderId //订单id
							}]
						}),
						totalPrice: this.sub,
						payWay: this.payWay,
						secondPassword: md5(this.password)
					},
					method: "POST",
					header: {
						"content-type": "application/x-www-form-urlencoded",
						"token":getApp().globalData.token
					},
					success: (res) => {
						uni.hideLoading();
						if (res.data.code === 0) {
							var data = res.data.data;
							uni.redirectTo({
								url: `/pages/mall/success?id=${this.payOrderId}`
							});
						} 
						// else if (res.data.code === 50026) {
						// 	this.transformMessage = res.data.msg;
						// 	this.transform = true;
						// }
						 else if (res.data.code === 60001) {
							this.message = res.data.msg
							this.$refs.toast.showBindBox()
						} else {
							this.message = res.data.msg
							this.$refs.toast.show()
						}
					}
				});
			},
			hideChosen() {
				this.server1 = false
				this.transform = false;

			},
			toStatus(i) {
				uni.redirectTo({
					url: `/pages/mall/myOrder?status=${i}`
				})
			},
			deleteOrder(id) {
				this.id = id
				this.message2 = "确认删除此订单？";
				this.$refs.toast2.showConfirmBox()
			},
			confirmDelete() {
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				uni.request({
					url: this.$httpUrl("/app/order/delete"),
					data: {
						id: this.id,
					},
					method: "POST",
					header: {
						"content-type": "application/x-www-form-urlencoded",
						"token":getApp().globalData.token
					},
					success: (res) => {
						uni.hideLoading();
						if (res.data.code === 0) {
							this.queryStatus(this.status)
						} else {
							this.message = res.data.msg
							this.$refs.toast.show()
						}
					}
				});
			},
			confirmReceipt() {
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				uni.request({
					url: this.$httpUrl("/app/order/extract"),
					data: {
						id: this.id,
						status: 3
					},
					method: "POST",
					header: {
						"content-type": "application/x-www-form-urlencoded",
					"token":getApp().globalData.token
					},
					success: (res) => {
						uni.hideLoading();
						if (res.data.code === 0) {
							this.queryStatus(this.status)
							this.message="操作成功"
							this.$refs.toast.show()
						} else {
							this.message = res.data.msg
							this.$refs.toast.show()
						}
					}
				});
			},
			confirmOrder(id) {
				this.id = id
				this.message1 = "亲，在收到宝贝后再确认收货哦";
				this.$refs.toast1.showConfirmBox()
			},
			toOrderDetail(id) {
				this.$toPage(`/pages/mall/orderDetail?id=${id}`)
			},
			confirmCancel() {
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				uni.request({
					url: this.$httpUrl("/app/order/extract"),
					data: {
						id: this.id,
						status: 5
					},
					method: "POST",
					header: {
						"content-type": "application/x-www-form-urlencoded",
						"token":getApp().globalData.token
					},
					success: (res) => {
						uni.hideLoading();
						if (res.data.code === 0) {

							this.queryStatus(this.status)
						} else {
							this.message = res.data.msg
							this.$refs.toast.show()
						}
					}
				});
			},
			cancelOrder(id) {
				this.id = id
				this.message = "确认取消此订单？"
				this.$refs.toast.showConfirmBox()
			},
			getData(status) {
				uni.request({
					url: this.$httpUrl("/app/order/list"),
					data: {
						userId: getApp().globalData.userId,
						pageNum: 1,
						pageSize: 20,
						status: this.searchStatus,
						p4: "1.0.3"
					},
					method: "POST",
					header: {
						"content-type": "application/x-www-form-urlencoded",
						"token":getApp().globalData.token
					},
					success: (res) => {
						if (res.data.code === 0) {
							var data = res.data.data
							data.forEach((item, i) => {
								if (!item.brandImgUrl) {
									item.brandImgUrl = "/static/placeholder.png"
								}
								if(item.productList[0]){
									if (!item.productList[0].goodsImgUrl) {
										item.productList[0].goodsImgUrl = "/static/placeholder.png"
									}
								}
								var currency=item.payWay==7?2:1
								item.currencyImg = this.$getCoinImg(currency);
								item.currencyName = this.$getCoinName(item.payWay);
								this.confirmList.push(item);
								this.finish = true
							})
						} else if (res.data.msg === "暂无订单") {
							this.finish = true
						} else {
							this.message = res.data.msg
							this.$refs.toast.show()
						}
					}
				});
			},
			queryStatus(i) {
				this.status = i
				if (i == 0) {
					this.searchStatus = 100
				} else {
					this.searchStatus = i - 1
				}
				this.finish = false;
				this.confirmList = []
				this.getData(this.searchStatus)
			}
		}
	}
</script>

<style lang="scss">
	@import "../../assets/scss/mall.scss"
</style>
