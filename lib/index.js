import React, { useState, useRef } from 'react';
import Clipboard from 'clipboard';

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

const listenerCatch = (obj, e, hander) => {
  if (obj.addEventListener) {
    obj.addEventListener(e, hander, false);
  } else if (obj.attachEvent) {
    e = 'on' + e;
    obj.attachEvent(e, hander);
  }
};
const cancelEvent = (e) => {
  if (e.preventDefault) {
    e.preventDefault();
    e.stopPropagation();
  } else {
    e.returnValue = false;
    e.cancelBubble = true;
  }
};

const PointsBuild = ({
  cartesianMaxY = 0,
  width = 100,
  height = 100,
  background = null,
  style = {},
  notice = true,
  formatter = '',
  multi = false,
}) => {
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [mesWidth, setWidth] = useState(0);
  const [pointer, points, ref] = [useRef({ x: 0, y: 0 }), useRef(''), useRef(null)];

  const drag = (e) => {
    !pointer.current.x && !pointer.current.y && listenerCatch(document, 'mousemove', mousemove);
    pointer.current = { x: e.pageX, y: e.pageY };
  };

  const mousemove = (e) => {
    cancelEvent(e);
    let [x, y] = [e.pageX, e.pageY];
    if (ref.current.offsetLeft <= 5 && ref.current.offsetTop <= 5) points.current = '';
    setLeft((l) => l + x - pointer.current.x);
    setTop((t) => t + y - pointer.current.y);
    pointer.current = { x: x, y: y };
  };

  const copy = (e) => {
    let text;
    if (formatter) {
      let [x, y] = cartesianMaxY ? [left + width / 2, cartesianMaxY - top - height / 2] : [left, top];
      if (points.current.indexOf('${x}') == -1) multi ? (points.current += formatter) : (points.current = formatter);
      points.current = points.current.replace('${x}', x).replace('${y}', y);
      text = points.current;
    } else {
      cartesianMaxY && (points.current += `[${left + width / 2}, ${cartesianMaxY - top - height / 2}],`);
      text = cartesianMaxY ? points.current : `left: '${left}px', top: '${top}px',`;
    }
    const clipboard = new Clipboard('.btn', {
      text: function () {
        return text;
      },
    });
    clipboard.on('success', () => {
      clipboard.destroy();
    });
    clipboard.on('error', function () {
      clipboard.destroy();
    });
    clipboard.onClick(e);
    if (notice) {
      const mes = document.createElement('div');
      mes.className = `mes-mark`;
      document.body.appendChild(mes);
      mes.textContent = `复制坐标${text}成功`;
      setWidth(mes.clientWidth);
      setTimeout(() => {
        mes.remove();
      }, 1500);
    }
  };

  return (
    <div onMouseDown={(e) => drag(e)} onClick={(e) => copy(e)} ref={ref} style={style} className="pointsbuild-mark">
      <style jsx="true">
        {`
          .pointsbuild-mark {
            width: ${width}px;
            height: ${height}px;
            background: url(${background}) center no-repeat;
            position: absolute;
            top: ${top}px;
            left: ${left}px;
            border: 1px solid red;
            z-index: 100000;
          }
          .mes-mark {
            position: fixed;
            top: 50px;
            font-size: 18px;
            padding: 0 20px;
            border-radius: 8px;
            line-height: 30px;
            height: 30px;
            background: rgba(255, 255, 255, 1);
            left: calc(50% - ${mesWidth / 2}px);
          }
        `}
      </style>
    </div>
  );
};

export default PointsBuild;
