<template>
	<view class="content wrap">
		<view>
			<image src="/static/download-bg.png" class="face" mode=""></image>
			<view v-if="!isWeixin">
			<view class="add-btn active" @tap="toDownload('https://51gsc.com/app/Qkwu')">
				IOS版下载
			</view>
			<view class="add-btn" @tap="toDownload(android)">
				安卓版下载
			</view>
			</view>
			<view v-else>
				<view class="context-shadow"></view>
				<image src="/static/live_weixin.png" class="weixin" mode=""></image>
			</view>
		</view>
		<toast-model :message="message" verticalAlign="bottom" ref="toast" :duration="3000"></toast-model>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			message: '',
			android: ''
		};
	},
	computed: {
		...mapState(['userNumber', 'userInfo', 'showToastInInit', 'toastInfo']),
		isWeixin() {
			if (!window.navigator) {
			  window.navigator={
				  userAgent : "uniapp"
			  }
			}
			var ua = navigator.userAgent.toLowerCase();
			if (ua.match(/MicroMessenger/i) == 'micromessenger') {
				return true;
			} else {
				return false;
			}
		}
	},
	onLoad(option) {
		this.getAndroid();
	},
	methods: {
		...mapMutations(['login', 'addUserNumber', 'hideToastInfo', 'addToken']),
		toDownload(url) {
			window.location.href = url;
		},
		getAndroid() {
			uni.request({
				url: this.$httpUrl('/app/assets/AndroidDownload/url'),
				method: 'GET',
				success: res => {
					if (res.data.code === 0) {
						this.android = res.data.data.url;
					} else {
						this.message = res.data.msg;
						this.$refs.toast.show();
					}
				}
			});
		},
		wait() {
			this.message = '敬请期待';
			this.$refs.toast.show();
		}
	}
};
</script>

<style lang="scss" scoped>
	page{background: #6ef9c3;padding: 0 !important;}
.out-tip{padding: 20rpx;font-size: 34rpx;}
.weixin {
	position: absolute;
	right: 0;
	top: 0;
	z-index: 999;
}
.wrap {
	background: transparent;
}
page {
	padding-top: 16rpx;
}
.face {
	width: 100%;
	height: 1334rpx;
	display: block;
	position: absolute;
	top: 0;left: 0;
}
.title-text {
	font-size: 44rpx;
	text-align: center;
	margin: 42rpx 0 96rpx;
}
.download {
	width: 42rpx;
	height: 42rpx;
	margin-right: 14rpx;
}
.add-btn {
	position: absolute;
	top: 958rpx;left: 50%;
	transform: translateX(-50%);
	display: flex;
	align-items: center;
	justify-content: center;
	width: 453rpx;
	height: 76rpx;
	margin: 60rpx auto;
	font-size: 30rpx;
	color: #fff;
	background: #1b7a34;
	border-radius: 50rpx;
	&.active {
		top: 1068rpx;
		background: #29d34f;
	}
}
</style>
