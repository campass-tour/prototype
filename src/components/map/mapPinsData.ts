// 所有地图Pin点位配置
export interface MapPinData {
  id: string;
  x: number;
  y: number;
  status: 'locked' | 'unlocked';
  buildingName?: string;
  buildingIcon?: React.ReactNode;
  hintText?: string;
}

export const mapPinsData: MapPinData[] = [
  {
    id: 'mystery_building',
    x: 25,
    y: 35,
    status: 'locked',
    buildingName: 'Mystery Building',
    hintText: 'Find this building to unlock its secrets!'
  },
  {
    id: 'cb',
    x: 35,
    y: 50,
    status: 'unlocked',
    buildingName: 'CB',
    // buildingIcon 需在使用处传递
  }
];