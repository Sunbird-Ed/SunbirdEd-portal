import { IActionButton, ActionButtonType } from '@project-sunbird/common-consumption-v9';

export const actionButtons: IActionButton[] = [
    {
        name: ActionButtonType.DOWNLOAD,
        label: 'Download',
        disabled: true
    },
    {
        name: ActionButtonType.UPDATE,
        label: 'Update',
        disabled: true
    },
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
        name: ActionButtonType.DELETE,
        label: 'Delete',
        disabled: true
    },
    {
        name: ActionButtonType.FULL_SCREEN,
        label: 'Fullscreen',
        disabled: false
    }
  ];

  export const fullScreenActionButtons: IActionButton[] = [

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
