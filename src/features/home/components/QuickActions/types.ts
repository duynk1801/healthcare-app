
export interface IQuickAction {
  id: string;
  label: string;
  iconName: string;
  route: string;
  color: string; // hex color for icon bg
}

export interface IQuickActionsProps {
  actions: IQuickAction[];
  onActionPress: (route: string) => void;
}
