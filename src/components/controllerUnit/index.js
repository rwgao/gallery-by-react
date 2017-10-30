/**
 * 控制按钮组件
 */
import React from 'react';

class ControllerUnit extends React.Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e){
    // 如果点击的是当前正在选中的按钮，则翻转图片，否则让图片居中
    let {isCenter} = this.props.arrange;
    let {center, inverse} = this.props;
    if (isCenter) {
      inverse();
    } else {
      center();
    }
    e.stopPropagation();
    e.preventDefault();
  }
  render(){
    let controllerUnitClassName = 'controller-unit';
    let {isCenter, isInverse} = this.props.arrange;
    // 如果对应的图片是居中图片，则显示控制按钮的居中态
    if (isCenter) {
      controllerUnitClassName += ' isCenter';
      // 如果对应图片是翻转态，则显示控制按钮的旋转态
      if (isInverse) {
        controllerUnitClassName += ' isInverse';
      }
    }
    return (
      <span className={controllerUnitClassName} onClick={this.handleClick}>
        
      </span>
    )
  }
}

module.exports = ControllerUnit;