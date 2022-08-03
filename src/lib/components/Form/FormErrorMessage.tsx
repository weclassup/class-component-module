import React, { PropsWithChildren } from "react";
import {
	ErrorMessage,
	FieldValuesFromFieldErrors,
} from "@hookform/error-message";
import { FieldErrors, FieldName, FieldValues } from "react-hook-form";

import classNames from "classnames";

import Fonts from "../Fonts/Fonts";

interface Props<ErrorFields extends FieldErrors> {
	errors: ErrorFields;
	name: FieldName<FieldValuesFromFieldErrors<ErrorFields>>;
}
// FieldName<FieldValuesFromFieldErrors<DeepMap<Form, FieldError>>>
interface Component extends FCWithoutComponent {
	<Form extends FieldValues>(
		props: PropsWithChildren<Props<Form>>,
		context?: any
	): ReturnType<React.FC>;
}

export const FormErrorMessage: Component = ({ errors, name }) => {
	return (
		<ErrorMessage
			errors={errors}
			name={name}
			render={({ message }) => (
				<Fonts
					fontSize="secondaryBody"
					className={classNames("text-red", "mt-2")}
				>
					{message}
				</Fonts>
			)}
		/>
	);
};

export default FormErrorMessage;
