# PointsBuild
PointsBuild前端点位辅助创建工具，简单来说就是帮助大家获取屏幕上的点位坐标，能够格式化输出，省略大家一步步反复调试
![image](https://user-images.githubusercontent.com/52529445/157577263-9b366c49-a04c-4e27-aa95-364e89d63e4d.png)
![image](https://user-images.githubusercontent.com/52529445/157577318-26cacecd-0559-4795-a42d-b336c26be282.png)

替代了原先在代码上一个个写定位然后在浏览器上面调坐标的方式，直接写好格式化输出语句，直接在浏览器上取点直接复制到代码上即可。现在来说说怎么使用：
```javascript
/**
 * 链路图点位工具
 * @param {number} cartesianMaxY y轴最大值，默认为0，表示DOM定位方式
 * @param {number} width 占位宽度
 * @param {number} height 占位高度
 * @param {url} background 占位背景
 * @param {json} style 占位style
 * @param {bool} notice 是否提示复制信息
 * @param {string} formatter 数据输出格式，使用${x}${y}占位
 * @param {bool} multi 多点连续输出，默认单点输出
 */
```
cartesianMaxY区分是DOM定位还是坐标系定位，为0是dom定位，坐标系定位时，这里要填入最大纵坐标值，width、height、background、style是定位框的大小样式，可以直接用需要定位的元素替代。notice是否弹出提示框，formatter是输出格式，${x}${y}是占位符，输出时会替换为对应坐标值。multi设置多点输出还是单点输出，没有设置formatter在坐标系模式下默认多点输出。示例如下：
```javascript
<PointsBuild
  cartesianMaxY={1445}
  width={25}
  height={17}
  multi={true}
  //formatter是string格式，这里为了方便展示，用了``格式
  formatter={`{
    lineStyle: {
      color: '#fff',
      type: 'solid',
      opacity: 1,
    },
    coords: [
      [${'${x}'}, ${'${y}'}],
      [${'${x}'}, ${'${y}'}],
      [${'${x}'}, ${'${y}'}],
    ],
  },`}
/>
```
DOM定位配置比较简单，把这个组件扔到需要定位的元素同一父节点（为了定位一致）下就行，坐标系定位的话需要另外将坐标系展示范围设置和父节点一致，cartesianMaxY设为y轴最大值，具体配置如下：
```javascript
<ReactEcharts
  // 父节点大小
  style={{ width: 3500, height: 1445 }}
  option={options}
/>
// 设置展示区域为100%以及x、y轴的最大值与父节点分辨率一致
const options = {
  grid: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  xAxis: {
    min: 0,
    max: 3500,
  },
  yAxis: {
    min: 0,
    max: 1445,
  }
 }
 ```
以上配置都是为了获取范围的坐标系与应用的坐标系保持一致，好了设置好这些就能食用了。
安装方式

```powershell
npm install pointsbuild -D
```
有兴趣的同学可以改成读取地图点位的，需要考虑比例尺以及原点位置。
