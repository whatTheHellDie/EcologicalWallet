<template>
	<view class="custom-tabbar">
		<view class="tab" v-for="item,i in tabbar" @tap="$toPage1(item.path)">
			<image :src="index==i?item.activeImg:item.img" class="img" mode=""></image>
			<view class="name" :class="{active:index==i}">{{item.name}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabbar:[
					{img:"/static/tab-home.png",activeImg:"/static/tab-home-current.png",name:"首页",path:"/pages/index/index"},
					{img:"/static/tab-cate.png",activeImg:"/static/tab-cate-current.png",name:"资产",path:"/pages/property/property"},
					{img:"/static/tab-cart.png",activeImg:"/static/tab-cart-current.png",name:"资讯",path:"/pages/advisory/advisory"},
					{img:"/static/tab-college.png",activeImg:"/static/tab-college-current.png",name:"学院",path:"/pages/advisory/college"},
					{img:"/static/tab-my.png",activeImg:"/static/tab-my-current.png",name:"我的",path:"/pages/user/user"},
				]
					}
			},
			props:["index"]
	}
</script>

<style>
</style>
