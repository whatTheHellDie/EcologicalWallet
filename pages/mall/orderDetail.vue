<template>
	<view class="wrap">
	 <mall-nav title="订单详情"></mall-nav>
  <view class="order-detail-status">
	  <view  v-for="item in confirmList" v-if="confirmList.length>0">
	  
    <img src="/static/ic_order_details_payment.png" v-if="item.status==0" class="order-detail-img"/>
    <img src="/static/ic_order_details_send_out@2x.png" v-if="item.status==1" class="order-detail-img"/>
    <img src="/static/ic_order_details_banner_delivers@2x.png" v-if="item.status==2" class="order-detail-img"/>
    <img src="/static/ic_order_details_trade_success.png" v-if="item.status==3||item.status==4" class="order-detail-img"/>
    <img src="/static/ic_order _details_banner@2x.png" v-if="item.status==5" class="order-detail-img"/>
    <view class="order-address order-address2">
      <img src="/static/ic_order_details_map@2x.png" class="img" alt="" />
      <view class="content">
        <view class="div"><text>{{item.name}}</text><text class="phone">{{item.phone}}</text></view>
        <view class="address">{{item.address}}</view>
      </view>
    </view>
    
    <view class="comfirm-list my-order-list">
      <view class="ul">
      	<view class="li">
      	  <view class="title"><img :src="item.brandImgUrl" class="sign" alt="" /><text class="from">{{item.brandName}}</text>
      	  </view>
      	  <view class="content" v-for="itemx in item.productList">
      	    <img :src="itemx.productImgUrl" class="pic" alt="" />
      	    <view class="right">
      	     <view class="name">{{itemx.productName}}</view>
      	     <view class="type">{{itemx.nameA}} <text class="number">x{{itemx.buySum}}</text></view>
      	     <view class="type" v-if="itemx.nameB">{{itemx.nameB}}</view>
      	     <view class="price"><image :src="item.currencyImg" alt="" class="coin" />{{itemx.price?itemx.price.toFixed(2):0.00}}</view>
      	    </view>
      	  </view>
      	  <view class="way">共{{item.buySum}}件商品</view>
      	  <view class="way">运费（快递）<text class="right-span">{{item.freightFee}}</text></view>
      	  <view class="way">支付方式 <text class="right-span">{{item.coinName}}币</text>
		  </view>
      	  <view class="way">实际支付<text class="right-type color"><img src="" alt="" class="coin" />{{item.totalPrice?item.totalPrice.toFixed(2):"0.00"}}{{item.coinName}}币</text></view>
      	</view>
      </view>
      <view class="way-top">
        <view class="way">订单编号：{{item.orderNumber}}</view>
        <view class="way">下单时间：{{item.createTime}}</view>
        <view class="way">支付时间：{{item.payTime}}</view>
        <view class="way">买家留言：{{item.remark}}</view>
        <view class="need-pay"  v-if="item.status!=1">
        			  <view class="btn-default cancel" @tap.stop="cancelOrder(item.orderId)" v-if="item.status==0">取消订单</view>
        			  <view class="btn-default pay" @tap.stop="payOrder(item.orderId,item.totalPrice)" v-if="item.status==0">付款</view>
        			  <view class="btn-default cancel" @tap.stop="confirmOrder(item.orderId)" v-if="item.status==2">确认收货</view>
        			  <view class="btn-default cancel" @tap.stop="deleteOrder(item.orderId)" v-if="item.status==3||item.status==4||item.status==5||item.status==7">删除订单</view>
        			  </view>
      </view>
    </view>
	</view>
    <view class="context-shadow" v-if="peisong||server||server1||transform" @tap="hideChosen"></view>
	<view class="pei user-confirm user-confirm1 clearfix" :class="{active:server1}">
		<view class="name">
			请输入支付密码
			<image src="/static/ic_wrong.png" alt="" @tap="hideChosen" class="close" />
		</view>
		<view class="balance">
			{{sub}} {{coinName}}币
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
  </view>
</template>

