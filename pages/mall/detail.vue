<template>
  <view>
    <!-- swiper -->
    <view class="detail-banner">
		<image src="/static/ic_left_o@2x.png" class="back" mode="" @tap="$back"></image>
      <swiper class="swiper-slide"  circular :indicator-dots="true"
	   :autoplay="true" v-if="swiperSlides.length>0" :interval="3000" :duration="400"
		 indicator-active-color="rgba(0,0,0,.8)">
      	<swiper-item v-for="(item,index) in swiperSlides">
      		<view><image class="img" :src="item"></image></view>
      	</swiper-item>
      </swiper>
	  <image src="/static/placeholder.png" v-if="swiperSlides.length==0" class="img" mode=""></image>
      <!-- <view class="custom-page">{{realIndex+1}}/{{swiperSlides.length}}</view> -->
    </view>
    <view class="price-tab">
      <view class="price">
        <img :src="currency" class="coin" alt="" /><text class="money">{{price}}</text>
		<!-- <view class="rule" @tap="$toPage(`/pages/common/externalLink?url=${item.jumpDestination}&title=额度赠送与使用规则`)">额度赠送与使用规则</view> -->
      </view>
	  <!-- <view class="present" v-if="candies">购买可额外赠送等价值{{candies}}额度</view> -->
      <view class="name">{{productName}}</view>
      <view class="express">快递: {{expressFee}}</view>
    </view>
    <view class="choose-item" @tap="server=true">
      <text class="span">售后服务</text>服务说明
    </view>
    <view class="choose-item" @tap="beChoose">
      <text class="span">选择</text><text class="chima" v-if="!chima1">请选择尺码</text>
	  <text class="chima" v-if="chima1">{{chima1}}</text><text class="chima" v-if="chima1">{{chima2}}</text>
    </view>
    <view class="detail-intro">
      <view class="title"><text class="span">详情</text></view>
      <view class="top">详情介绍</view>
      <view class="content">
		  <!-- <rich-text :nodes="desc"></rich-text> -->
		 <!-- <iframe :src="detailUrl" class="iframe" ref="iframe" frameborder="0"></iframe> -->
		 <u-parse :content="desc" @preview="preview"  />
	  </view>
    </view>
    <view class="context-shadow" v-if="showList||server" @tap="hideChosen"></view>
    <view class="bottom-box">
      <view class="btn" @tap="showList=true;alreadyOpen=true">立即购买</view>
    </view>
    <view class="bottom-slide" :class="{active:showList}">
      <view class="close" @tap="showList=false"></view>
      <img :src="specification" alt="" class="img" />
      <view class="right">
		  <view class="view">
        <view>
			<img :src="currency" alt="" class="coin" />
			<text class="money">{{price}}</text>
		</view>
        <view class="type">{{categoryName}}:{{type}}</view>
        <view class="type" v-if="categoryNameB">{{categoryNameB}}:{{typeB}}</view>
		</view>
      </view>
      <view class="type-list-wrap">
        <view class="type-list">
          <view class="title">{{categoryName}}</view>
          <view class="ul">
            <view class="li" v-for="item,i in specList"
			 :class="{active:i===typeActive}" @tap="addActive(item,i)">{{item.name}}</view>
          </view>
        </view>
        <view class="type-list" v-if="categoryNameB">
          <view class="title">{{categoryNameB}}</view>
          <view class="ul">
            <view class="li" v-for="item,i in specListB" :class="{active:i===typeBActive}" @tap="addBActive(item,i)">{{item.name}}</view>
          </view>
        </view>
      </view>
      <view class="buy-number">
        <text class="span">购买数量</text>
        <view class="compute">
          <img src="/static/ic_selection_information_minus@2x.png" @tap="reduce" class="reduce" />
          <input type="text" v-model="buyNumber" @blur="blurNumber" class="number" />
          <img src="/static/ic_selection_information_plus@2x.png" @tap="add" alt="" class="reduce" />
        </view>
      </view>
      <view class="btn" @tap="toConfirm">确认</view>
      
    </view>
  <view class="pei clearfix" :class="{active:server}">
      <view class="name">
        服务说明<img src="/static/ic_close-circle@2x.png" alt="" onclick="window.history.back()" class="close" />
      </view>
      <view class="content-wrap">
        <view class="need clearfix">
          <img src="/static/zheng1.png" class="left"/>
          <view class="right">
            <view class="title">关于正品</view>
            <view class="content">本商城会根据您的收货地址自动为您匹配发货 仓库及快递公司，暂不接受指定快递派送，感 谢您的支持与理解。</view>
          </view>
        </view>
        
        <view class="need clearfix" style="margin-top: .3rem;">
          <img src="/static/weixiu_icon@3x.png" class="left"/>
          <view class="right">
            <view class="title">关于退换货</view>
            <view class="content">产品一旦发货不支持退换货；若产品在运输过程中发生损坏、缺失等问题了联系客服协商解决<br />客服热线:400 086 2860
            
            </view>
          </view>
        </view>
        <view class="need clearfix" style="margin-top: .3rem;">
          <img src="/static/mianze_icon@3x.png" class="left"/>
          <view class="right">
            <view class="title">免责条款</view>
            <view class="content">订单付款后7天内发货，节假日、物流管制等特殊情况顺延。</view>
          </view>
        </view>
        <view class="need clearfix" style="margin-top: .3rem;">
          <img src="/static/fapiao_icon@3x.png" class="left"/>
          <view class="right">
            <view class="title">关于发票</view>
            <view class="content">使用数字资产购物暂不纳入国家发票系统，暂不提供发票，敬请谅解</view>
          </view>
        </view>
      </view>
      <view class="btn" @tap="server=false">确认</view>
    </view>
      <toast-model :message="message" verticalAlign="bottom" ref="toast" :duration="3000"></toast-model>
  </view>
