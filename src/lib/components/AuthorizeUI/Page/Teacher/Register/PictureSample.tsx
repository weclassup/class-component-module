import React from "react";
import classNames from "classnames";

import Modal from "../../../../Modal/Modal";
import Flexbox from "../../../../Flexbox/Flexbox";
import Fonts from "../../../../Fonts/Fonts";
import Image from "../../../../Image/Image";
import Button from "../../../../Button/Button";

import pictureSample from "../../../../../assets/picture_sample.jpg";

interface Props {
  show: boolean;
  onClose: () => void;
}

const PictureSample: React.FC<Props> = ({ show, onClose }) => {
  return (
    <Modal visible={show} onBackdrop={onClose}>
      <Flexbox
        direction="col"
        className={classNames("p-6", "bg-white", "rounded-xl", "lg:p-10")}
      >
        <Fonts
          fontSize="primaryHeading"
          className={classNames("text-grey1", "mb-5", "lg:mb-6")}
        >
          照片範例
        </Fonts>
        <Image
          src={pictureSample}
          className={classNames(
            "w-56",
            "h-56",
            "border-2",
            "border-solid",
            "border-grey3",
            "rounded-cl",
            "mb-6",
            "lg:mb-10",
            "lg:w-[280px]",
            "lg:h-[280px]"
          )}
        />
        <Button buttonStyle="primary" fill onClick={onClose}>
          關閉
        </Button>
      </Flexbox>
    </Modal>
  );
};

export default PictureSample;
