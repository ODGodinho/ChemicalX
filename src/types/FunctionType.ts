export type FunctionParameterType<ReturnType, ParameterType> = (parameter: ParameterType) => ReturnType;

export type FunctionReturnType<ReturnType> = () => ReturnType;
