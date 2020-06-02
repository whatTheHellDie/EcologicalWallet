<template>
	<view class="wrap">
		<mall-nav title="我的订单"> </mall-nav>
		<view class="order-address" @tap="toAddress">
			<image src="/static/ic_order_details_map@2x.png" class="img" alt="" />
			<view class="content">
				<view v-if="hasAddress" v-for="item in addressData">
					<view class="div"><text>收货人：{{item.receiver}}</text><text class="phone">{{item.phone}}</text></view>
					<view class="address">收货地址：
						{{item.provinceName+item.cityName+item.districtName+item.address}}</view>
				</view>
				<view v-else>
					<view class="add">请添加收货地址</view>
				</view>
			</view>
			<image src="/static/ic_right1@2x.png" class="right" />
		</view>

		<view class="comfirm-list confirm-listx fix">
			<view class="ul">
				<view class="li">
					<view class="title">
						<image :src="confirmData.infoData.brandImgUrl" class="sign" alt="" /><text class="from">{{confirmData.infoData.brandName}}</text></view>
					<view class="content">
						<image :src="confirmData.specification" class="pic" alt="" />
						<view class="right">
							<view class="name">{{confirmData.infoData.productName}}</view>
							<text class="number">x{{confirmData.buyNumber}}</text>
							<view class="type">{{confirmData.categoryName}}：{{confirmData.chima1}}</view>
							<view class="type" v-if="confirmData.categoryNameB">{{confirmData.categoryNameB}}：{{confirmData.chima2}}</view>
							<view class="price">
								<image :src="confirmData.currency" alt="" class="coin" />{{confirmData.price}}
							</view>
						</view>
					</view>
					<view class="way">配送方式<view>快递费
							<image :src="confirmData.currency" alt="" v-if="freightFee!='免邮'" class="coin" :style="{marginLeft:'14rpx'}" />{{freightFee}}</view>
					</view>
					<view class="way" @tap="peisong=true">配送签收<view>
							<image src="/static/ic_right1@2x.png" alt="" class="right-pic" />
						</view>
					</view>
					<view class="way">买家留言：<textarea v-model="remark" placeholder="选填，请输入您对本次交易的说明或其他" cols="30" rows="10"></textarea></view>
					<view class="total">共{{confirmData.buyNumber}}件商品<view class="ji">小计：<view class="sub color">
								<image :src="confirmData.currency" alt="" class="coin" />{{sub}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="fixed-bottom">
			合计：
			<image :src="confirmData.currency" alt="" class="coin" /><text class="color">{{sub}}</text>
			<view class="submit" @tap="submitOrder">提交订单</view>
		</view>
		<view class="context-shadow" v-if="peisong||server1||transform" @tap="hideChosen"></view>
		<view class="peisong clearfix" :class="{active:peisong}">
			<view class="name">
				配送签收
				<image src="/static/ic_close-circle-o@2x.png" @tap="close" alt="" class="close" />
			</view>
			<view class="need clearfix">
				<image src="/static/ic_delivery_service@2x.png" class="left" />
				<view class="right">
					<view class="title">送货上门</view>
					<view class="content">本商城会根据您的收货地址自动为您匹配发货 仓库及快递公司，暂不接受指定快递派送，感谢您的支持与理解。</view>
				</view>
			</view>

			<view class="need clearfix">
				<image src="/static/ic_signing_service@2x.png" class="left" />
				<view class="right">
					<view class="title">签收服务</view>
					<view class="content">快递请本人当面签收，如有任何包装损坏，请
						确保产品质量是否有破损，如有破损请当面拒
						收，如非本人签收，则视为产品签收无误。</view>
				</view>
			</view>
		</view>
		<view class="pei user-confirm user-confirm1 clearfix" :class="{active:server1}">
			<view class="name">
				请输入支付密码
				<image src="/static/ic_wrong.png" alt="" @tap="close" class="close" />
			</view>
			<view class="balance">
				{{sub}} {{confirmData.payWay==2?'TC':'USDT'}}币
			</view>
			<view class="relative">
				<input type="password" v-model="password" class="password" placeholder="请输入支付密码" />
			</view>
			<view class="forget" @tap="$toPage('/pages/user/resetLoginPassword?title=重置支付密码')">忘记密码？</view>
			<view class="confirm" @tap="createOrder">确认</view>
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
		<toast-model :message="message" verticalAlign="bottom" ref="toast" :duration="3000"></toast-model>
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
				freightFee:"",
				saveInitPayWay: "",
				payOrderId: "",
				message: "",
				hasAddress: false,
				peisong: false,
				server1: false,
				transform: false,
				transformMessage: "",
				confirmList: [],
				addressData: [],
				confirmData: {},
				remark: "",
				password: ""
			}
		},
		onLoad(option) {
			if (option.confirmData) {
				this.confirmData = JSON.parse(option.confirmData)
				console.log(this.confirmData)
			}
			
		},
		onShow() {
			this.judgeAddress()
		},
		computed: {
			...mapState(['useAddress', 'userInfo']),
			sub() {
				if (!this.confirmData.buyNumber) {
					return ""
				} else {
					let expressFee=this.freightFee
					if(expressFee=="免邮"){
						expressFee=0
					}
					return (this.confirmData.buyNumber * this.confirmData.price+Number(expressFee)).toFixed(2)
				}
			}
		},
		methods: {
			getFee(){
				uni.request({
					url: this.$httpUrl("/app/order/getFreight"),
					data: {
						buyInfo: JSON.stringify({
						 "itemList" : [{
								"goodsId" : this.confirmData.infoData.productId,
								"buyNum" : this.confirmData.buyNumber
							}]
					  }),
						addressId: this.addressData[0].id,
					},
					method: "POST",
					header: {
						"content-type": "application/x-www-form-urlencoded",
						"token":getApp().globalData.token
					},
					success: (res) => {
						if (res.data.code === 0) {
							var data = res.data.data;
							this.freightFee=data.freightFee!=0?data.freightFee:"免邮"
						} else {
							this.message=res.data.msg
							this.$refs.toast.show()
						}
					}
				});
			},
			submitOrder(){
				if(this.addressData[0]){
					this.server1=true
				}else{
					this.message="请先选择收货地址"
					this.$refs.toast.show()
				}
			},
			cancelPay() {
				this.confirmData.payWay = this.saveInitPayWay;
				this.hideChosen();
				this.password = ""
			},
			userPoint() {
				this.saveInitPayWay = this.confirmData.payWay
				this.confirmData.payWay = 1
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
						payWay: this.confirmData.payWay,
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
						//  else if (res.data.code === 50026) {
						// 	this.transformMessage = res.data.msg;
						// 	this.transform = true;
						// }
						else if(res.data.code===60001){
							this.message=res.data.msg
							this.$refs.toast.showBindBox()
						} else {
							this.message=res.data.msg
							this.$refs.toast.show()
						}
					}
				});
			},
			createOrder() {
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				let specId;
				if (this.confirmData.categoryNameB) {
					specId = this.confirmData.specListB[this.confirmData.typeBActive].id
				} else {
					specId = this.confirmData.specList[this.confirmData.typeActive].id
				}
				var json = JSON.stringify({
					"brandList": [{
						"id": this.confirmData.infoData.brandId,
						"remark": this.remark,
						"freightFee": this.freightFee!="免邮"?this.freightFee:0,
						"goodsList": [{
							"goodsId": this.confirmData.infoData.productId,
							"specId": specId,
							"quantity": this.confirmData.buyNumber
						}]
					}]
				})
				uni.request({
					url: this.$httpUrl("/app/order/create"),
					data: {
						userId: getApp().globalData.userId,
						addressId: this.addressData[0].id,
						data: json
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
							this.payOrderId = data[0].id
							this.checkoutOrder()
						} else {
							this.message=res.data.msg
							this.$refs.toast.show()
						}
					}
				});
			},
			judgeAddress() {
				if (this.useAddress.id) {
					this.hasAddress = true
					this.addressData = [this.useAddress];
					this.getFee()
				} else {
					this.getDefaultAddress()
				}
			},
			toAddress() {
				this.$toPage('/pages/user/address?from=mall')
			},
			getDefaultAddress() {
				uni.request({
					url: this.$httpUrl("/app/shippingAddr/list"),
					data: {
						userId: getApp().globalData.userId,
					},
					method: "POST",
					header: {
						"content-type": "application/x-www-form-urlencoded",
						"token":getApp().globalData.token
					},
					success: (res) => {
						if (res.data.code === 0) {
							var data = res.data.data;
							this.hasAddress = res.data.data.length ? true : false
							this.addressData = [data[0]];
							this.getFee()
						} else {
							this.message=res.data.msg
							this.$refs.toast.show() 
						}
					}
				});
			},
			close() {
				this.peisong = false;
				this.server1 = false
			},
			hideChosen() {
				this.peisong = false;
				this.server1 = false
				this.transform = false;

			}
		}
	}
</script>

<style lang="scss">
	@import "../../assets/scss/mall.scss"
</style>
