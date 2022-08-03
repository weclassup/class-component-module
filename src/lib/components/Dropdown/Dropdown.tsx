import React, {
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import classNames from "classnames";

import { getScrollableParent } from "../../helper/element.helper";
import useInteractiveOutsideTargetHandler from "../../hooks/useInteractiveOutsideTargetHandler/useInteractiveOutsideTargetHandler";

import { faChevronDown, faChevronUp } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Flexbox from "../Flexbox/Flexbox";
import Fonts from "../Fonts/Fonts";
import Portal from "../Portal/Portal";
import { ControllerRenderProps } from "react-hook-form";
import { faSearch } from "@fortawesome/pro-regular-svg-icons";
import {
  isEmptyArray,
  isEmptyString,
  isNotSet,
} from "../../helper/format.checker";
import { DropdownOption, FontIconButton } from "../..";

interface Props extends Omit<ControllerRenderProps, "ref"> {
  options?: DropdownOption[];
  placeholder?: string;
  condition?: boolean;
  defaultValue?: DropdownOption["key"];
}

interface UnSearchableProps {
  searchable?: false;
}

interface SearchableProps {
  searchable?: true;
}

export const Dropdown: React.FC<Props & (SearchableProps | UnSearchableProps)> =
  ({
    options,
    value,
    onChange,
    searchable = false,
    placeholder,
    condition = true,
    defaultValue,
  }) => {
    const [mainRef, setMainRef] = useState<HTMLDivElement | null>(null);
    const [optionsRef, setOptionsRef] = useState<HTMLUListElement | null>(null);
    const [offsetLeft, setOffsetLeft] = useState<number>(0);
    const [offsetTop, setOffsetTop] = useState<number>(0);
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const [focusing, setFocusing] = useState<boolean>(false);
    const [searchWord, setSearchWord] = useState<string>("");
    const [displayOptions, setDisplayOptions] = useState<DropdownOption[]>(
      options || []
    );

    const scrollRef = useRef<HTMLElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    useInteractiveOutsideTargetHandler(optionsRef || mainRef, () => {
      setFocusing(false);
      setShowOptions(false);
    });

    useEffect(() => {
      if (isNotSet(value) || isEmptyString(value)) {
        onChange(defaultValue);
      }
    }, [defaultValue]);

    useEffect(() => {
      setDisplayOptions(options || []);
    }, [options]);

    const getBounding = useCallback(() => {
      if (!mainRef || !optionsRef) return;
      const offset = mainRef.getBoundingClientRect();
      const nodeHeight = mainRef.clientHeight;
      const { top, left, bottom } = offset;
      const { clientHeight } = optionsRef;
      let offsetTop: number = top;

      let offsetBottom = window.innerHeight - bottom;

      if (scrollRef.current) {
        offsetBottom = scrollRef.current.clientHeight - bottom;
      }

      if (offsetBottom < clientHeight) {
        offsetTop -= clientHeight + 8;
      } else {
        offsetTop += nodeHeight + 8;
      }

      setOffsetLeft(left);
      setOffsetTop(offsetTop);
    }, [mainRef, optionsRef, searchable]);

    useEffect(() => {
      if (!optionsRef) return;
      getBounding();
      // eslint-disable-next-line
    }, [optionsRef, displayOptions]);

    useEffect(() => {
      if (!mainRef || !optionsRef) return;
      if (!showOptions) return;

      const scrollParent = getScrollableParent(mainRef);

      if (!scrollParent) return;

      scrollRef.current = scrollParent;
      scrollParent.addEventListener("wheel", getBounding);
      scrollParent.addEventListener("touchmove", getBounding);

      return () => {
        scrollParent.removeEventListener("wheel", getBounding);
        scrollParent.removeEventListener("touchmove", getBounding);
      };
      // eslint-disable-next-line
    }, [mainRef, optionsRef, showOptions]);

    const changeHandler = (value: any) => {
      onChange(value);
      setFocusing(false);
      setShowOptions(false);
    };

    const searchHandler = () => {
      if (!searchable) return options;

      inputRef.current?.blur();
      setDisplayOptions(
        options?.filter(({ label }) => label.indexOf(searchWord) >= 0) || []
      );
      setShowOptions(true);
    };

    const dropdownClickHandler = useCallback(() => {
      if (searchable) {
        setFocusing(true);
      } else {
        setShowOptions((prev) => !prev);
        setFocusing((prev) => !prev);
      }
    }, []);

    if (!condition) return null;

    return (
      <div>
        <Flexbox
          onClick={dropdownClickHandler}
          customRef={setMainRef}
          justify="between"
          align="stretch"
          className={classNames(
            "p-1",
            "pl-4",
            "border",
            "border-grey4",
            "rounded-sm",
            "text-grey2",
            "bg-white"
          )}
        >
          <DropdownDisplay
            placeholder={placeholder}
            currentItem={options?.find(({ key }) => key === value)}
            focusing={focusing}
            searchable={searchable}
            searchWord={searchWord}
            setSearchWord={setSearchWord}
            inputRef={inputRef}
            searchHandler={searchHandler}
          />
        </Flexbox>
        <DropdownList
          optionsRef={setOptionsRef}
          options={displayOptions || []}
          width={mainRef?.clientWidth || 0}
          top={offsetTop}
          left={offsetLeft}
          open={showOptions}
          onChange={changeHandler}
          value={value}
        />
      </div>
    );
  };

export default Dropdown;

interface DropdownDisplayProps {
  currentItem: DropdownOption | undefined;
  focusing: boolean;
  searchable: boolean;
  searchWord: string;
  setSearchWord: (word: string) => void;
  placeholder?: string;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  searchHandler: () => void;
}

const DropdownDisplay: React.FC<DropdownDisplayProps> = ({
  currentItem,
  focusing,
  searchable,
  searchWord,
  setSearchWord,
  placeholder,
  inputRef,
  searchHandler,
}) => {
  const isComposition = useRef<boolean>(false);

  useEffect(() => {
    if (!searchable) return;
    if (!inputRef.current) return;
    if (!focusing) return;

    inputRef.current.focus();
    setSearchWord("");
    // eslint-disable-next-line
  }, [focusing, searchable]);

  useInteractiveOutsideTargetHandler(inputRef.current, () =>
    inputRef.current?.blur()
  );

  const changeHandler = useCallback(
    (event: SyntheticEvent<HTMLInputElement>) => {
      setSearchWord(event.currentTarget.value);
    },
    []
  );

  const compositionHandler = useCallback<
    React.CompositionEventHandler<HTMLInputElement>
  >((event) => {
    isComposition.current = event.type !== "compositionend";
  }, []);

  const keyDownHandler = useCallback<
    React.KeyboardEventHandler<HTMLInputElement>
  >(
    (e) => {
      if (e.key.toLocaleLowerCase() === "enter") {
        if (isComposition.current) return;
        e.preventDefault();
        searchHandler();
      }
    },
    [searchHandler]
  );

  const displayValue = useMemo(() => {
    if (searchable && focusing) return;

    if (currentItem) {
      if (currentItem.displayItemRender) {
        return React.createElement(currentItem.displayItemRender);
      } else {
        return currentItem.label;
      }
    } else if (placeholder) {
      return placeholder;
    } else {
      return "請選擇";
    }
  }, [currentItem, placeholder, searchable, focusing]);

  if (searchable && focusing)
    return (
      <React.Fragment>
        <Flexbox className={classNames("flex-1")} align={"center"}>
          <input
            ref={inputRef}
            value={searchWord}
            onChange={changeHandler}
            onCompositionStart={compositionHandler}
            onCompositionEnd={compositionHandler}
            className={classNames("focus:outline-none", "w-full")}
            onKeyDown={keyDownHandler}
          />
        </Flexbox>
        <FontIconButton
          type={"button"}
          fontProps={{ icon: faSearch }}
          onClick={searchHandler}
          className={classNames("text-[18px]", "flex-shrink-0")}
        />
      </React.Fragment>
    );

  return (
    <React.Fragment>
      <Fonts
        fontSize="primaryBody"
        className={classNames(
          "flex items-center",
          "overflow-ellipsis",
          "overflow-hidden",
          "whitespace-nowrap"
        )}
      >
        {displayValue}
      </Fonts>
      <Flexbox
        as="span"
        justify="center"
        align="center"
        className={classNames("w-10", "h-10", "text-[11px]", "flex-shrink-0")}
      >
        {focusing ? (
          <FontAwesomeIcon icon={faChevronUp} />
        ) : (
          <FontAwesomeIcon icon={faChevronDown} />
        )}
      </Flexbox>
    </React.Fragment>
  );
};

interface DropdownListProps {
  width: number;
  options: DropdownOption[];
  optionsRef: React.LegacyRef<HTMLUListElement>;
  left: number;
  top: number;
  open: boolean;
  onChange: (value: any) => void;
  value: any;
}

const DropdownList: React.FC<DropdownListProps> = ({
  width,
  options,
  optionsRef,
  top,
  left,
  open,
  onChange,
  value,
}) => {
  if (!open) return null;

  return (
    <Portal>
      <ul
        ref={optionsRef}
        className={classNames(
          "fixed",
          "z-30",
          "bg-white",
          "rounded-xs",
          "shadow-dropdown",
          "py-2",
          "max-h-[30%]",
          "overflow-scroll"
        )}
        style={{ top, left }}
      >
        {isEmptyArray(options) ? (
          <DropdownItem
            label="無資料"
            id={null}
            width={width}
            isSelected={false}
          />
        ) : (
          options.map(({ key, label, optionItemRender }) => (
            <DropdownItem
              key={key?.toString()}
              label={label}
              id={key}
              width={width}
              onChange={onChange}
              isSelected={value === key}
              optionItemRender={optionItemRender}
            />
          ))
        )}
      </ul>
    </Portal>
  );
};

interface DropdownItemProps extends Omit<DropdownOption, "key"> {
  width: number;
  id: DropdownOption["key"];
  onChange?: (value: any) => void;
  isSelected: boolean;
}

const DropdownItem: React.FC<DropdownItemProps> = ({
  width,
  label,
  id,
  onChange,
  isSelected,
  optionItemRender,
}) => {
  const renderLabel = useMemo(() => {
    if (optionItemRender) {
      return React.createElement(optionItemRender);
    } else {
      return label;
    }
  }, [label, optionItemRender]);

  return (
    <Flexbox
      as="li"
      align="center"
      className={classNames(
        "h-12",
        "px-4",
        isSelected
          ? ["text-primary", "bg-primary", "bg-opacity-10", "font-medium"]
          : ["text-grey1"],
        !isSelected && "hover-hover:hover:bg-grey5",
        "hover-hover:hover:cursor-pointer"
      )}
      style={{ width }}
      onClick={() => onChange?.(id)}
    >
      <Fonts fontSize="primaryBody">{renderLabel}</Fonts>
    </Flexbox>
  );
};
