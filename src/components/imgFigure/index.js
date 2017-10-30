/**
 * 图片组件
 */
import React from 'react';

class ImgFigure extends React.Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  /**
   * imgFigure 的点击处理函数
   */
  handleClick(e){
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    let styleObj = {},
        {pos, rotate, isCenter} = this.props.arrange;
    
    // 如果props属性中指定了这张图片的位置 则使用指定值
    if (pos) {
      styleObj = pos;
    }
    // 如果旋转角度有值且值不为0，添加旋转角度
    if (rotate) {
      (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach((val)=>{
        styleObj[val] = 'rotate(' + rotate + 'deg)';
      })
    }

    if (isCenter) {
      styleObj.zIndex = 11;
    }

    let imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInverse ? ' isInverse' : '';

    return (
      <figure className={imgFigureClassName} style={styleObj}>
        <img src={this.props.data.imageUrl} alt={this.props.data.title} onClick={this.handleClick} />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    )
  }
}

module.exports = ImgFigure;
