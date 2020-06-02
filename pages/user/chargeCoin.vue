<template>
	<view class=" wrap">
		<sub-nav :title="title">
			<view class="text" @click="$toPage('/pages/user/chargeCoinRecord?status=0'+'&chargeType='+chargeType)">记录</view>
		</sub-nav>
		<view>
			<view class="row b-b">
				<text class="tit">账户类型：</text>
				<view class="input">{{coinName}}</view>
			</view>
			<view class="row b-b">
				<text class="tit">充值数量：</text>
				<input class="input"v-model="transferAmount" type="number" placeholder="请输入充值数量"
				 placeholder-class="placeholder" />
			</view>
			<view class="row b-b">
				<text class="tit">交易号：</text>
				<input class="input" type="text" v-model="tradeNumber" placeholder="请输入交易号" placeholder-class="placeholder" />
			</view>
			<view class="wallet-address">
				<view class="view1">
					<text class="tit btn-default">收款方钱包地址：</text>
						<view class="copy-address btn-default" @tap="copyAddress">复制钱包地址</view>
				</view>
				<view class="address">{{walletAddr}}</view>
				<view class="view1">
					<text class="tit btn-default">收款方二维码：</text>
				</view>
				<view class="qr-wrap">
					<image :src="QRCode" class="qr-img" @error="QRCode='/static/placeholder.png'" mode=""></image>
					<view class="center">(打开imToken，到对应币种扫一扫二维码进行充值)</view>
				</view>
			</view>
			<view class="wallet-address">
				<view class="view1">
					<text class="tit btn-default">上传凭证：</text>
				</view>
				<view class="verified" @tap="chooseImg(1)">
					<image :src="img1" class="img pin"  mode=""></image>
					<image src="/static/ic_photo@2x.png" v-if="!img1" class="logo" mode=""></image>
					<view class="logo logo-text"  v-if="!img1">上传凭证</view>
				</view>
				<view class="view1">
					<text class="tit btn-default">充币说明：</text>
				</view>
				<view class="detail">
					1.请用您的个人钱包扫描以上充值二维码或复制充值地址进行充值。<br>
					2.充值完成后请选择充值的账户类型、填写充值数量、复制转账交易号(URL)进行粘贴，点击上传凭证，上传充值成功的订单详情图片（图片内容需包含“转账金额、发款方钱包地址、收款方钱包地址、交易时间”四个信息），点击提交申请即可。<br>
					3.信息确认无误后，客服会在半个小时内对您的账户进行充值，请注意查看
				</view>
			</view>
		</view>
		<view class="add-btn" @tap="confirm">确认</view>
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
				coinName:"",
				img1:"",
				accountType:"",
				toUserName:"",
				toUserNumber:"",
				message: "",
				coinType: "",
				title: "充币",
				password: "",
				transferAmount: "",
				arrival: "0",
				feeRateAmount: "0.00",
				walletAddr:"",
				QRCode:"",
				tradeNumber:"",
				chargeType:""
			}
		},
		onLoad(option) {
			if(option.obj){
				this.obj=JSON.parse(option.obj)
				this.transferAmount=this.obj.chargeAmount
				this.tradeNumber=this.obj.imSerialNumber
				this.img1=this.obj.proofUrl;
			}
			this.chargeType=option.chargeType
			console.log(typeof this.chargeType)
			if(option.chargeType==1){
				this.coinName="TC"
			}else{
				this.coinName="TB"
			}
			this.getCompanyWallet()
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		methods: {
			confirm() {
				uni.showLoading({
					title: '加载中',
					mask: true
				});
					uni.request({
						url: this.$httpUrl("/app/about/capital/charge"),
						data: {
							id:"",
							userId: this.userInfo.id,
							amount: this.transferAmount,
							imProofSeries: this.tradeNumber,
							proof:this.img1,
							version:this.$contextObj.version,
							type:this.chargeType==="1"?1:5
						},
						method: "POST",
						header: {
							"content-type": "application/x-www-form-urlencoded",
							"token":getApp().globalData.token
						},
						success: (res) => {
							uni.hideLoading();
							if (res.data.code === 0) {
								uni.redirectTo({
								    url: '/pages/user/chargeCoinRecord?status=0&chargeType='+this.chargeType
								});
							} else {
								this.message = res.data.msg;
								this.$refs.toast.show()
							}
						}
					});
			},
			
			chooseImg(index){
				uni.chooseImage({
				    success: (chooseImageRes) => {
				        const tempFilePaths = chooseImageRes.tempFilePaths;
				        uni.uploadFile({
				            url: this.$httpUrl("/app/base/files/filesUpload"), //仅为示例，非真实的接口地址
				            filePath: tempFilePaths[0],
				            name: 'file',
				            success: (uploadFileRes) => {
								var data=JSON.parse(uploadFileRes.data)
								this["img"+index]=data.data.picUrls[0]
				            }
				        });
				    }
				});
			},
			getCompanyWallet(){
				uni.request({
					url: this.$httpUrl("/app/about/capital/companyWalletInfo"),
					method:"POST",
					header:{
						"content-type":"application/x-www-form-urlencoded",
						"token":getApp().globalData.token
					},
					success: (res) => {
						if (res.data.code === 0) {
							var data=res.data.data
							this.walletAddr=data.walletAddr;
							this.QRCode=data.QRCode
						} else {
							this.message=res.data.msg
							this.$refs.toast.show() 
						}
					}
				});
			},
			copyAddress(){
				uni.setClipboardData({ data:this.walletAddr, success:(data)=>{
					this.message="复制成功"
					this.$refs.toast.show()
				}, fail:function(err){
					this.message="复制失败，您的浏览器不支持自动复制，请钱包地址复制"
					this.$refs.toast.show()
				}, complete:function(res){} })
			},
			
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-top: 16rpx;
	}

	.wrap-content {
		position: absolute;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		top: 0;
		left: 0;
	}

	.row {
		display: flex;
		align-items: center;
		position: relative;
		padding: 0 30rpx;
		height: 110rpx;
		background: #fff;

		.tit {
			flex-shrink: 0;
			width: 200rpx;
			font-size: 30rpx;
			color: $font-color-dark;
			height: 100%;
			align-items: center;
			display: flex;
		}

		.input {
			flex: 1;
			font-size: 30rpx;
			color: $font-color-dark;
			height: 100%;
			align-items: center;
			display: flex;
			justify-content: flex-end;
			text-align: right;
		}

	}

	.default-row {
		margin-top: 16rpx;

		.tit {
			flex: 1;
		}

	}

	.add-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 80rpx;
		font-size: $font-lg;
		color: #fff;
		background: $font-color-spec;
		border-radius: 0;
	}

	.textarea {
		width: 100%;
		height: 100%;
		padding-top: 10rpx;
	}

	.iconfont {
		font-size: 54rpx;
		color: #8C8C8C;
		position: absolute;
		top: 28rpx;
		right: 32rpx;
		pointer-events: none;
	}

	.spec {
		text-align: right;
		flex: 1;

		.fee {
			color: $font-color-spec;
			font-size: 24rpx;
		}

	}
	.wallet-address{
		margin-top: 20rpx;
		padding: 0 30rpx;
		background: #fff;
		.view1{
			display: flex;justify-content: space-between;
		}
		.tit{height: 120rpx;}
		.copy-address{
			margin-top: 36rpx;
			width: 180rpx;
			height: 52rpx;
			border-radius: 30rpx;
			background: $font-color-spec;color: #fff;font-size: 24rpx;height: 60rpx;
		}
		.address{color: $font-color-spec;font-size: 32rpx;word-break: break-all;height: 120rpx;}
		.qr-wrap{margin-bottom: 20rpx;padding: 20rpx 0;}
		.qr-img{width: 300rpx;height: 300rpx;display: block;margin: 0 auto;}
		.center{text-align: center;margin-top: 20rpx;color: #666;font-size: 24rpx;}
		.verified{position: relative;}
		.img{width: 638rpx;height: 336rpx;display: block;margin: 20rpx auto 0;}
		.logo{width: 128rpx;height: 128rpx;position: absolute;top: 108rpx;left: 280rpx;}
		.logo-text{    top: 234rpx;
	left: 284rpx;}
	.pin{border: 1px dashed #eee;}
	.detail{margin-bottom: 40rpx;color: #666;}
	}
</style>
