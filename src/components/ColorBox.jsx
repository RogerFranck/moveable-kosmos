import React, { useRef, useState } from "react";
import Moveable from "react-moveable";
const Component = ({
  updateMoveable,
  top,
  left,
  width,
  height,
  index,
  color,
  fit,
  id,
  setSelected,
  isSelected = false,
  updateEnd,
  handleDelete,
}) => {
  const ref = useRef();
  const Editable = {
    name: "editable",
    props: {},
    events: {},
    render: function (moveable, React) {
      const rect = moveable.getRect();
      const { pos2 } = moveable.state;

      // use css for able
      const EditableViewer = moveable.useCSS(
        "div",
        `
        {
            position: absolute;
            left: 0px;
            top: 0px;
            will-change: transform;
            transform-origin: 0px 0px;
        }
        .moveable-button {
            width: 24px;
            height: 24px;
            margin-bottom: 4px;
            background: #4af;
            border-radius: 4px;
            appearance: none;
            border: 0;
            color: white;
            font-weight: bold;
        }
        `
      );
      // Add key (required)
      // Add class prefix moveable-(required)
      return React.createElement(
        EditableViewer,
        {
          key: "editable-viewer",
          className: "moveable-editable",
          style: {
            transform: `translate(${pos2[0]}px, ${pos2[1]}px) rotate(${rect.rotation}deg) translate(10px)`,
          },
        },
        React.createElement(
          "button",
          {
            className: "moveable-button",
            onClick: function () {
              handleDelete(id);
            },
          },
          "X"
        )
      );
    },
  };

  const [nodoReferencia, setNodoReferencia] = useState({
    top,
    left,
    width,
    height,
    index,
    color,
    id,
  });

  let parent = document.getElementById("parent");
  let parentBounds = parent?.getBoundingClientRect();

  const onResize = async (e) => {
    // ACTUALIZAR ALTO Y ANCHO
    let newWidth = e.width;
    let newHeight = e.height;

    const positionMaxTop = top + newHeight;
    const positionMaxLeft = left + newWidth;

    if (positionMaxTop > parentBounds?.height)
      newHeight = parentBounds?.height - top;
    if (positionMaxLeft > parentBounds?.width)
      newWidth = parentBounds?.width - left;

    updateMoveable(id, {
      top,
      left,
      width: newWidth,
      height: newHeight,
      color,
      fit,
    });

    // ACTUALIZAR NODO REFERENCIA
    const beforeTranslate = e.drag.beforeTranslate;

    ref.current.style.width = `${e.width}px`;
    ref.current.style.height = `${e.height}px`;

    let translateX = beforeTranslate[0];
    let translateY = beforeTranslate[1];

    ref.current.style.transform = `translate(${translateX}px, ${translateY}px)`;

    setNodoReferencia({
      ...nodoReferencia,
      translateX,
      translateY,
      top: top + translateY < 0 ? 0 : top + translateY,
      left: left + translateX < 0 ? 0 : left + translateX,
    });
  };

  const onResizeEnd = async (e) => {
    const targetBouns = e.target.getBoundingClientRect();

    const leftRe = Math.max(targetBouns.left, parentBounds?.left);
    const topRe = Math.max(targetBouns.top, parentBounds.top);
    const rightRe = Math.min(targetBouns.right, parentBounds.right);
    const bottomRe = Math.min(targetBouns.bottom, parentBounds.bottom);

    updateMoveable(
      id,
      {
        top: topRe,
        left: leftRe,
        width: rightRe - leftRe,
        height: bottomRe - topRe,
        color,
        fit,
      },
      true
    );
  };

  const onMove = (e) => {
    const { left, top } = e;
    //! Especificar limites  TOP y LEFT
    const newLeft = Math.max(0, Math.min(parentBounds.width - width, left));
    const newTop = Math.max(0, Math.min(parentBounds.height - height, top));
    updateMoveable(id, {
      top: newTop,
      left: newLeft,
      width,
      height,
      color,
      fit,
    });
  };
  return (
    <>
      <div
        ref={ref}
        className="draggable"
        id={"component-" + id}
        style={{
          position: "absolute",
          top: top,
          left: left,
          width: width,
          height: height,
        }}
        onClick={() => setSelected(id)}
      >
        <img
          style={{
            objectFit: fit,
            width: "100%",
            height: "100%",
          }}
          src={color}
          alt="flores"
        />
      </div>

      <Moveable
        target={isSelected && ref.current}
        ables={[Editable]}
        props={{
          editable: true,
        }}
        resizable
        draggable
        bounds={{
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
        }}
        onDrag={onMove}
        onResize={onResize}
        /* onResizeEnd={onResizeEnd} */
        keepRatio={false}
        throttleResize={1}
        renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
        edge={false}
        zoom={1}
        origin={false}
        padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
      ></Moveable>
    </>
  );
};

export default Component;
