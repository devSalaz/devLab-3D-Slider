import React from "react";
import { HiArrowSmRight, HiArrowSmLeft } from "react-icons/hi";

const Slider = ({ offset }) => {
  const onNextSliderHandler = () => {
    offset.x = offset.x - 1;
    offset.noiseDirection = -1;
  };

  const onPrevSliderHandler = () => {
    offset.x = offset.x + 1;
    offset.noiseDirection = 1;
  };

  return (
    <div className="slider">
      <div className="content">
        <div className="icon-left" onClick={onPrevSliderHandler}>
          <HiArrowSmLeft size="2.5rem" />
        </div>
        <div className="icon-right" onClick={onNextSliderHandler}>
          <HiArrowSmRight size="2.5rem" />
        </div>
      </div>
    </div>
  );
};

export default Slider;
