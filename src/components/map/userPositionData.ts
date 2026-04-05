// 用户当前位置数据
export interface UserPosition {
  x: number; // from left, percent
  y: number; // from top, percent
  heading: number; // degrees
}

export const userPosition: UserPosition = {
  x: 45,
  y: 50,
  heading: 105
};