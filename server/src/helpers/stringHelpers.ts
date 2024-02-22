export class StringHelpers {
  static isNullOrEmpty(s: string): boolean {
    return typeof s !== "string" || s === "" || s === null;
  }
}
