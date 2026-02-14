
export type AppState = 'dashboard' | 'qr' | 'picker' | 'timer' | 'dice';

export interface PickerItem {
  id: string;
  name: string;
  isPicked: boolean;
}
