import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ControllerRenderProps } from "react-hook-form";
import classNames from "classnames";
import { useAsync } from "react-use";
import { postToSearchOptionsWithChildren } from "../../api";

import isEqual from "lodash.isequal";
import { isEmptyArray, isNotSet } from "../../helper/format.checker";

import Flexbox from "../Flexbox/Flexbox";
import Button from "../Button/Button";
import Fonts from "../Fonts/Fonts";
import Modal from "../Modal/Modal";

interface Props
  extends Omit<ControllerRenderProps<Record<string, number[]>, string>, "ref"> {
  error?: boolean;
}

interface SelectedSubject {
  categoryName: string;
  categoryId: number;
  subjectName: string;
  subjectId: number;
}

export const SubjectSelection: React.FC<Props> = ({
  onChange,
  error,
  value,
}) => {
  const [selectedSubjects, setSelectedSubjects] = useState<SelectedSubject[]>(
    []
  );
  const [openSelector, setOpenSelector] = useState<boolean>(false);

  const { value: categories } = useAsync(
    async () =>
      await postToSearchOptionsWithChildren({
        optionKey: "SUBJECT_CATEGORY",
        childOptionKey: "SUBJECT",
      })
  );

  useEffect(() => {
    setSelectedSubjects(pairValueAndCategory(value));
    // eslint-disable-next-line
  }, [categories]);

  const subjectChangeHandler = useCallback((subject: SelectedSubject) => {
    setSelectedSubjects((prev) => {
      let hasSelectedBefore = false;
      let result = [];
      for (let i = 0; i < prev.length; i++) {
        let item = prev[i];
        if (isEqual(item, subject)) {
          hasSelectedBefore = true;
        } else {
          result.push(item);
        }
      }
      if (hasSelectedBefore) return result;
      else {
        if (result.length >= 5) return [...prev];
        else return result.concat(subject);
      }
    });
  }, []);

  const confirmHandler = useCallback(() => {
    onChange(selectedSubjects.map(({ subjectId }) => subjectId));
    setOpenSelector(false);
    // eslint-disable-next-line
  }, [selectedSubjects]);

  const pairValueAndCategory = useCallback(
    (value: number[] | undefined) => {
      if (isNotSet(value)) return [];
      let result: SelectedSubject[] = [];
      for (let index in value) {
        const id = value[index];
        if (isNotSet(categories)) break;
        for (let categoryIndex in categories) {
          const category = categories[categoryIndex];
          const subjects = category.children;
          subjects.forEach((subject) => {
            if (subject.id === id) {
              result.push({
                categoryName: category.name,
                categoryId: category.id,
                subjectName: subject.name,
                subjectId: subject.id,
              });
            }
          });
        }
      }
      return result;
    },
    [categories]
  );

  const displaySubjects = useMemo(
    () =>
      pairValueAndCategory(value).map(
        ({ categoryName, subjectName }) => `${categoryName}${subjectName}`
      ),
    // eslint-disable-next-line
    [value, categories]
  );

  return (
    <React.Fragment>
      <SelectorModal
        open={openSelector}
        closeHandler={() => setOpenSelector(false)}
        confirmHandler={confirmHandler}
      >
        <div
          className={classNames(
            "p-6",
            "pb-3",
            "lg:pt-12",
            "lg:px-20",
            "lg:pb-0"
          )}
        >
          <Fonts
            fontSize="primaryHeading"
            className={classNames("text-grey1", "lg:mb-4")}
          >
            選擇擅長科目
          </Fonts>
          <Fonts fontSize="secondaryBody" className={classNames("text-grey2")}>
            已選擇{" "}
            <span className={classNames("text-primary")}>
              {selectedSubjects.length}
            </span>{" "}
            項，還可以選擇 {5 - selectedSubjects.length} 項
          </Fonts>
        </div>
        <ul
          className={classNames(
            "px-6",
            "py-4",
            "border-b",
            "border-t",
            "border-solid",
            "border-b-grey4",
            "border-t-grey4",
            "overflow-scroll",
            "max-h-80",
            "lg:border-0",
            "lg:px-20",
            "lg:pt-10",
            "lg:max-h-fit"
          )}
        >
          {categories?.map((category) => (
            <CategorySection key={category.id} categoryName={category.name}>
              {category.children.map(({ id, name }) => (
                <SubjectSection
                  key={id}
                  subjectName={name}
                  subjectId={id}
                  selectedSubjects={selectedSubjects}
                  subjectChangeHandler={() =>
                    subjectChangeHandler({
                      categoryName: category.name,
                      categoryId: category.id,
                      subjectId: id,
                      subjectName: name,
                    })
                  }
                />
              ))}
            </CategorySection>
          ))}
        </ul>
        {/*<ul*/}
        {/*    className={classNames(*/}
        {/*        "px-6",*/}
        {/*        "py-4",*/}
        {/*        "border-b",*/}
        {/*        "border-t",*/}
        {/*        "border-solid",*/}
        {/*        "border-b-grey4",*/}
        {/*        "border-t-grey4",*/}
        {/*        "overflow-scroll",*/}
        {/*        "max-h-80",*/}
        {/*        "lg:border-0",*/}
        {/*        "lg:px-20",*/}
        {/*        "lg:pt-10",*/}
        {/*        "lg:max-h-fit"*/}
        {/*    )}*/}
        {/*>*/}
        {/*  {subjectCategory?.map(({ key, label }) => (*/}
        {/*      <CategorySection*/}
        {/*          key={key}*/}
        {/*          categoryId={key}*/}
        {/*          categoryName={label}*/}
        {/*          changeSubjectHandler={changeSubjectHandler}*/}
        {/*          selectedSubject={preserveSubject}*/}
        {/*      />*/}
        {/*  ))}*/}
        {/*</ul>*/}
      </SelectorModal>
      <Flexbox justify="start">
        <Flexbox
          align="center"
          className={classNames(
            "w-full",
            "invalid:border-red",
            "rounded-sm",
            "py-3",
            "px-4",
            "text-grey1",
            "placeholder-grey3",

            "border",
            "border-grey4",
            "focus:outline-none",
            "focus:border-primary",
            "disabled:border-grey4",
            "disabled:bg-grey6",
            "disabled:text-grey3",
            { "border-red": error }
          )}
        >
          <DisplaySubject displaySubjects={displaySubjects} />
        </Flexbox>
        <Button
          as="button"
          type="button"
          buttonStyle="primary"
          defaultSize={false}
          className={classNames("w-16", "ml-4", "flex-shrink-0", "h-12")}
          onClick={() => setOpenSelector(true)}
        >
          {isEmptyArray(selectedSubjects) ? "選擇" : "編輯"}
        </Button>
      </Flexbox>
    </React.Fragment>
  );
};

