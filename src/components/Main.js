/**
 * 页面主组件
 */
require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';
let ImgFigure = require('../components/imgFigure/index.js');
let ControllerUnit = require('../components/controllerUnit/index.js');
// 获取图片相关的数据
let imageDatas = require('../data/imageDatas.json');

// 利用自执行函数 将图片名信息 转成图片的Url路径信息
imageDatas = ((imageDataArr)=>{
  for(var i = 0, j = imageDataArr.length; i < j; i++){
    var singleImageData = imageDataArr[i];
    singleImageData.imageUrl = require('../images/' + singleImageData.fileName);
    imageDataArr[i] = singleImageData;
  }
  return imageDataArr;
})(imageDatas);

class AppComponent extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      imgsArrangeArr: [
        /*
        {
          pos: {
            left: 0,
            top: 0
          },
        rotate: 0,   //旋转角度
        isInverse: false //图片正反面
        isCenter: false  //图片书否居中
        }
        */
      ]
    };
    this.Constant = {
      centerPos: {
        left: 0,
        top: 0
      },
      hPosRange: {
        leftSecX: [0,0],
        rightSecX: [0,0],
        y: [0,0]
      },
      vPosRange: {
        x: [0,0],
        topY: [0,0]
      }
    };

  }
  /**
   * 获取数组区间内的一个随机值
   * @param  arr 给出的数字数组
   * @return num 范围内的随机值
   */
  getRangeRandom(arr){
    let low = Math.min.apply(Math, arr),
        high = Math.max.apply(Math,arr),
        num = Math.ceil(Math.random() * (high - low) + low);
        return num;
  }

  /**
   * 获取图片旋转角度  ±30deg
   * @returns deg 图片旋转角度
   */

  get30DegRandom () {
    return((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
  }

  /**
   *  翻转图片
   * @param index 输入当前执行翻转操作的图片对应的index
   * @return function 这是一个闭包函数  其内部 return 一个真正被待执行的函数
   */

  inverse(index){
    return ()=>{
      let imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      this.setState({
        imgsArrangeArr: imgsArrangeArr
      })
    };
  }
  

  /**
   * 重新布局所有图片
   * @param  centerIndex  指定居中排布的图片索引值
   */

  rearrange(centerIndex) {
    let {imgsArrangeArr} = this.state,
        {centerPos, hPosRange, vPosRange} = this.Constant,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,
        imgsArrangeTopArr = [],
        topImgNum = Math.floor(Math.random() * 2), //取一个图片  或者不取
        topImgSpliceIndex = 0,
        imgArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

        // 首先居中 centerIndex 的图片 居中图片不做旋转
        imgArrangeCenterArr[0] = {
          pos: centerPos,
          rotate: 0,
          isCenter: true
        };

        // 取出要布局上侧图片的状态信息
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

        // 布局位于上侧位置的图片
        imgsArrangeTopArr.forEach((val, index)=>{
          imgsArrangeTopArr[index] = {
            pos: {
              top: this.getRangeRandom(vPosRangeTopY),
              left: this.getRangeRandom(vPosRangeX)
            },
            rotate: this.get30DegRandom(),
            isCenter: false
          }
        });

        // 布局左右两侧的图片
        for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
          let hPosRangeLORX = null;
          // 前半部分布局左边  后半部分  布局右边
          if (i < k) {
            hPosRangeLORX = hPosRangeLeftSecX;
          } else {
            hPosRangeLORX = hPosRangeRightSecX;
          }

          imgsArrangeArr[i] = {
            pos: {
              top: this.getRangeRandom(hPosRangeY),
              left: this.getRangeRandom(hPosRangeLORX)
            },
            rotate: this.get30DegRandom(),
            isCenter: false
          }
        }

        if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
          imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }

        imgsArrangeArr.splice(centerIndex, 0, imgArrangeCenterArr[0]);

        this.setState({
          imgsArrangeArr: imgsArrangeArr
        });
  }

  /**
   * 利用rearrange函数， 居中对应index的图片
   * @param index 需要被居中图片对应的图片信息数组的对应index值
   * @return {function} 返回一个待执行函数
   */
  center(index){
    return ()=>{
      this.rearrange(index);
    }
  }

  // 组价加载之后， 为每张图片计算其位置范围
  componentDidMount (){
    // 首先拿到舞台大小
    let stageDom = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDom.scrollWidth,
        stageH = stageDom.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);
    
    // 拿到一个imgFigure 的大小
    let imgFigureDom = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDom.scrollWidth,
        imgH = imgFigureDom.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2);
        
    // 计算中心图片的位置
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }

    // 计算左侧 右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    // 计算上侧图片排布的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);
  }
  render() {
    let controllerUnits = [],
        imgFigures = [];
        imageDatas.forEach(function(val, index) {
          if (!this.state.imgsArrangeArr[index]) {
            this.state.imgsArrangeArr[index] = {
              pos: {
                top: 0,
                left: 0
              },
              rotate: 0,
              isInverse: false,
              isCenter: false
            }
          }
          imgFigures.push(
            <ImgFigure
              data={val}
              ref={'imgFigure' + index} key={index}
              arrange={this.state.imgsArrangeArr[index]}
              inverse={this.inverse(index)}
              center={this.center(index)} />
          );
          controllerUnits.push(<ControllerUnit arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)} key={index}/>)
        }.bind(this));
    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
