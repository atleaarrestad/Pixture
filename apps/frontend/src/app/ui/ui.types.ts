export type UiTone =
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'neutral';

export interface UiOption {
    label: string;
    value: string;
    description?: string;
}

export interface UiAccordionItem {
    title: string;
    content: string;
    badge?: string;
}

export interface UiTabItem {
    label: string;
    caption?: string;
    content: string;
}

export interface UiToast {
    id: number;
    title: string;
    message: string;
    tone: UiTone;
}
