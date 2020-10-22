import { IActionButton, ActionButtonType } from '@project-sunbird/common-consumption';

export const actionButtons: IActionButton[] = [

    {
        name: ActionButtonType.SHARE,
        label: 'Share',
        disabled: false
    },
    {
        name: ActionButtonType.RATE,
        label: 'Rate',
        disabled: true
    },
    {
        name: ActionButtonType.PRINT,
        label: 'Print',
        disabled: true
    },
    {
        name: ActionButtonType.MINIMIZE_SCREEN,
        label: 'Minimize',
        disabled: false
    }
  ];
