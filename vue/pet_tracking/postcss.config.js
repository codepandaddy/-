// 浏览器属性前缀
import autoprefixer from 'autoprefixer'
import viewport from 'postcss-mobile-forever'

const baseViewportOpts = {
  appSelector: '#app', // 根元素选择器，用于设置桌面端和横屏时的居中样式
  viewportWidth: 375, // 设计稿的视口宽度，可传递函数动态生成视图宽度
  unitPrecision: 3, // 单位转换后保留的精度（很多时候无法整除）
  maxDisplayWidth: 600, // 桌面端最大展示宽度
  propList: [
    '*',
    // '!font-size'
  ],
  // 能转化为vw的属性列表，!font-size表示font-size后面的单位不会被转换
  // 指定不转换为视口单位的类，可以自定义，可以无限添加，建议定义一至两个通用的类名
  // 需要忽略的CSS选择器，不会转为视口单位，使用原有的px等单位。
  // 下面配置表示类名中含有'keep-px'以及'.ignore'类都不会被转换
  selectorBlackList: ['.ignore', 'keep-px'],
  // 下面配置表示属性值包含 '1px solid' 的内容不会转换
  valueBlackList: ['1px solid'],
  // exclude: [/node_modules/], // 忽略某些文件夹下的文件或特定文件
  // include: [/src/], // 如果设置了include，那将只有匹配到的文件才会被转换
  mobileUnit: 'vw', // 指定需要转换成的视口单位，建议使用 vw
  rootContainingBlockSelectorList: ['van-popup--bottom'], // 指定包含块是根包含块的选择器，这种选择器的定位通常是 `fixed`，但是选择器内没有 `position: fixed`
}

export default {
  plugins: [
    autoprefixer(),
    viewport({
      ...baseViewportOpts,
      // 只将 vant 转为 375 设计稿的 viewport，其它样式的视图宽度为 750
      // viewportWidth: file => (file.includes('node_modules/vant/') ? 375 : 750),
    }),
  ],
}