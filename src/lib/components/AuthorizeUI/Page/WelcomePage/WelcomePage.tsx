import React from "react";
import classNames from "classnames";

import { getHref } from "../../../../helper/location.helper";

import Fonts from "../../../Fonts/Fonts";
import Button from "../../../Button/Button";
import Image from "../../../Image/Image";
import StudentIcon from "../../../../assets/cls-register-student-img.svg";
import TeacherIcon from "../../../../assets/cls-register-teacher-img.svg";

const WelcomePage = () => {
  return (
    <main
      className={classNames(
        "flex flex-col",
        "h-[calc(100vh-57px)]",
        "lg:h-[calc(100vh-73px)]",
        "p-6",
        "pt-4",
        "md:pt-20"
      )}
    >
      <ul className={classNames("md:flex", "mx-auto", "justify-center")}>
        <Student />
        <Teacher />
      </ul>
      <footer
        className={classNames(
          "flex flex-col items-center justify-center",
          "mt-auto",
          "text-xs text-grey2"
        )}
      >
        <p className={classNames("mb-2")}>support@weclass.com.tw</p>
        <p className={classNames("mb-2")}>桃園市桃園區同德二街3號5樓</p>
        <p>克雷斯班級網股份有限公司 © 2022. All rights reserve</p>
      </footer>
    </main>
  );
};

export default WelcomePage;

interface CardProps {
  title: string;
  image: string;
  type: "student" | "teacher";
  btnText: string;
  href: string;
}

const Card: React.FC<CardProps> = ({ type, title, image, btnText, href }) => {
  return (
    <li
      className={classNames(
        "p-6",
        "mb-4",
        "last:mb-0",
        "rounded-xl",
        {
          "bg-[#fc9245]": type === "student",
          "bg-[#3d9cf3]": type === "teacher",
        },
        "md:mb-0",
        "md:mr-6",
        "md:last:mr-0",
        "md:flex",
        "md:flex-col",
        "md:items-center",
        "md:px-10",
        "md:py-12"
      )}
    >
      <Fonts
        fontSize="title"
        className={classNames(
          "w-[90px]",
          "text-white",
          "float-left",
          "md:w-fit",
          "md:float-none",
          "md:-mx-2",
          "md:mb-6"
        )}
      >
        {title}
      </Fonts>
      <Image
        className={classNames(
          "w-[120px]",
          "h-[108px]",
          "float-right",
          "-mt-2",
          "-mr-2",
          "md:w-[200px]",
          "md:h-[180px]",
          "md:float-none",
          "lg:mt-0",
          "lg:mr-0"
        )}
        src={image}
        alt={type}
      />
      <div className={classNames("clear-both", "md:hidden")} />
      <Button
        as="a"
        href={href}
        className={classNames(
          "bg-white",
          "mt-4",
          {
            "text-[#fc9245]": type === "student",
            "text-[#3d9cf3]": type === "teacher",
          },
          "md:mt-6"
        )}
      >
        {btnText}
      </Button>
    </li>
  );
};

const Student: React.FC = () => {
  return (
    <Card
      title="我是學生，我想發問！"
      image={StudentIcon}
      type="student"
      btnText="註冊學生帳號"
      href={`${getHref("student")}/register`}
    />
  );
};

const Teacher: React.FC = () => {
  return (
    <Card
      title="我是老師，我想解答！"
      image={TeacherIcon}
      type="teacher"
      btnText="註冊老師帳號"
      href={`${getHref("teacher")}/register`}
    />
  );
};
