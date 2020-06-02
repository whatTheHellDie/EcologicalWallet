<template>
	<view>
	<view class="my-score">
		<sub-nav title="我的资产">
		</sub-nav>
		<view>
			<view class="number">{{balance}}</view>
			<view class="text">积分(TC)</view>
		</view>
	</view>
	
	<view class="list-base name-list">
		<view class="ul">
			<view class="li" v-for="item in scoreList" @tap="judge(item.title,item.type)">
				<view class="title-wrap">
				<image :src="item.img" class="img" mode=""></image>
				<text class="text">{{item.title}}</text>
				</view>
				<view>
				<text class="iconfont">&#xe603;</text>
				</view>
			</view>
	</view>
	</view>
	<toast-model :message="message" verticalAlign="bottom" ref="toast" :duration="3000"></toast-model>
	</view>
</template>

<script>
	import { mapState,mapMutations } from 'vuex';  
	export default {
		data() {
			return {
				message:"",
				balance:"",
				type:1,
				scoreList:[
					{title:"币（TB）",name:"币（TB）",type:5,img:"/static/coin/myp_pic_tb.png"},
					{title:"币（TC）",name:"币账户",type:2,img:"/static/coin/myp_pic_lovebird.png"},
					{title:"积分（TP）",name:"积分（TP）",type:6,img:"/static/coin/myp_pic_tp.png"},
					{title:"币（USDT）",name:"币（USDT）",type:3,img:"/static/coin/ic_usdt.png"},
					{title:"积分（TC）",name:"积分",type:1,img:"/static/coin/myp_pic_lb.png"},
					{title:"定存积分（TC）",name:"定存积分",type:4,img:"/static/coin/myp_pic_lb.png"},
					// {title:"玩家合约",name:"玩家合约",type:7,img:"/static/coin/contact.png"},
				]
			}
		},
		computed: {
			...mapState(['hasLogin','userInfo'])
		},
		onLoad(option){
			this.getUserInfo(getApp().globalData.userId)
		},
		methods: {
			...mapMutations(['login']),
			judge(title,type){
				if(type){
					this.$toPage('/pages/user/score?title='+title+'&type='+type)
				}else{
					this.message="敬请期待"
					this.$refs.toast.show()
				}
			},
			getUserInfo(userId){
				uni.request({
					url: this.$httpUrl("/app/base/info/userInfo"),
					data: {
						userId:this.userInfo.id
					},
					method:"POST",
					header:{
						"content-type":"application/x-www-form-urlencoded",
						token: getApp().globalData.token
					},
					success: (res) => {
						if (res.data.code === 0) {
							this.login(res.data.data)
							this.balance=this.userInfo.lovebirdPoint.toFixed(2)
						} else {
							this.message=res.data.msg
							this.$refs.toast.show() 
						}
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	.navbar{
		background: transparent;
	}
	.my-score{background: url(/static/score-bg.png);
	background-size: cover;height: 400rpx;
	padding-top: 138rpx;color: #fff;
		text-align: center;
	.number{
		font-size: 70rpx;
	}
	.text{font-size: 28rpx;margin-top: 24rpx;}
	}
	.tip-text{color: #666;line-height: 84rpx;position: relative;top: -4rpx;}
</style>
