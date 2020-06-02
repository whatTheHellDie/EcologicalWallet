<template>
	<view>
		<view v-if="showStatus" class="yu-toast-container active" :class="verticalAlign" :style="verticalAlign === 'center' ? verticalCenterStyle : ''">
			<text class="yu-toast-message" :style="messageStyle">{{message}}</text>
		</view>
		<view class="context-shadow" v-if="showConfirm" @tap="showConfirm=false"></view>
		<view class="alert-choose-box btn-default" v-if="showConfirm">
			<view class="box">
				<view class="text">{{message}}</view>
				<view class="btn-group">
					<view class="btn-default btn-confirm" @tap="confirm">确认</view>
					<view class="btn-default btn-confirm btn-cancel" @tap="showConfirm=false">取消</view>
				</view>
			</view>
		</view>
		<view class="context-shadow"  v-if="showBind"  @tap="showBind=false"></view>
		<view class="alert-choose-box" v-if="showBind">
			<view class="box">
				<view class="text">{{message}}</view>
			</view>
			<view class="to-bind" @tap="$toPage('/pages/user/bindExchangeAccount')">去绑定交易所账号</view>
		</view>
		<view class="context-shadow" v-if="showConfirm1" @tap="showConfirm1=false"></view>
		<view class="alert-choose-box btn-default" v-if="showConfirm1">
			<view class="box">
				<view class="text">{{message}}</view>
				<view class="btn-group">
					<view class="btn-default btn-confirm" @tap="confirm">去绑定</view>
					<view class="btn-default btn-confirm btn-cancel" @tap="$back">取消</view>
				</view>
			</view>
		</view>
		<view class="context-shadow" v-if="showConfirm2"></view>
		<view class="alert-choose-box btn-default" v-if="showConfirm2">
			<view class="box">
				<view class="text">{{message}}
				<view class="btn-default copy" :style="{backgroundColor:'#007f8e'}" @tap="confirm1">复制</view>
				</view>
				<view class="btn-group">
					<view class="btn-default btn-confirm" @tap="showConfirm2=false" :style="{backgroundColor:'#007f8e'}">确认</view>
					<view class="btn-default btn-confirm btn-cancel" @tap="showConfirm2=false">取消</view>
				</view>
			</view>
		</view>
		<view class="context-shadow" v-show="showMessage" @click="showMessage=false"></view>
		<view class="alert-choose-box btn-default" v-if="showMessage" :style="{padding:0,borderRadius: '10rpx',overflow: 'hidden'}">
			<view class="box" :style="{padding:0}">
				<view class="latest-news">{{message}}</view>
				<view class="text" :style="{padding:'40rpx 20rpx',margin:'0',textAlign:'left'}">{{desc}}<u-parse  :content="desc"  /></view>
			</view>
		</view>
	</view>
</template>
<script>
	import uParse from '@/components/gaoyia-parse/parse.vue'
	export default {
		name: 'yu-toast',
		props: {
			
			message: {
				type: String,
				default: ''
			},
			duration: {
				type: Number,
				default: 2000
			},
			verticalAlign: {
				type: String,
				default: 'bottom'
			},
			backgroundColor: {
				type: String,
				default: '#000000'
			},
			color: {
				type: String,
				default: '#FFFFFF'
			},
			desc: {
				type: String,
				default: ''
			},
		},
		watch:{
			desc(){
				this.showDesc=true
			}
		},
		components:{
			uParse
		},
		data() {
			return {
				showDesc:false,
				showMessage:false,
				showBind:false,
				showStatus: false,
				showConfirm:false,
				showConfirm1:false,
				showConfirm2:false
			};
		},
		computed: {
			verticalCenterStyle() {
				const value = uni.getSystemInfoSync().screenHeight / 2;
				return `bottom: ${value}px;`;
			},
			messageStyle() {
				return `background-color: ${this.backgroundColor};color: ${this.color};`;
			}
		},
		methods: {
			showMessageBox(){
				this.showMessage=true
			},
			showConfirmBox2(){
				this.showConfirm2=true
			},
			showConfirmBox1(){
				this.showConfirm1=true
			},
			 showBindBox(){
				 this.showBind=true
			 },
			showConfirmBox(){
				this.showConfirm=true
			},
			confirm1(){
				this.$emit('confirmx');
			},
			confirm(){
				this.$emit('confirm');
				this.showConfirm=false;
			},
			cancel(){
				this.$emit('cancel');
				this.showConfirm=false;
			},
			show() {
				this.showStatus = true;
				setTimeout(() => {
					this.showStatus = false;
				}, this.duration);
			}
		}
	}
</script>
<style scoped="scss">
	.yu-toast-container {
		position: fixed;
		z-index: 9999;
		line-height: 18px;
		opacity: 0;
		width: 100%;
		display: flex;
		justify-content: center;
		left: 0;
	}

	.yu-toast-container.top {
		/* #ifdef H5 */
		top: 88px;
		/* #endif */
		/* #ifndef H5 */
		top: 44px;
		/* #endif */
	}

	.yu-toast-container.bottom {
		bottom: 50px;
	}

	.yu-toast-container.active {
		opacity: 0.8;
	}

	.yu-toast-message {
		padding: 20upx 50upx;
		font-size: 28upx;
		text-align: center;
		border-radius: 6px;
	}
	.alert-choose-box .box{width: 100%;padding: 0 20rpx;}
	.alert-choose-box .text{word-break: break-all;}
	.alert-choose-box .copy{width: 100rpx;height: auto;display: inline-block;border-radius: 10rpx;padding: 10rpx;margin-left: 10rpx;font-size: 24rpx;}
	.alert-choose-box .latest-news{height: 80rpx;line-height: 80rpx;background: #006934;padding: 0 20rpx;color: #fff;}
</style>