</template>

<script>
	import { mapState,mapMutations } from 'vuex';  
	import uParse from '@/components/gaoyia-parse/parse.vue'
  export default {
	  components:{
	  	uParse
	  },
    data() {
      return {
		  message:"",
		  candies:"",
        server:false,
        showList:false,
        buyNumber:1,
        typeActive:null,
		typeBActive:null,
		currency:"",
		price:"",
        specList: [],
		specListB:[],
        type: "请选择",
        typeB: "请选择",
        expressFee: "免邮",
        productName: "",
        realIndex: null,
        swiperSlides: [],
		detailUrl:"",
		categoryName:"",
		categoryNameB:"",
		desc:"",
		specification:"/static/placeholder.png",
		chima1:"",
		chima2:"",
		alreadyOpen:false,
		infoData:{},
		inventory:0, //库存
		payWay:""
      }
    },
	computed: {
		...mapState(['hasLogin','userInfo','showToastInInit','toastInfo'])
	},
	onLoad(option) {
		this.id=option.id
		this.getDetail()
		this.getDefaultSpecA()
		
	},
    methods: {
		preview(src, e) {
		      // do something
		    },
		toConfirm(){
			if(this.categoryName&&this.categoryNameB){
				if(this.typeActive===null){
					this.message="请选择"+this.categoryName
					this.$refs.toast.show()
					return;
				}else if(this.typeBActive===null){
					this.message="请选择"+this.categoryNameB
					this.$refs.toast.show()
					return ;
				}
			}
			if(this.buyNumber>this.inventory){
				this.message="库存不足"
				this.$refs.toast.show()
				return ;
			}
			var confirmData=JSON.stringify({
				currency:this.currency,
				infoData:this.infoData,
				buyNumber:this.buyNumber,
				price:this.price,
				specList: this.specList,
				specListB:this.specListB,
				typeActive:this.typeActive,
				typeBActive:this.typeBActive,
				type: this.type,
				typeB: this.typeB,
				expressFee: this.expressFee,
				productName: this.productName,
				categoryName:this.categoryName,
				categoryNameB:this.categoryNameB,
				specification:this.specification,
				chima1:this.chima1,
				chima2:this.chima2,
				payWay:this.payWay
			})
			if(this.hasLogin){
				// if(this.payWay==2){
					this.$toPage(`/pages/mall/confirmOrder?confirmData=${confirmData}`)
				// }else if(this.payWay==7){
				// 	this.message="BTC支付敬请期待"
				// 	this.$refs.toast.show()
				// }
			}else{
				this.$toPage("/pages/user/login")
			}
		},
		beChoose(){
			this.showList=true;
			this.alreadyOpen=true;
		},
		addBActive(item,i){
		  this.typeBActive=i;
		  this.typeB=this.specListB[i].name
		  this.price=this.specListB[i].price
		  this.inventory=this.specListB[i].inventory;
		  this.chima2=item.name;
		},
		addActive(item,i){
		  this.typeActive=i;
		  this.type=this.specList[i].name
		  this.price=this.specList[i].price
			this.inventory=this.specList[i].inventory;
		  if(item.imgUrl){
		  this.specification=item.imgUrl
		  }else{
			  this.specification="/static/placeholder.png"
		  }
		  if(this.alreadyOpen){
			this.chima1=item.name;
		  }
		  this.getBSpecListByAspecId(this.specList[i].id)
		},
		getBSpecListByAspecId(id){
			uni.request({
				url: this.$httpUrl("/app/index/product/getBSpecListByAspecId"),
				data: {
					AspecId:id,
				},
				method:"POST",
				header:{
					"content-type":"application/x-www-form-urlencoded"
				},
				success: (res) => {
					if (res.data.code === 0) {
						var data=res.data.data
								this.categoryNameB=data.categoryName
								this.specListB=data.specList
					} else {
						this.message=res.data.msg
						this.$refs.toast.show()
					}
				}
			});
		},
	  getDefaultSpecA(){
		  uni.request({
		  	url: this.$httpUrl("/app/index/product/defaultSpecA"),
		  	data: {
		  		goodsId:this.id,
		  	},
		  	method:"POST",
		  	header:{
		  		"content-type":"application/x-www-form-urlencoded"
		  	},
		  	success: (res) => {
		  		if (res.data.code === 0) {
		  			var data=res.data.data
					this.categoryName=data.categoryName
					this.specList=data.specList;
					this.getBSpecListByAspecId(this.specList[0].id)
		  		} else {
		  			this.message=res.data.msg
		  			this.$refs.toast.show()
		  		}
		  	}
		  });
	  },
	  getDesc(){
		  uni.request({
		  	url: this.detailUrl,
		  	// data: {
		  	// 	goodsId:this.id,
		  	// 	userId:getApp().globalData.userId?getApp().globalData.userId:"",
		  	// },
		  	// method:"POST",
		  	// header:{
		  	// 	"content-type":"application/x-www-form-urlencoded"
		  	// },
		  	success: (res) => {
				var str=res.data
				
				var first=str.indexOf('<body>')+6;
				 var end=str.indexOf('</body>');
				this.desc=str.slice(first,end)
				 console.log(this.desc)
		  		// if (res.data.code === 0) {
		  			
		  		// } else {
		  		// 	uni.showModal({
		  		// 		content: res.data.msg
		  		// 	});
		  		// }
		  	}
		  });
	  },
	  getDetail(){
		  uni.request({
		  	url: this.$httpUrl("/app/index/product/detail"),
		  	data: {
		  		goodsId:this.id,
		  		userId:getApp().globalData.userId?getApp().globalData.userId:"",
		  	},
		  	method:"POST",
		  	header:{
		  		"content-type":"application/x-www-form-urlencoded",
				token: getApp().globalData.token
		  	},
		  	success: (res) => {
		  		if (res.data.code === 0) {
		  			var data=res.data.data;
					this.infoData=data
					this.swiperSlides=data.bannerImgUrls;
					this.payWay=data.currency==1?2:7;//7为比特币
					this.currency=this.$getCoinImg(data.currency)
					this.price=data.price
					this.productName=data.productName
					this.expressFee=data.expressFee
					this.detailUrl=data.detailUrl
					this.candies=data.candies
					this.getDesc()
		  		} else {
		  			this.message=res.data.msg
		  			this.$refs.toast.show()
		  		}
		  	}
		  });
	  },
      hideChosen(){
        this.showList=false
        this.server=false
      },
       blurNumber(){
        this.buyNumber=this.buyNumber===""?1:this.buyNumber
      },
      add(){
        this.buyNumber++
      },
      reduce(){
        if(this.buyNumber===1){return;}
        this.buyNumber--
      },
     
    },
	watch:{
	  buyNumber(val,oldVal){
	    if(val==""){
	      return ;
	    }
	    if(isNaN(Number(val))){
	      this.buyNumber=oldVal
	    }
	    if(val<1){
	      this.buyNumber=1
	    }
	  }
	},
  }
</script>

<style lang="scss">
@import "../../assets/scss/mall.scss";
@import "../../components/gaoyia-parse/parse.css";
.iframe{width: 100%;height: 100%;height: 1300rpx;}
</style>