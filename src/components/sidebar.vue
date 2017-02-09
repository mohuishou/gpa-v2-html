<template>
<div id="sidebar">
	<mu-drawer :open="open" @close="handleClose" :zDepth="0" :docked="docked">
		<appBar class="appBar"  :zDepth="0" title="导航" >
    </appBar>
    <mu-list :value="value" @change="handleChange">
      <mu-list-item value="index" title="选课助手"/>
      <mu-list-item value="2" title="搜索课程"/>
      <mu-list-item value="3" title="空闲教室"/>
      <mu-list-item value="4" title="教务处" toggleNested>
      	<mu-list-item value="5"  slot="nested"   title="课表" />
      	<mu-list-item href="/#/grade" value="grade" slot="nested"    title="成绩" />
      	<mu-list-item value="7" slot="nested"   title="评教" />
      </mu-list-item>
      <mu-list-item value="8" title="图书馆" toggleNested>
      	<mu-list-item value="9"  slot="nested"   title="当前借阅" />
      	<mu-list-item value="10" slot="nested"   title="历史借阅" />
      </mu-list-item>
    </mu-list>
  </mu-drawer>
</div>
	
</template>

<script>
	import {list,listItem} from "muse-components/list"
	import drawer from "muse-components/drawer"
	import appBar from "muse-components/appBar"
	import iconButton from "muse-components/iconButton"
	export default{
		props: {
    open: {
      type: Boolean,
      default: true
    },docked: {
      type: Boolean,
      default: true
    }},
		components:{
			"mu-list":list,
			"mu-list-item":listItem,
			"mu-drawer":drawer,
			iconButton,
			appBar
		},
		data () {
		    return {
		    	value:"index"
		    }
		  },
		  mounted () {
		  		this.handleInit()
		  },
		  methods: {
		    handleClose () {
         this.$emit('close')
       	},
       	handleChange (val) {
          this.value = val
        },
        handleInit(){
        	let path = window.location.hash;
        	path = path.substring(2);
          if (path && path.length > 1){
	          this.value=path;
	        }
        }
		  }
	}	
</script>

<style lang="less">
	#sidebar{
		.appBar{
			background: #fafafa;
			color: #212121;
		}
	}
</style>

