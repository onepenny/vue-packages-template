<template>
  <div>
    <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
    <div id="main" style="width: 600px;height:400px;"></div>
    <div id="main2" style="width: 600px;height:400px;"></div>
    <div id="main3" style="width: 600px;height:400px;"></div>
    <div id="main5" style="width: 600px;height:400px;"></div>
    <div id="main4" style="width: 600px;height:400px;"></div>
    <div id="main6" style="width: 600px;height:400px;"></div>
  </div>
</template>
<script>
import echarts from 'echarts';

function draw(id, options) {
  let myChart = echarts.init(document.getElementById(id));
  myChart.setOption(options);
  return myChart;
}

export default {
  name: 'TestEcharts',
  mounted() {
    // #1
    var myChart = echarts.init(document.getElementById('main'));

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      legend: {
        data: ['销量']
      },
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }
      ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

    // #2 https://echarts.baidu.com/examples/editor.html?c=pictorialBar-dotted
    // Generate data
    var category = [];
    var lineData = [10000, 15000, 40000, 35000, 20000];
    var lineData2 = [10000, 15000, 40000, 35000, 20000];
    // let topLineData = [40000, 40000, 40000, 40000, 40000];

    let categoryNames = ['萌芽期', '成长期', '成熟期', '流失期', '长尾期'];
    for (var i = 0; i < 5; i++) {
      // var date = new Date(dottedBase += 3600 * 24 * 1000);
      // category.push([
      //   date.getFullYear(),
      //   date.getMonth() + 1,
      //   date.getDate()
      // ].join('-'));
      category.push(categoryNames[i]);
    }

    let myChart2 = echarts.init(document.getElementById('main2'));
    // option
    let option2 = {
      backgroundColor: '#0f375f',
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['line1'],
        textStyle: {
          color: '#ccc'
        }
      },
      xAxis: {
        name: 'x1',
        data: category,
        // position: 'bottom',
        // axisPointer: {
        //   triggerTooltip: false,
        // },
        axisLine: {
          onZero: false,
          lineStyle: {
            color: '#ccc'
          }
        }
        // splitArea: {show:true},
        // splitLine: {show:true},
      },
      yAxis: [
        {
          name: 'y1',
          type: 'value',
          splitLine: { show: false },
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
          }
        },
        {
          name: 'y2',
          type: 'value',
          splitLine: { show: false },
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
          },
          axisLabel: {
            formatter: function(v) {
              return -v;
            }
          }
        }
      ],
      series: [
        {
          name: 'line1',
          type: 'line',
          smooth: true,
          showAllSymbol: true,
          symbol: 'emptyCircle',
          symbolSize: 10,
          data: lineData,
          markArea: {
            data: [
              [
                {
                  name: '早高峰',
                  xAxis: '萌芽期'
                },
                {
                  xAxis: '成长期'
                }
              ],
              [
                {
                  name: '晚高峰',
                  xAxis: '成长期 '
                },
                {
                  xAxis: '成熟期'
                }
              ]
            ]
          },

          areaStyle: {
            // type: 'default',
            // origin: 'auto',
            // smooth: true,
            color: 'red'
            // normal:{
            //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
            // color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            //
            //
            //   offset: 0,
            //   color: '#FFC400'
            // }, {
            //   offset: .34,
            //   color: '#ffde70'
            // },{
            //   offset: 1,
            //   color: '#fff4cf'
            // }])
            // }
          }
        },
        {
          name: 'y2',
          type: 'line',
          // xAxisIndex: 1,
          yAxisIndex: 1,
          smooth: true,
          showAllSymbol: true,
          symbol: 'emptyCircle',
          // symbolSize: 10,
          data: lineData2,
          areaStyle: {
            // type: 'default',
            // origin: 'start',
            // smooth: true,
            color: 'transparent'
          }
        }
      ]
    };
    myChart2.setOption(option2);

    // #3
    let option3 = (option = {
      title: {
        text: '雨量流量关系图',
        subtext: '数据来自西安兰特水电测控技术有限公司',
        x: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // type: 'line',
          type: 'shadow'
        },
        formatter: function(params) {
          return (
            params[0].name +
            '<br/>' +
            params[0].seriesName +
            ' : ' +
            params[0].value +
            ' (m^3/s)<br/>' +
            params[1].seriesName +
            ' : ' +
            -params[1].value +
            ' (mm)'
          );
        }
      },
      legend: {
        data: ['流量', '降雨量'],
        x: 'left'
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      dataZoom: {
        show: true,
        realtime: true,
        start: 0,
        end: 100
      },
      xAxis: [
        {
          type: 'category',
          // boundaryGap: false,
          axisLine: { onZero: false },
          data: ['萌芽期', '成长期', '成熟期', '流失期', '长尾期']
        }
      ],
      yAxis: [
        {
          name: '流量(m^3/s)',
          type: 'value',
          min: 0,
          max: 500
        },
        {
          name: '降雨量(mm)',
          type: 'value',
          min: -500,
          max: 0,
          axisLabel: {
            formatter: function(v) {
              return -v;
            }
          }
        }
      ],
      series: [
        {
          name: '流量',
          type: 'line',
          smooth: true,
          itemStyle: { normal: { areaStyle: { type: 'default' } } },
          data: [200, 300, 400, 200, 100],
          markArea: {
            data: [
              [
                {
                  itemStyle: {
                    color: 'red'
                  },
                  name: '早高峰',
                  xAxis: '萌芽期'
                },
                {
                  xAxis: '成长期'
                }
              ],
              [
                {
                  itemStyle: {
                    color: 'green'
                  },
                  name: '早高峰2',
                  xAxis: '成长期'
                },
                {
                  xAxis: '成熟期'
                }
              ],
              [
                {
                  itemStyle: {
                    color: 'yellow'
                  },
                  name: '早高峰3',
                  xAxis: '成熟期'
                },
                {
                  xAxis: '流失期'
                }
              ],
              [
                {
                  itemStyle: {
                    color: 'blue'
                  },
                  name: '早高峰3',
                  xAxis: '流失期'
                },
                {
                  xAxis: '长尾期'
                }
              ]
            ]
          }
        },
        {
          name: '降雨量',
          type: 'line',
          smooth: true,
          yAxisIndex: 1,
          itemStyle: {
            normal: {
              areaStyle: { type: 'default', color: '#fff', opacity: 1 }
            }
          },
          data: (function() {
            var oriData = [
              500 - 200,
              500 - 300,
              500 - 400,
              500 - 200,
              500 - 100
            ];
            var len = oriData.length;
            while (len--) {
              oriData[len] *= -1;
            }
            return oriData;
          })()
        }
      ]
    });

    let figure3 = draw('main3', option3);
    figure3.getZr().on('click', function(params) {
      var pointInPixel = [params.offsetX, params.offsetY];
      if (figure3.containPixel('grid', pointInPixel)) {
        /*此处添加具体执行代码*/

        var pointInGrid = figure3.convertFromPixel(
          { seriesIndex: 0 },
          pointInPixel
        );
        //X轴序号
        var xIndex = pointInGrid[0];

        //获取当前图表的option
        var op = figure3.getOption();

        //获得图表中我们想要的数据
        var data = op.xAxis[0].data[xIndex];
        console.log('点击选中', data);
      }
    });

    this.draw4();
    this.draw5();
    this.draw6();
  },
  methods: {
    draw4() {
      // Generate data
      var category = [];
      var dottedBase = +new Date();
      var lineData = [];
      var barData = [];

      for (var i = 0; i < 20; i++) {
        var date = new Date((dottedBase += 3600 * 24 * 1000));
        category.push(
          [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-')
        );
        var b = Math.random() * 200;
        var d = Math.random() * 200;
        barData.push(b);
        lineData.push(d + b);
      }

      // option
      let option = {
        backgroundColor: '#0f375f',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['line', 'bar'],
          textStyle: {
            color: '#ccc'
          }
        },
        xAxis: {
          data: category,
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
          }
        },
        yAxis: {
          splitLine: { show: false },
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
          }
        },
        series: [
          {
            name: 'line',
            type: 'line',
            smooth: true,
            showAllSymbol: true,
            symbol: 'emptyCircle',
            symbolSize: 15,
            data: lineData
          },
          {
            name: 'bar',
            type: 'bar',
            barWidth: 10,
            itemStyle: {
              normal: {
                barBorderRadius: 5,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#14c8d4' },
                  { offset: 1, color: '#43eec6' }
                ])
              }
            },
            data: barData
          },
          {
            name: 'line',
            type: 'bar',
            barGap: '-100%',
            barWidth: 10,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: 'rgba(20,200,212,0.5)' },
                  { offset: 0.2, color: 'rgba(20,200,212,0.2)' },
                  { offset: 1, color: 'rgba(20,200,212,0)' }
                ])
              }
            },
            z: -12,
            data: lineData
          },
          {
            name: 'dotted',
            type: 'pictorialBar',
            symbol: 'rect',
            itemStyle: {
              normal: {
                color: '#0f375f'
              }
            },
            symbolRepeat: true,
            symbolSize: [12, 4],
            symbolMargin: 1,
            z: -10,
            data: lineData
          }
        ]
      };
      let figure = draw('main4', option);
      figure.getZr().on('click', function(params) {
        var pointInPixel = [params.offsetX, params.offsetY];
        if (figure.containPixel('grid', pointInPixel)) {
          /*此处添加具体执行代码*/

          var pointInGrid = figure.convertFromPixel(
            { seriesIndex: 0 },
            pointInPixel
          );
          //X轴序号
          var xIndex = pointInGrid[0];

          //获取当前图表的option
          var op = figure.getOption();

          //获得图表中我们想要的数据
          var data = op.xAxis[0].data[xIndex];
          console.log('点击选中', data);
        }
      });
    },
    draw5() {
      let option = {
        title: {
          text: '雨量流量关系图',
          subtext: '数据来自西安兰特水电测控技术有限公司',
          x: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line'
          },
          formatter: function(params) {
            return (
              params[0].name +
              '<br/>' +
              params[0].seriesName +
              ' : ' +
              params[0].value +
              ' (m^3/s)<br/>' +
              params[1].seriesName +
              ' : ' +
              -params[1].value +
              ' (mm)'
            );
          }
        },
        legend: {
          data: ['流量', '降雨量'],
          x: 'left'
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        dataZoom: {
          show: true,
          realtime: true,
          start: 0,
          end: 100
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLine: { onZero: false },
            data: ['萌芽期', '成长期', '成熟期', '流失期', '长尾期']
          }
        ],
        yAxis: [
          {
            name: '流量(m^3/s)',
            type: 'value',
            min: 0,
            max: 500
          },
          {
            name: '降雨量(mm)',
            type: 'value',
            min: -500,
            max: 0,
            axisLabel: {
              formatter: function(v) {
                return -v;
              }
            }
          }
        ],
        series: [
          {
            name: '流量',
            type: 'line',
            smooth: true,
            itemStyle: { normal: { areaStyle: { type: 'default' } } },
            data: [200, 300, 400, 200, 100],
            markArea: {
              data: [
                [
                  {
                    itemStyle: {
                      color: 'red'
                    },
                    name: '早高峰',
                    xAxis: '萌芽期'
                  },
                  {
                    xAxis: '成长期'
                  }
                ],
                [
                  {
                    itemStyle: {
                      color: 'green'
                    },
                    name: '早高峰2',
                    xAxis: '成长期'
                  },
                  {
                    xAxis: '成熟期'
                  }
                ],
                [
                  {
                    itemStyle: {
                      color: 'yellow'
                    },
                    name: '早高峰3',
                    xAxis: '成熟期'
                  },
                  {
                    xAxis: '流失期'
                  }
                ],
                [
                  {
                    itemStyle: {
                      color: 'blue'
                    },
                    name: '早高峰3',
                    xAxis: '流失期'
                  },
                  {
                    xAxis: '长尾期'
                  }
                ]
              ]
            }
          },
          {
            name: '降雨量',
            type: 'line',
            smooth: true,
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                areaStyle: { type: 'default', color: '#fff', opacity: 1 }
              }
            },
            data: (function() {
              var oriData = [
                500 - 200,
                500 - 300,
                500 - 400,
                500 - 200,
                500 - 100
              ];
              var len = oriData.length;
              while (len--) {
                oriData[len] *= -1;
              }
              return oriData;
            })()
          }
        ]
      };

      draw('main5', option);
    },
    draw6() {
      // let app.title = '多 Y 轴示例';

      var colors = ['#5793f3', '#d14a61', '#675bba'];

      let option = {
        color: colors,

        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        grid: {
          right: '20%'
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: ['蒸发量', '降水量', '平均温度']
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            data: [
              '1月',
              '2月',
              '3月',
              '4月',
              '5月',
              '6月',
              '7月',
              '8月',
              '9月',
              '10月',
              '11月',
              '12月'
            ]
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '蒸发量',
            min: 0,
            max: 250,
            position: 'right',
            axisLine: {
              lineStyle: {
                color: colors[0]
              }
            },
            axisLabel: {
              formatter: '{value} ml'
            }
          },
          {
            type: 'value',
            name: '降水量',
            min: 0,
            max: 250,
            position: 'right',
            offset: 80,
            axisLine: {
              lineStyle: {
                color: colors[1]
              }
            },
            axisLabel: {
              formatter: '{value} ml'
            }
          },
          {
            type: 'value',
            name: '温度',
            min: 0,
            max: 25,
            position: 'left',
            axisLine: {
              lineStyle: {
                color: colors[2]
              }
            },
            axisLabel: {
              formatter: '{value} °C'
            }
          }
        ],
        series: [
          {
            name: '蒸发量',
            type: 'bar',
            barWidth: 60,
            data: [
              2.0,
              4.9,
              7.0,
              23.2,
              25.6,
              76.7,
              135.6,
              162.2,
              32.6,
              20.0,
              6.4,
              3.3
            ]
          },

          {
            name: '平均温度',
            type: 'line',
            yAxisIndex: 2,
            data: [
              2.0,
              2.2,
              3.3,
              4.5,
              6.3,
              10.2,
              20.3,
              23.4,
              23.0,
              16.5,
              12.0,
              6.2
            ]
          }
        ]
      };

      draw('main6', option);
    }
  }
};
</script>
