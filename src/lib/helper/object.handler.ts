export const getDataFormObjectByKeys = <O extends object, K extends keyof O>(
	obj: O,
	keys: K[]
): Pick<O, K> => {
	let result = {} as Pick<O, K>;
	keys.forEach((k) => {
		result[k] = obj[k];
	});

	return result;
};
