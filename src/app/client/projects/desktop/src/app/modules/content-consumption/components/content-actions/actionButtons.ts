import { IActionButton, ActionButtonType } from '@project-sunbird/common-consumption';

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
        disabled: true
    },
    {
        name: ActionButtonType.DELETE,
        label: 'Delete',
        disabled: true
    },
    {
        name: ActionButtonType.RATE,
        label: 'Rate',
        disabled: false
    }
  ];
