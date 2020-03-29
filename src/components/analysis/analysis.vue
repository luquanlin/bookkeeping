<template>
<div>
  <div id="tjAllHt" style="width: 100%; height: 200px;">
  </div>
  <div class="middle" >
  <div id="tjMarkZeroHt" style="width: 50%; height: 300px;">
  </div>
  <div id="tjMarkOneHt" style="width: 50%; height: 300px;">
  </div>
  </div>

 <div id="chartColumn" style="width: 100%; height: 400px;">
  </div>

</div>
</template>

<script>
import qs from "qs";
import echarts from "echarts";
export default {
  inject: ["reload"],
  data() {
    return {
      chartColumn: null,
      tjAllHt: null,
      tjMarkZeroHt: null,
      tjMarkOneHt: null
    };
  },
  mounted() {
    this.tjAllHts();
    this.tjMarkZeroHts();
    this.tjMarkOneHts();
    this.drawLine();
  },
  methods: {
    drawLine() {
      var dataZero = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      var dataOne = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      this.axios.post("/api/Bill/tjMonthZeroHt").then(res => {
        var resultZero = res.data.data;
        resultZero.forEach((item, index) => {
          console.log("month", parseInt(item.month));
          let indexZero = parseInt(item.month) - 1;
          dataZero.splice(indexZero, 1, item.money);
        });
        this.axios.post("/api/Bill/tjMonthOneHt").then(res => {
          var resultOne = res.data.data;
          resultOne.forEach((item, index) => {
            console.log("month", parseInt(item.month));
            let indexOne = parseInt(item.month) - 1;
            dataOne.splice(indexOne, 1, item.money);
          });

          console.log("dataZero", dataZero);
          console.log("dataOne", dataOne);

          this.chartColumn = echarts.init(
            document.getElementById("chartColumn")
          );

          this.chartColumn.setOption({
            title: {
              text: "高峰期统计"
            },
            tooltip: {
              trigger: "axis"
            },
            legend: {
              data: ["支出", "收入"]
            },
            grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true
            },
            toolbox: {
              feature: {
                saveAsImage: {}
              }
            },
            xAxis: {
              type: "category",
              boundaryGap: false,
              data: [
                "1月",
                "2月",
                "3月",
                "4月",
                "5月",
                "6月",
                "7月",
                "8月",
                "9月",
                "10月",
                "11月",
                "12月"
              ]
            },
            yAxis: {
              type: "value"
            },
            series: [
              {
                name: "支出",
                type: "line",

                data: dataZero
              },
              {
                name: "收入",
                type: "line",

                data: dataOne
              }
            ]
          });
        });
      });
    },
    tjAllHts() {
      var data = [];
      this.axios
        .post("/api/Bill/tjAllHt")
        .then(res => {
          let result = res.data.data;
          result.forEach(item => {
            data.push({
              name: item.type_mark == 0 ? "支出" : "收入",
              value: parseInt(item.money)
            });
          });

          console.log("data:" + data);
          this.tjAllHt = echarts.init(document.getElementById("tjAllHt"));

          this.tjAllHt.setOption({
            title: {
              text: "类别统计",
              left: "center"
            },
            tooltip: {
              trigger: "item",
              formatter: "{b} : {c} ({d}%)"
            },
            legend: {
              // orient: 'vertical',
              // top: 'middle',
              bottom: 10,
              left: "center"
            },
            series: [
              {
                type: "pie",
                radius: "65%",
                center: ["50%", "50%"],
                selectedMode: "single",
                data: data,
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)"
                  }
                }
              }
            ]
          });
        })
        .catch(error => {
          console.log("error:" + error);
        });
    },
    tjMarkZeroHts() {
      var data = [];
      this.axios
        .post("/api/Bill/tjMarkZeroHt")
        .then(res => {
          let result = res.data.data;
          result.forEach(item => {
            data.push({
              name: item.type_name,
              value: parseInt(item.money)
            });
          });

          console.log("data:" + data);
          this.tjMarkZeroHt = echarts.init(
            document.getElementById("tjMarkZeroHt")
          );

          this.tjMarkZeroHt.setOption({
            title: {
              text: "支出统计",
              left: "center"
            },
            tooltip: {
              trigger: "item",
              formatter: "{b} : {c} ({d}%)"
            },
            legend: {
              // orient: 'vertical',
              // top: 'middle',
              bottom: 10,
              left: "center"
            },
            series: [
              {
                type: "pie",
                radius: "65%",
                center: ["50%", "50%"],
                selectedMode: "single",
                data: data,
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)"
                  }
                }
              }
            ]
          });
        })
        .catch(error => {
          console.log("error:" + error);
        });
    },
    tjMarkOneHts() {
      var data = [];
      this.axios
        .post("/api/Bill/tjMarkOneHt")
        .then(res => {
          let result = res.data.data;
          result.forEach(item => {
            data.push({
              name: item.type_name,
              value: parseInt(item.money)
            });
          });

          console.log("data:" + data);
          this.tjMarkOneHt = echarts.init(
            document.getElementById("tjMarkOneHt")
          );

          this.tjMarkOneHt.setOption({
            title: {
              text: "收入统计",
              left: "center"
            },
            tooltip: {
              trigger: "item",
              formatter: "{b} : {c} ({d}%)"
            },
            legend: {
              // orient: 'vertical',
              // top: 'middle',
              bottom: 10,
              left: "center"
            },
            series: [
              {
                type: "pie",
                radius: "65%",
                center: ["50%", "50%"],
                selectedMode: "single",
                data: data,
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)"
                  }
                }
              }
            ]
          });
        })
        .catch(error => {
          console.log("error:" + error);
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.middle {
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 400px;
  display: flex;
}
</style>
