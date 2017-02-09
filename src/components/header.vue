<template>
  <div id="header">
    <appBar :zDepth="0" :title="titleName(title)" class="appbar" :class="{'nav-hide': !open}">
      <iconButton @click="toggleNav" icon='menu' slot="left" />
      <iconButton icon='account_circle' slot="right" />
    </appBar>
    <sidebar @change="handleMenuChange" @close="toggleNav" :open="open" :docked="docked" ></sidebar>
  </div>
</template>
<script>

import appBar from "muse-components/appBar"
import iconButton from "muse-components/iconButton"
import sidebar from '../components/sidebar'
    export default{
        components: {
          appBar,
          iconButton,
          sidebar
        },
        data(){
            const desktop = isDesktop();
            return{
              open: desktop,
              docked: desktop,
              desktop: desktop,
              title: ''
            }
        },
        mounted () {
           this.routes = this.$router.options.routes
           this.setTitle()
           this.changeNav()
           this.handleResize = () => {
             this.changeNav()
           }
           window.addEventListener('resize', this.handleResize)
           window.addEventListener('hashchange', () => {
             this.setTitle()
           })
         },
        methods: {
            toggleNav () {
              this.open = !this.open
            },

            //标题转换
            titleName(title){
              let names={
                "grade":"成绩/绩点"
              };
              if(title==""){
                return "SCUPLUS";
              }
              if(names[title]){
                return names[title];
              }else{
                return "SCUPLUS";
              }
            },
            changeNav () {
              const desktop = isDesktop()
              this.docked = desktop
              if (desktop === this.desktop) return
              if (!desktop && this.desktop && this.open) {
                this.open = false
              }
              if (desktop && !this.desktop && !this.open) {
                this.open = true
              }
              this.desktop = desktop
            },
            handleMenuChange (path) {
              if (!this.desktop) this.open = false
            },
            setTitle () {
              let path = window.location.hash
              if (path && path.length > 1) path = path.substring(1)
              for (let i = 0; i < this.routes.length; i++) {
                var route = this.routes[i]
                if (route.path === path) {
                  this.title = path.substring(1) || ''
                  return
                }
              }
            }
          },
          destroyed () {
            window.removeEventListener('resize', this.handleResize)
          }
        
    }

    function isDesktop () {
      return window.innerWidth > 993
    }
</script>
<style lang="less">
    //@import "muse-components/styles"
    #header{
      .appbar{
        position: fixed;
        left: 256px;
        right: 0;
        top: 0;
        width: auto;
        transition: all .45s @easeOutFunction;
        &.nav-hide {
          left: 0;
        }
      }
    }
   

    @media (min-width: 480px) {
      .content{
        padding-top: 64px;
      }
    }
    @media (max-width: 993px) {
      .appbar {
        left: 0;
      }
      .content{
        padding-left: 0;
      }
      .content-wrapper {
        padding: 24px 36px;
      }
    }
    @easeOutFunction: cubic-bezier(0.23, 1, 0.32, 1);
    @easeInOutFunction: cubic-bezier(0.445, 0.05, 0.55, 0.95);
</style>
