# 简介
首先要了解OpenGL和WebGL，OpenGL它是最常用的跨平台图形库，WebGL是基于OpenGL设计的面向web的图形标准，提供了一系列JavaScript API，通过这些API进行图形渲染将得以利用图形硬件从而获得较高性能。

而Three.js是通过对WebGL接口的封装与简化而形成的一个易用的图形库。

WebGL涉及到数学知识，而threejs对WebGL提供的接口进行了非常好的封装，简化了很多细节，大大降低了学习成本。并且，几乎没有损失WebGL的灵活性。

# 大体思路
1.构建三维空间(场景Scene)
2.选择一个观察点，并确定观察方向/角度等(相机Camera)
3.在场景中添加供观察的物体(Object3D->Mesh,Line,Points)
4.将观察到的场景渲染到屏幕上的指定区域（Renderer）

# Scene
场景是所有物体的容器，也对应着我们创建的三维世界。

# Camera
Camera是三维世界中的观察者，为了观察这个世界，首先我们要描述空间中的位置。 Three中使用采用常见的右手坐标系定位。

Three中的相机有两种，分别是正投影相机THREE.OrthographicCamera和透视投影相机THREE.PerspectiveCamera。

1.OrthographicCamera( left, right, top, bottom, near, far )，left则表示左平面在左右方向上与Camera的距离。另外几个参数同理。于是六个参数分别定义了视景体六个面的位置。
2.PerspectiveCamera( fov, aspect, near, far )，fov对应着图中的视角，是上下两面的夹角。aspect是近平面的宽高比。在加上近平面距离near，远平面距离far，就可以唯一确定这个视景体了。

# Object3D
## Mesh

三维模型用三角形组成的网格来描述，我们把这种模型称之为Mesh模型。

    Mesh( geometry, material ) //geometry是它的形状，material是它的材质。

## Geometry

形状，过存储模型用到的点集和点间关系(哪些点构成一个三角形)来达到描述物体形状的目的。

Three提供了立方体(其实是长方体)、平面(其实是长方形)、球体、圆形、圆柱、圆台等许多基本形状；

## Material

材质，物体表面除了形状以为所有可视属性的集合，例如色彩、纹理、光滑度、透明度、反射率、折射率、发光度。

## Points

一堆点的集合

## light

光影效果是让画面丰富的重要因素。Three提供了包括环境光AmbientLight、点光源PointLight、 聚光灯SpotLight、方向光DirectionalLight、半球光HemisphereLight等多种光源。

## Renderer

Renderer绑定一个canvas对象，并可以设置大小，默认背景颜色等属性。

调用Renderer的render函数，传入scene和camera，就可以把图像渲染到canvas中了。