export default SubjectSelection;

interface DisplaySubjectProps {
  displaySubjects: string[];
}

const DisplaySubject: React.FC<DisplaySubjectProps> = ({ displaySubjects }) => {
  if (isEmptyArray(displaySubjects))
    return (
      <Fonts fontSize="primaryBody" className={classNames("text-grey2")}>
        未選擇
      </Fonts>
    );

  return (
    <Flexbox wrap="wrap" className={classNames("-mr-2", "-mb-2")}>
      {displaySubjects.map((name) => (
        <Flexbox
          key={name}
          as="li"
          align="center"
          justify="center"
          className={classNames(
            "bg-primary",
            "text-white",
            "px-[10px]",
            "py-[6px]",
            "rounded-sm",
            "mr-2",
            "mb-2"
          )}
        >
          <Fonts fontSize="primaryButton">{name}</Fonts>
        </Flexbox>
      ))}
    </Flexbox>
  );
};

interface SelectorModalProps {
  open: boolean;
  closeHandler: () => void;
  confirmHandler: () => void;
}

const SelectorModal: React.FC<SelectorModalProps> = ({
  children,
  open,
  confirmHandler,
  closeHandler,
}) => {
  return (
    <Modal visible={open}>
      <div
        className={classNames(
          "rounded-xl",
          "bg-white",
          "w-[272px]",
          "overflow-hidden",
          "lg:w-[560px]",
          "lg:max-h-[540px]",
          "lg:overflow-scroll"
        )}
      >
        {children}
        <Flexbox
          className={classNames(
            "p-6",
            "pt-4",
            "lg:px-20",
            "lg:pb-12",
            "lg:pt-0"
          )}
        >
          <Button
            buttonStyle="primary"
            as="button"
            type="button"
            className={classNames("mr-4")}
            onClick={closeHandler}
          >
            取消
          </Button>
          <Button
            buttonStyle="primary"
            as="button"
            type="button"
            fill
            onClick={confirmHandler}
          >
            確定
          </Button>
        </Flexbox>
      </div>
    </Modal>
  );
};

interface CategorySectionProps {
  categoryName: string;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  categoryName,
  children,
}) => {
  return (
    <li className={classNames("mb-3", "lg:mb-6")}>
      <Fonts className={classNames("text-sm", "font-medium", "mb-2")}>
        {categoryName}
      </Fonts>
      <Flexbox as="ul" wrap="wrap" className={classNames("-mr-2")}>
        {children}
      </Flexbox>
    </li>
  );
};

interface SubjectSectionProps {
  subjectName: string;
  subjectId: number;
  subjectChangeHandler: () => void;
  selectedSubjects: SelectedSubject[];
}

const SubjectSection: React.FC<SubjectSectionProps> = ({
  subjectName,
  subjectId,
  subjectChangeHandler,
  selectedSubjects,
}) => {
  const isSelected = selectedSubjects.some(
    (subject) => subject.subjectId === subjectId
  );

  return (
    <Flexbox
      as="li"
      onClick={subjectChangeHandler}
      className={classNames(
        "cursor-pointer",
        "mr-2",
        "mb-2",
        "px-[10px]",
        "py-[6px]",
        "border",
        "border-solid",
        "rounded-sm",
        isSelected
          ? ["bg-primary", "border-primary", "text-white"]
          : ["border-grey2", "text-grey2"]
      )}
    >
      <Fonts fontSize="primaryButton">{subjectName}</Fonts>
    </Flexbox>
  );
};
