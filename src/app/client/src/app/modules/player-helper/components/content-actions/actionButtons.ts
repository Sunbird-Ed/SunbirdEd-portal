import { IActionButton, ActionButtonType } from '@project-sunbird/common-consumption';

export const actionButtons: IActionButton[] = [
    {
        name: ActionButtonType.DOWNLOAD,
        label: 'Download',
        disabled: true,
        isInActive: false,
        showSeperator: false
    },
    {
        name: ActionButtonType.UPDATE,
        label: 'Update',
        disabled: true,
        isInActive: false,
        showSeperator: false
    },
    {
        name: ActionButtonType.SHARE,
        label: 'Share',
        disabled: false,
        isInActive: false,
        showSeperator: false
    },
    {
        name: ActionButtonType.RATE,
        label: 'Rate',
        disabled: true,
        isInActive: false,
        showSeperator: false
    },
    {
        name: ActionButtonType.PRINT,
        label: 'Print',
        disabled: true,
        isInActive: false,
        showSeperator: false
    },
    {
        name: ActionButtonType.DELETE,
        label: 'Delete',
        disabled: true,
        isInActive: false,
        showSeperator: false
    },
    {
        name: ActionButtonType.FULL_SCREEN,
        label: 'Fullscreen',
        disabled: false,
        isInActive: false,
        showSeperator: true
    }
  ];

  export const fullScreenActionButtons: IActionButton[] = [

    // {
    //     name: ActionButtonType.SHARE,
    //     label: 'Share',
    //     disabled: false,
    //     isInActive: false,
    //     showSeperator: false
    // },
    {
        name: ActionButtonType.RATE,
        label: 'Rate',
        disabled: true,
        isInActive: false,
        showSeperator: false
    },
    {
        name: ActionButtonType.PRINT,
        label: 'Print',
        disabled: true,
        isInActive: false,
        showSeperator: false
    },
    {
        name: ActionButtonType.MINIMIZE_SCREEN,
        label: 'Minimize',
        disabled: false,
        isInActive: false,
        showSeperator: true
    }
  ];
