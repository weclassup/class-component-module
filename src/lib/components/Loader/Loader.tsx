import React, { useEffect, useState } from "react";
import classNames from "classnames";

import { loadingEventEmitter } from "../../events/class.event";

import Image from "../Image/Image";
import Modal from "../Modal/Modal";
import LoaderIcon from "../../assets/cls-loading-img.png";

export const Loader = () => {
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    loadingEventEmitter.on(setLoading);

    return () => {
      loadingEventEmitter.off(setLoading);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <Modal visible={loading}>
      <Image
        src={LoaderIcon}
        alt="loader"
        className={classNames("animate-spin", "w-16", "h-16")}
      />
    </Modal>
  );
};

export default Loader;
