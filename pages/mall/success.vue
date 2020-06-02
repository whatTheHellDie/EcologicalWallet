<template>
  <div class="wrap wrap-white">
	  <mall-nav title="订单详情"> </mall-nav>
    <div class="success-group">
      <img class="img" src="/static/ic_success@2x.png"/>恭喜您，订单支付成功
      <div class="content"><div class="div div1" @tap="back">返回商城</div><div class="div div1" @tap="toOrder">查看订单</div></div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
		  id:"",
      }
    },
	onLoad(option) {
		this.id=option.id
		
	},
    methods: {
		toOrder(){
			this.$toPage(`/pages/mall/orderDetail?id=${this.id}`)
		},
		back(){
			uni.getStorage({
			    key: 'mallType',
				success:(res)=>{
					console.log(res)
					this.$toPage('/pages/mall/index?type='+res.data)
				}
			});
			
		}
	}
  }
</script>


<style lang="scss">
@import "../../assets/scss/mall.scss"
</style>