## echarts的点击事件

- 举例

- ```js
  // 使用getZr()添加图表的整个canvas区域的点击事件，并获取params携带的信息
  this.ringFlag &&
    this.chart.getZr().on('click', params => {
      // 获取鼠标点击的位置
      const pointInPixel = [params.offsetX, params.offsetY];
      // 过滤掉点击位置在绘制图形的网格外的点击事件
      if (this.chart.containPixel('grid', pointInPixel)) {
        // 判断坐标轴是否垂直
        const index = !this.axisVertical ? 0 : 1;
        // 获取点击位置对应的x轴数据的索引值
        const xIndex = this.chart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[index];
        var op = this.chart.getOption();
        const data = !this.axisVertical ? op.xAxis[0].data[xIndex] : op.yAxis[0].data[xIndex];
        this.$emit('clickBoxShadow', data);
      }
    });
  }
  ```


