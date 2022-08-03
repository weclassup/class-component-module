import React, {useState} from "react";
import classNames from "classnames";
import {NavLink} from "react-router-dom";

import Button, {LinkButton} from "../../Button/Button";
import Flexbox from "../../Flexbox/Flexbox";
import Fonts from "../../Fonts/Fonts";
import SignInSelection from "../SignInSelection/SignInSelection";

interface Props {
  open: boolean;
  onClose: () => void;
}

const Navigation: React.FC<Props> = ({ open, onClose }) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <nav
      className={classNames(
        "fixed",
          "top-0",
          "w-full",
          "h-stretch",
          "z-40",
          "bg-white",
          "transition-transform",
          "transform",
          "duration-500",
          !open ? "translate-y-[calc(-100%)]" : "translate-y-[0]",
          "pt-[57px]",
          "lg:hidden",
          'overflow-hidden'
      )}
    >
      <SignInSelection show={showModal} onClose={() => setShowModal(false)} />
      <Flexbox
        as="ul"
        direction="col"
        align="stretch"
        className={classNames("p-6", "pt-4", "h-full", "w-full")}
      >
        <Flexbox
          as="li"
          justify="start"
          align="stretch"
          className={classNames("h-12")}
        >
          <NavLink
            to="/"
            onClickCapture={onClose}
            className={classNames("w-full", "flex", "h-full", "items-center")}
          >
            <Fonts as="p" fontSize="primaryButton">
              首頁
            </Fonts>
          </NavLink>
        </Flexbox>
        <Flexbox as="li" className={classNames("mt-auto")}>
          <Button
            onClick={() => setShowModal(true)}
            as="button"
            buttonStyle="primary"
            type="button"
            className={classNames("mt-auto")}
          >
            登入
          </Button>
        </Flexbox>
        <Flexbox as="li" className={classNames("mt-4")}>
          <LinkButton
            buttonStyle="primary"
            fill
            className={classNames("mt-auto", "flex-1", "h-12")}
            onClick={onClose}
            to="/register"
          >
            註冊
          </LinkButton>
        </Flexbox>
      </Flexbox>
    </nav>
  );
};

export default Navigation;
