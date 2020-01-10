import { IActionButton, ActionButtonType } from '@project-sunbird/common-consumption';

export const actionButtons: IActionButton[] = [
    {
        name: ActionButtonType.DOWNLOAD,
        label: 'Download',
        disabled: false
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
        name: ActionButtonType.DELETE,
        label: 'Delete',
        disabled: false
    },
    {
        name: ActionButtonType.RATE,
        label: 'Rate',
        disabled: false
    }
  ];
