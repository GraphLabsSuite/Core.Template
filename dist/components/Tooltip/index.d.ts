import { Component, ReactNode } from 'react';
export interface TooltipProps {
    value: string;
    show: boolean;
    showTooltip: any;
    bound: HTMLDivElement | null;
}
declare class Tooltip extends Component<TooltipProps> {
    tooltip: HTMLElement;
    render(): ReactNode;
}
export default Tooltip;