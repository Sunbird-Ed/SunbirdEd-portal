export const builtInButtons = {
    skip: {
        classes: 'sb-btn sb-btn-xs sb-btn-secondary cancel-button',
        text: 'Skip',
        type: 'cancel'
    },
    cancel: {
        classes: 'sb-btn sb-btn-xs sb-btn-secondary cancel-button',
        text: 'Exit',
        type: 'cancel'
    },
    next: {
        classes: 'sb-btn sb-btn-xs sb-btn-secondary next-button',
        text: 'Next',
        type: 'next'
    },
    back: {
        classes: 'sb-btn sb-btn-xs sb-btn-outline-gray back-button',
        text: 'Back',
        type: 'back'
    }
};

 export const defaultStepOptions = {
    scrollTo: false,
    showCancelLink: false,
    modal: true,
    highlightClass: 'highlight',
    classes: 'shadow-md bg-purple-dark',
    id: 'testID1',
    tippyOptions: {
        duration: 500,
    },
 };

 export const steps = [
    {
        id: 'Copy content from pendrive',
        useModalOverlay: true,
        options: {
            attachTo: '.tour-1 bottom',
            buttons: [
                builtInButtons.skip,
                builtInButtons.next            ],
            classes: 'sb-guide-text-area',
            title: 'Copy content from pendrive',
            text: ['Copy DIKSHA files (eg. Maths_01.ecar) from your pendrive to your library to play them offline.']
        }
    },
    {
        id: 'Offline library',
        useModalOverlay: true,
        options: {
            attachTo: '.tour-2 bottom',
            buttons: [
                builtInButtons.skip,
                builtInButtons.back,
                builtInButtons.next
            ],
            classes: 'sb-guide-text-area',
            title: 'Offline library',
            text: ['Click on My Library to access all your offline content.']
        }
    },
    {
        id: 'Browse online for DIKSHA content',
        useModalOverlay: true,
        options: {
            attachTo: '.tour-3 bottom',
            buttons: [
                builtInButtons.skip,
                builtInButtons.back,
                builtInButtons.next,
            ],
            classes: 'sb-guide-text-area',
            title: 'Browse online for DIKSHA content',
            text: [' Download content whenever you are online from DIKSHA to your library.']
        }
    },
    {
        id: 'How to use DIKSHA app',
        useModalOverlay: true,
        options: {
            attachTo: '.tour-4 bottom',
            buttons: [
                builtInButtons.back,
                builtInButtons.cancel,
            ],
            classes: 'sb-guide-text-area',
            title: 'How to use DIKSHA app',
            text: ['Watch detailed videos to understand how to use the DIKSHA desktop app.']
        }
    },
 ];
