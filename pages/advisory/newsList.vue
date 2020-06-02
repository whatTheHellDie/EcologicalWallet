<template>
	<view class="wrap wrap-white">
		<sub-nav title="新闻资讯">
		</sub-nav>
		<view class="news-choosex" v-if="notSearch">
			<view class="ul">
				<view class="li" @tap="getNewsList(item.id)"  v-for="item,i in chooseList" :class="{active:id==item.id}">{{item.name}}</view>
			</view>
		</view>
		<view class="news-listx" :class="{active:!notSearch}">
			<view class="ul">
				<view class="li"  v-for="item in newsList" @tap="toNewsDetail(item.id,item.title)">
					<view class="time">{{item.publishTime}}</view>
					<image :src="item.titleImg" class="img" mode=""></image>
					<view class="title">{{item.title}}</view>
					<view class="content">
						{{item.brief}}
					</view>
				</view>
			</view>
		</view>
		<view class="no-data" v-if="newsList.length==0&&loadFinish">
			<image src="/static/ic_data_nor.png" class="img" mode=""></image>
			<view class="view">暂无数据</view>
		</view>
		<!-- <image src="/static/ic_data_nor.png" v-if="newsList.length==0&&loadFinish" class="no-data-img" mode=""></image> -->
		<toast-model :message="message" verticalAlign="bottom" ref="toast" :duration="3000"></toast-model>
	</view>
</template>

<script>
	import { mapState } from 'vuex';  
	export default {
		data(){
			return {
				message:"",
				loadFinish:false,
				keyword:"",
				infoType:"",
				notSearch:true,
				id:"",
				chooseList:[],
				newsList:[],
				pageNum:1
			}
		},
		onLoad(option) {
			
			if(option.keyword){
				this.notSearch=false
				this.keyword=option.keyword
				this.infoType=option.infoType
				this.getSearchNews()
			}else{
				this.id=option.id;
				if(option.classify){
				this.chooseList=JSON.parse(option.classify)
				}
				this.getNewsList(this.id)
			}
		},
		computed: {
			...mapState(['hasLogin','userInfo'])
		},
		methods:{
			getSearchNews(){
				uni.request({
				    url: this.$httpUrl("/app/news/searchNews"), 
					 data: {
						keyword:this.keyword,	
					    infoType: this.infoType,
						pageNum:this.pageNum,
						pageSize:20
					    },
				    success: (res) => {
				        if(res.data.code===0){
							let data=res.data.data
							this.newsList=data.list
							this.loadFinish=true
						}else{
							this.message=res.data.msg
							this.$refs.toast.show()
						}
				    }
				});
			},
			toNewsDetail(id,title){
				this.$toPage('/pages/common/externalLink?url='+this.$httpUrl("/app/news/detail?id="+id+"&title="+title+"&userId="+this.userInfo.id))
				// plus.runtime.openURL(this.$httpUrl+"/app/news/detail?id="+id)
			},
			getNewsList(id){
				this.id=id;
				uni.request({
				    url: this.$httpUrl("/app/news/newsMsgList"), 
					data: {
						id:this.id,
						pageNum:1,
						pageSize:20
					},
					header:{
						'content-type':"application/x-www-form-urlencoded"
					},
					method:"POST",
				    success: (res) => {
				        if(res.data.code===0){
							let data=res.data.data
							this.newsList=data.newsList
							this.loadFinish=true
						}else{
							this.message=res.data.msg
							this.$refs.toast.show()
						}
				    }
					});
			}
		}
	}
</script>


<style lang="scss">
@import "../../assets/scss/advisory.scss"
</style>