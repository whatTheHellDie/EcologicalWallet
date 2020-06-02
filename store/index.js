import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo: {
			 // "id": "用户id",
			 //         "userNumber": "会员编号",
			 //         "realName": "姓名",
			 //         "phone": "手机",
			 //         "lovebirdPoint": "Lovebird积分"
			 //         "lovebirdPointFreeze": "Lovebird积分冻结账户",
			 //         "lovebirdAccount": "TreeBank账户",
			 //          "LBPoint": "LB积分",
			 //          "LBPointFreeze": "LB积分冻结账户",
			 //          "LBAccount": "LB账户",
			 //         "portrait": "头像",
			 //         "bindingNumber" : "交易所账号"
		},
		userNumber:[],
		useAddress:{},
		showToastInInit:false,
		toastInfo:"",
		token:"",
		wallet:{}
	},
	mutations: {
		adduseWallet(state,provider){
			state.wallet=provider;
		},
		addToken(state,provider){
			state.token=provider;
			uni.setStorage({ //缓存用户登陆状态
				key: 'token',
				data: provider
			})
		},
		addToastInfo(state,provider){
			state.showToastInInit=true;
			state.toastInfo=provider;
		},
		hideToastInfo(state,provider){
			state.showToastInInit=false;
		},
		addUserAddress(state,provider){
			state.useAddress=provider;
		},
		setUserNumberStorage(state,provider) {
			state.userNumber=provider
		},
		addUserNumber(state,provider) {
			let newUserNumber=[]
			state.userNumber.forEach((item,i)=>{
				if(item!=provider[0]){
					newUserNumber.push(item)
				}
			})
			newUserNumber.unshift(provider[0])
			state.userNumber=newUserNumber
			uni.setStorage({ //缓存用户登陆状态
				key: 'userNumber',
				data: state.userNumber
			})
		},
		login(state, provider) {
			state.hasLogin = true;
			state.userInfo = provider;
			getApp().globalData.userId=state.userInfo.id;
			uni.setStorage({ //缓存用户登陆状态
				key: 'userInfo',
				data: state.userInfo
			})
			// sessionStorage.setItem("userInfo", JSON.stringify(provider));
		},
		updatePortrait(state, provider) {
			state.userInfo.portrait = provider;
			uni.setStorage({ //缓存用户登陆状态
				key: 'userInfo',
				data: state.userInfo
			})
		},
		logout(state) {
			state.hasLogin = false;
			state.userInfo = {};
			getApp().globalData.userId=state.userInfo.id;
			uni.removeStorage({
				key: 'userInfo'
			})
		}
	},
	actions: {

	}
})

export default store
