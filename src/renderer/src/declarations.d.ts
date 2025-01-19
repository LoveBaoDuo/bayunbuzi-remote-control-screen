import value from "*.gif";

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.gif' {
  const value: string;
  export default value;
}
declare module '@renderer/*' {
  const value: any; // 根据需要定义具体类型
  export default value;
}
declare module '/@/*' {
  const value: any; // 根据需要定义具体类型
  export default value;
}
