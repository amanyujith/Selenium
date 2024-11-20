export const groupBy = <T extends object, U extends keyof T>(
    xs: T[] = [],
    key: U
  ): { [key: string]: T[] } => {
    return xs.reduce((rv: any, x: T) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };