<template>
	<view>
		<view class="fixed-top  wrap-tab">
			<image src="/static/user-bg.jpg" class="bg" mode=""></image>
			<image src="/static/set.png" class="set" mode="" @tap="$toPage('/pages/user/set')"></image>
			<view class="user-info" :class="{'notLogin':hasLogin}" @tap="toUser">
				<image @tap="uploadPortrait" :src="userInfo.portrait?userInfo.portrait:'/static/missing-face.jpg'" class="face"
				 mode=""></image>
				<view class="content" v-if="hasLogin">
					<view class="name">{{userInfo.realName}}</view>
					<view class="number">会员号：{{userInfo.userNumber}}</view>
				</view>
				<view class="login" v-else>登录</view>
			</view>
			<view class="my-order">
				<view class="title" @tap="toOrder(0)">我的订单<view class="all">全部订单<view class="iconfont mine-right">&#xe603;</view>
					</view>
				</view>
				<view class="choose">
					<view class="li" @tap="toOrder(1)">
						<view class="inner">
							<image src="/static/x1.png" class="pic" mode=""></image>
						</view>
						<view>待付款</view>
					</view>
					<view class="li" @tap="toOrder(2)">
						<view class="inner">
							<image src="/static/x2.png" class="pic" mode=""></image>
						</view>
						<view>待发货</view>
					</view>
					<view class="li" @tap="toOrder(3)">
						<view class="inner">
							<image src="/static/x3.png" class="pic" mode=""></image>
						</view>
						<view>待收货</view>
					</view>
				</view>
			</view>
		</view>
		<view class="my-content">
			<view class="ul">
				
				<view class="li" @tap="toTarget('/pages/user/myScore')">
					<view class="title-wrap">
						<image :src="picList[0]" class="img" mode=""></image>
						<text class="text">我的资产</text>
					</view>
					<view class="iconfont">&#xe603;</view>
				</view>
				<view class="li" @tap="toTarget('/pages/index/chargeCoin')">
					<view class="title-wrap">
						<image :src="picList[2]" class="img" mode=""></image>
						<text class="text">充值</text>
					</view>
					<view class="iconfont">&#xe603;</view>
				</view>
				<!-- <view class="li" @tap="toVIP()">
					<view class="title-wrap">
						<image :src="picList[3]" class="img" mode=""></image>
						<text class="text">加入VIP会员</text>
					</view>
					<view class="vip-wrap">
						<image src="/static/ic_mine_becomevip.png" v-if="isVip" class="it-vip" mode=""></image>
						<view class="iconfont">&#xe603;</view>
					</view>
				</view>
				<view class="li" @tap="jumpToVIPConstructor">
					<view class="title-wrap">
						<image :src="picList[4]" class="img" mode=""></image>
						<text class="text">会员结构</text>
					</view>
					<view class="iconfont">&#xe603;</view>
				</view> -->
				<view class="li" @click="$toPage('/pages/user/inviteFriend')">
					<view class="title-wrap">
						<image :src="picList[5]" class="img" mode=""></image>
						<text class="text">邀请好友</text>
					</view>
					<view class="iconfont">&#xe603;</view>
				</view>
				<view class="li" @tap="isExchange">
					<view class="title-wrap">
						<image :src="picList[1]" class="img" mode=""></image>
						<text class="text">绑定交易所账号</text>
					</view>
					<view class="iconfont">&#xe603;</view>
				</view>
				<view class="li" @tap="$toPage('/pages/user/service')">
					<view class="title-wrap">
						<image :src="picList[6]" class="img" mode=""></image>
						<text class="text">客服中心</text>
					</view>
					<view class="iconfont">&#xe603;</view>
				</view>
				<view class="li" @tap="toTarget('/pages/contact/contact')">
					<view class="title-wrap">
						<image :src="picList[9]" class="img" mode=""></image>
						<text class="text">生态合约</text>
					</view>
					<view class="iconfont">&#xe603;</view>
				</view>
			</view>
			
			<view class="ul ul1">
				<view class="li" @tap="$toPage('/pages/user/feedback')">
					<view class="title-wrap">
						<image :src="picList[7]" class="img" mode=""></image>
						<text class="text">意见反馈</text>
					</view>
					<view class="iconfont">&#xe603;</view>
				</view>
				<view class="li" @tap="$toPage('/pages/user/aboutUs')">
					<view class="title-wrap">
						<image :src="picList[8]" class="img" mode=""></image>
						<text class="text">关于我们</text>
					</view>
					<view class="iconfont">&#xe603;</view>
				</view>
			</view>
			<view class="context-shadow" :style="{zIndex:999}" v-if="showShadow" @tap="showShadow=false"></view>
			<view class="alert-choose-box btn-default" v-if="showShadow">
				<view class="box">
					<view class="text">您是否有交易所账号？</view>
					<view class="btn-default" @tap="$toPage('/pages/user/bindExchangeAccount')">已有账号-去绑定</view>
					<view class="btn-default" @tap="$toPage('/pages/user/registerExchangeAccount')">未有账号-去注册</view>
				</view>
			</view>
		</view>
		<!-- <custom-tabbar :index="4"></custom-tabbar> -->
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
				picList:["/static/a1.png","/static/a2.png","/static/a3.png","/static/a4.png","/static/a5.png","/static/a6.png","/static/a7.png","/static/a8.png","/static/a9.png","/static/a10.png"],
				isVip: false,
				message: "",
				showShadow: false
			}
		},
		onLoad(option) {
			if(this.themeIndex!==""){
				this.picList=this.$Theme[this.themeIndex].myIcon
			}
			if (option.message) {
				this.message = option.message
				setTimeout(() => {
					this.showMessage()
				}, 200)
			}

		},
		onShow() {
			this.getUserInfo();
			this.isNodeVip()
			if (this.showToastInInit) {
				this.hideToastInfo()
				this.message = this.toastInfo;
				setTimeout(this.$refs.toast.show, 200)
			}
		},
		computed: {
			...mapState(['hasLogin', 'userInfo', 'showToastInInit', 'toastInfo']),
			themeIndex(){
				return getApp().globalData.theme;
			},
			isYellow(){
				return this.themeIndex===0
			}
		},
		methods: {
			...mapMutations(['updatePortrait', 'hideToastInfo','login']),
			getUserInfo() {
				if (this.userInfo.id) {
					uni.request({
						url: this.$httpUrl("/app/base/info/userInfo"),
						data: {
							userId: this.userInfo.id
						},
						method: "POST",
						header: {
							"content-type": "application/x-www-form-urlencoded",
							"token":getApp().globalData.token
						},
						
						success: (res) => {
							if (res.data.code === 0) {
								this.login(res.data.data)
								this.balance = this.userInfo.lovebirdPoint.toFixed(2)
							} else {
								this.message = res.data.msg
								this.$refs.toast.show()
							}
						}
					});
				}
			},
			toOrder(index) {
				if (this.hasLogin) {
					this.$toPage(`/pages/mall/myOrder?status=${index}`)
				} else {
					this.$toPage("/pages/user/login")
				}
			},
			jumpToVIPConstructor() {
				if (this.hasLogin) {
					if (!this.isVip) {
						uni.showModal({
							title: '提示',
							content: '是否加入VIP会员',
							success: (res) => {
								if (res.confirm) {

									this.$toPage(`/pages/user/joinVIP`);

								} else if (res.cancel) {}
							}
						});
					} else {
						this.$toPage(`/pages/common/externalLink?url=${this.$httpUrl("/app/base/vip/toStructure?userId="+getApp().globalData.userId)}`)
					}
				} else {
					this.$toPage("/pages/user/login")
				}
			},
			toVIP() {
				if (this.hasLogin) {
					if (!this.isVip) {
						uni.showModal({
							title: '提示',
							content: '是否加入VIP会员',
							success: (res) => {
								if (res.confirm) {

									this.$toPage(`/pages/user/joinVIP`);

								} else if (res.cancel) {}
							}
						});
					}
				} else {
					this.$toPage("/pages/user/login")
				}

			},
			toTarget(url) {
				if (this.hasLogin) {
					this.$toPage(url)
					return;
				}
				this.$toPage("/pages/user/login")

			},
			showMessage() {
				this.$refs.toast.show()
			},
			isNodeVip() {
				if (this.userInfo.id) {
					uni.request({
						url: this.$httpUrl("/app/base/vip/isNodeVip"),
						data: {
							userId: this.userInfo.id
						},
						method: "POST",
						header: {
							"content-type": "application/x-www-form-urlencoded",
							"token":getApp().globalData.token
						},
						success: (res) => {
							if (res.data.code == 0) {
								this.isVip = res.data.data.type == 0 ? false : true
							} else {
								this.message = res.data.msg
								this.$refs.toast.show()
							}
						}
					});
				}
			},

			uploadPortrait() {
				if (this.hasLogin) {
					uni.chooseImage({
						success: (chooseImageRes) => {
							const tempFilePaths = chooseImageRes.tempFilePaths;
							uni.showLoading({
								title: '上传中',
								mask: true
							});
							uni.uploadFile({
								url: this.$httpUrl("/app/base/files/uploadPortrait"), //仅为示例，非真实的接口地址
								filePath: tempFilePaths[0],
								header: {},
								name: 'file',
								formData: {
									'userId': this.userInfo.id,
									'p3': 'Android'
								},
								success: (uploadFileRes) => {
									uni.hideLoading();
									this.getUserInfo()
									this.message="上传头像成功"
									this.$refs.toast.show()
								}
							});
						}
					});
				}
			},
			blobToDataURL(blob, callback) {
				var a = new FileReader();
				a.onload = function(e) {
					callback(e.target.result);
				}
				a.readAsDataURL(blob);
			},
			isExchange() {
				this.message="敬请期待"
				this.$refs.toast.show()
				return;
				if (this.hasLogin) {
					if (!this.userInfo.bindingNumber) {
						this.showShadow = true
					} else {
						this.$toPage("/pages/user/bindExchangeAccount")
					}
				} else {
					this.$toPage("/pages/user/login")
				}
			},
			toUser() {
				if (!this.hasLogin) {
					this.$toPage("/pages/user/login")
				}
			}

		}
	}
</script>
<style lang='scss'>
	@import "../../assets/scss/user.scss"
</style>
