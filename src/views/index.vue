<template>
  <div class="view-content" v-loading="loading" element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)">
    <div style="margin-top: 0px;text-align: center">
      <el-input placeholder="请输入内容" v-model="entity" style="width: 80vh;">
        <el-button slot="append" icon="el-icon-search" @click="find()"></el-button>
      </el-input>
    </div>
    <div style="width:auto;height:96vh;" ref="chart"  ></div>
  </div>
</template>

<script>
const echarts = require('echarts');
export default {
  name: "index",
  data(){
    return{
      loading:true,
      node:[],
      link:[],
      categories:[{
        "name": "主体"
      },
        {
          "name": "属性"
        }],
      entity:"胡歌"
    }
  },
  mounted() {
    this.drawLine();
  },
  beforeRouteEnter: (to, from, next) => {
    console.log('进入路由之前')
    // 进入路由之前执行getData
    next(vm => {

      vm.getData()
    })
  },
  methods: {
    find(){
      this.loading=true
      this.axios({
        method: 'post',
        url: '/api/index/find',
        data:{"entity":this.entity}
      }).then(res => {
            console.log(res.data)
        if(res.data.code=="601"){
        this.node=res.data.nodes
        this.link=res.data.links
        let myChart = echarts.init(this.$refs.chart);
        // 绘制图表配置
        myChart.setOption({
          tooltip:{
            trigger : 'item',

            formatter : function(params) {
              //我这里用不到返回值，因此只有params一个参数
              //params的含义看后文的说明。
              //attribute是我给关系边自定义的一个参数
              //所以params.data.name只有在关系边里才存在
              if (params.data.value) {
                //如果这个数据有name参数，那么返回name参数的内容
                //这个内容就是提示时显示的内容。
                return params.data.value;
              } else {
                //否则显示name参数的内容。
                //在关系图里，能进到这里的数据项，应该只有节点和关系两种，所以不是关系就只能是节点……
                return params.data.name;
              }
            }},
          legend: [{
            // selectedMode: 'single',
            data: this.categories.map(function (a) {
              return a.name;
            })
          }],
          series: [
            {

              type: 'graph',
              layout: 'force',
              data: this.node,
              links: this.link,
              categories:this.categories,
              roam: true,
              label: {
                position: 'right'
              },
              force: {
                repulsion: 100
              }
            }
          ]
        })
        }
        else if(res.data.code=="602"){
          this.$message({
            showClose: true,
            message: '无此信息',
            type: 'error'
          });
        }
        this.loading=false
      })
    },
    getData(){
   this.loading=true
      this.axios({
        method: 'post',
        url: '/api/index/find',
        data:{"entity":this.entity}
      }).then(res => {
console.log(res.data)
        if(res.data.code=="601"){
      this.node=res.data.nodes
        this.link=res.data.links
            let myChart = echarts.init(this.$refs.chart);
            // 绘制图表配置
            myChart.setOption({
              tooltip:{
                trigger : 'item',
                formatter : function(params) {
                  //我这里用不到返回值，因此只有params一个参数
                  //params的含义看后文的说明。
                  //attribute是我给关系边自定义的一个参数
                  //所以params.data.name只有在关系边里才存在
                  if (params.data.value) {
                    //如果这个数据有name参数，那么返回name参数的内容
                    //这个内容就是提示时显示的内容。
                    return params.data.value;
                  } else {
                    //否则显示name参数的内容。
                    //在关系图里，能进到这里的数据项，应该只有节点和关系两种，所以不是关系就只能是节点……
                    return params.data.name;
                  }
                }},
              legend: [{
                // selectedMode: 'single',
                data: this.categories.map(function (a) {
                  return a.name;
                })
              }],
              series: [
                {

                  type: 'graph',
                  layout: 'force',
                  data: this.node,
                  links: this.link,
                  categories:this.categories,
                  roam: true,
                  label: {
                    position: 'right'
                  },
                  force: {
                    repulsion: 100
                  }
                }
              ]
            })}
        else if(res.data.code=="602"){
          this.$message({
            showClose: true,
            message: '无此信息',
            type: 'error'
          })}
        this.loading=false
      })
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(this.$refs.chart);
      let self=this
      // 绘制图表配置
      myChart.setOption({
        title: {
          top: 'bottom',
          left: 'right'
        },
        tooltip: {
          trigger: 'axis',
          confine: true,
          // 分别设置四个方向的内边距
          padding: [
            10,  // 上
            30, // 右
            10,  // 下
            30, // 左
          ],
        },
        legend: [{
          // selectedMode: 'single',
          // data: [].categories.map(function (a) {
          //   return a.name;
          // })
        }],
        series: [
          {
            type: 'graph',
            layout: 'force',
            data: [],
            links: [],
            categories:[],
            roam: true,
            draggable: false,//这里设置为false，不然拖拽鼠标和节点有偏移
            focusNodeAdjacency: false,  // 是否在鼠标移到节点上的时候突出显示节点以及节点的边和邻接节点, 默认是true
            symbolSize:30,
            label: {
              position: 'right',
              show:true
            },
            force: {
              repulsion: 100,
              layoutAnimation: true,//关闭旋转
              gravity:0.1,//重力
              friction:0.6,//摩擦力
              edgeLength:[200,350],//长度
            }
          }
        ]
      })
    //点击事件
      myChart.on('click', function (params){
        if (params.componentType === 'series') {
          console.log(params.data)
          self.entity=params.data.name
         self.getData()
        }
      })
    }
  }
};

</script>

<style scoped>

</style>