<script>
	import md5 from '../../utils/md5'
  export default {
    data() {
      return {
		  coinName:"",
		  payWay:"",
		  payOrderId: "",
		  server1: false,
		  transform: false,
		  transformMessage: "",
		  addressData: [],
		  password:"",
		  sub:"",
		  id:"",
		  message:"",
		  message1:"",
		  message2:"",
        server:false,
        peisong:false,
        confirmList:[],
		
      }
    },
    components: {
    },
	onLoad(option) {
		this.id=option.id;
		this.getDetail()
	},
    methods: {
		payOrder(payOrderId,payPrice){
			this.payOrderId=this.id;
			this.sub=payPrice;
			this.server1=true
		},
		cancelPay() {
			this.hideChosen();
			this.password = ""
		},
		useCoin(){
			this.payWay=this.confirmList[0].currency==1?2:7;
			this.checkoutOrder();
		},
		userPoint() {
			this.payWay=1;
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
		
		deleteOrder(id){
			this.message2="确认删除此订单？";
			this.$refs.toast2.showConfirmBox()
		},
		confirmDelete(){
			uni.showLoading({
								title: '加载中',
								mask: true
							});
			uni.request({
				url: this.$httpUrl("/app/order/delete"),
				data: {
					id:this.id,
				},
				method:"POST",
				header:{
					"content-type":"application/x-www-form-urlencoded"
				},
				success: (res) => {
					uni.hideLoading();
					if (res.data.code === 0) {
						this.$back()
					}else {
						this.message=res.data.msg
						this.$refs.toast.show() 
					}
				}
			});
		},
		confirmReceipt(){
			uni.showLoading({
								title: '加载中',
								mask: true
							});
			uni.request({
				url: this.$httpUrl("/app/order/extract"),
				data: {
					id:this.id,
					status:3
				},
				method:"POST",
				header:{
					"content-type":"application/x-www-form-urlencoded"
				},
				success: (res) => {
					uni.hideLoading();
					if (res.data.code === 0) {
						this.confirmList=[]
						this.getDetail()
						this.message="操作成功"
						this.$refs.toast.show() 
					}else {
						this.message=res.data.msg
						this.$refs.toast.show() 
					}
				}
			});
		},
		confirmOrder(id){
			this.message1="亲，在收到宝贝后再确认收货哦";
			this.$refs.toast1.showConfirmBox()
		},
		confirmCancel(){
			uni.showLoading({
								title: '加载中',
								mask: true
							});
			uni.request({
				url: this.$httpUrl("/app/order/extract"),
				data: {
					id:this.id,
					status:5
				},
				method:"POST",
				header:{
					"content-type":"application/x-www-form-urlencoded"
				},
				success: (res) => {
					uni.hideLoading();
					if (res.data.code === 0) {
						this.confirmList=[]
						this.getDetail()
					}else {
						this.message=res.data.msg
						this.$refs.toast.show() 
					}
				}
			});
		},
		cancelOrder(id){
			this.message="确认取消此订单？"
			this.$refs.toast.showConfirmBox()
		},
		getDetail(){
			uni.request({
				url: this.$httpUrl("/app/order/detail"),
				data: {
					orderId:this.id,
				},
				method:"POST",
				header:{
					"content-type":"application/x-www-form-urlencoded"
				},
				success: (res) => {
					if (res.data.code === 0) {
						var item=res.data.data;
						if(!item.brandImgUrl){
							item.brandImgUrl="/static/placeholder.png"
						}
						if(!item.productList[0].productImgUrl){
							item.productList[0].productImgUrl="/static/placeholder.png"
						}
						var currency=item.payWay==7?2:1
						item.currencyImg=this.$getCoinImg(currency);
						item.coinName=this.$getCoinName(item.payWay)
						console.log(item.payWay)
						this.coinName=item.coinName
						this.confirmList.push(item)
						
					} else {
						this.message=res.data.msg
						this.$refs.toast.show() 
					}
				}
			});
		},
      close(){
        this.peisong=false;
        this.server=false
        this.server1=false
      },
      hideChosen(){
        this.peisong=false;
        this.server=false
        this.server1=false
        this.transform=false
      }
    }
  }
</script>

<style lang="scss">
@import "../../assets/scss/mall.scss";
.order-address{
	border-bottom: 20rpx solid $border-color-base;
}
</style>