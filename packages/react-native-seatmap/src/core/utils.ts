export class Utils {
  static generateId(): string {
    return '_' + Math.random().toString(36).substring(2, 9);
  }
}
