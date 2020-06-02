<template>
	<view class="wrap">
		<sub-nav :title="title"></sub-nav>
		<!-- <web-view :src="url" class="wrap"></web-view> -->
		<u-parse :content="desc"  />
		<view class="phone-call"><image src="/static/telegram.png" class="img" mode=""></image>Telegram：https://t.me/treebankoffical</view>
		<toast-model :message="message" verticalAlign="bottom" ref="toast" :duration="3000"></toast-model>
	</view>
</template>

<script>
	import uParse from '@/components/gaoyia-parse/parse.vue'
	
	export default {
		components:{
			uParse
		},
		data() {
			return {
				url:"",
				title:"客服中心",
				type:"",
				desc:"",
				phone:"",
				message:""
			}
		},
		
		onLoad(option) {
			this.getServer()
		},
		methods:{
			getServer(){
				uni.request({
					url: this.$httpUrl("/app/html/serverCenter"),
					method:"POST",
					header:{
						"content-type":"application/x-www-form-urlencoded",
						token: getApp().globalData.token
					},
					success: (res) => {
						if (res.data.code) {
							this.message=res.data.msg
							this.$refs.toast.show()
							return
						}
						var str=res.data
						var first=str.indexOf('<body>')+6;
						 var end=str.indexOf('</body>');
						this.desc=str.slice(first,end)
						
					}
				});
			},
			getPhoneCall(){
				uni.request({
					url: this.$httpUrl("/app/base/files/serviceOnline"),
					method:"POST",
					header:{
						"content-type":"application/x-www-form-urlencoded",
						token: getApp().globalData.token
					},
					success: (res) => {
						if (res.data.code === 0) {
							this.phone=res.data.phone
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

<style scoped="scss">
	.wrap{background: #fff;}
	.phone-call{
		height: 88rpx;
		background: #f0efed;
		justify-content: center;
		display: flex;
		align-items: center;
		color: #363636;
		position: fixed;
		bottom: 0;
		left: 0;width: 100%;
	}
	.phone-call .img{width: 34rpx;height: 34rpx;margin-right: 10rpx;}
</style>
