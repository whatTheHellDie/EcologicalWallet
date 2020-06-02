<template>
	<view class="content b-t wrap">
		<sub-nav title="关于我们">
		</sub-nav>
		<view class="us-list ul-list0">
			<view class="li" v-for="item in usList" @tap="toNews(item.id,item.name)">
				<view>{{item.name}}</view>
			</view>
		</view>
		<view class="us-list">
			<view class="li">
				<view>当前版本</view>
				<view class="text">已是最新版<view class="iconfont">&#xe603;</view></view>
			</view>
		</view>
		<toast-model :message="message" verticalAlign="bottom" ref="toast" :duration="3000"></toast-model>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				message:"",
				usList:[]
			}
		},
		onLoad() {
			this.confirm()
		},
		methods: {
			toNews(id,name){
				this.$toPage('/pages/common/externalLink?url='+this.$httpUrl("/app/index/holdthecode/getHtml?id="+id+"&title="+name+"&userId="+getApp().globalData.userId))
			},
			confirm(){
				uni.request({
					url: this.$httpUrl("/app/base/files/aboutUs"),
					data: {
						siteType:1
					},
					method:"POST",
					header:{
						"content-type":"application/x-www-form-urlencoded"
					},
					success: (res) => {
						if (res.data.code === 0) {
							this.usList=res.data.data
						} else {
							this.message=res.data.msg
							this.$refs.toast.show() 
						}
					}
				});
			}
		}
	}
</script>

<style lang='scss'>
	.us-list{
		padding: 20rpx 0;
		.li{
			display: flex;justify-content: space-between;
			height: 88rpx;background: #fff;
			align-items: center;
			margin-bottom: 20rpx;
			border-bottom: 1px solid $border-color-base;
			padding: 0 20rpx;
			&:last-child{margin-bottom: 0;}
		}
		.text{display: flex;justify-content: space-between;width: 200rpx;color: #999;}
		.iconfont{font-size: 40rpx;color: #ddd;}
	}
	.ul-list0{padding-bottom: 0;
		.li{margin-bottom: 0;}
	}
</style>
