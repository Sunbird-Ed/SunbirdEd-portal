export const builtInButtons = {
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
        id: 'My Library',
        useModalOverlay: true,
        options: {
            attachTo: '.tour-1 bottom',
            buttons: [
                builtInButtons.next
            ],
            classes: 'sb-guide-text-area',
            title: 'My Library',
            text: [`Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs.`]
        }
    },
    {
        id: 'Enter Qr Code',
        useModalOverlay: true,
        options: {
            attachTo: '.tour-2 bottom',
            buttons: [
                builtInButtons.back,
                builtInButtons.next            ],
            classes: 'sb-guide-text-area',
            title: 'Enter Qr Code',
            text: [`Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs.`]
        }
    },
    {
        id: 'Search',
        useModalOverlay: true,
        options: {
            attachTo: '.tour-3 bottom',
            buttons: [
                builtInButtons.back,
                builtInButtons.next
            ],
            classes: 'sb-guide-text-area',
            title: 'Search',
            text: [`Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs.`]
        }
    },
    {
        id: 'Upload Content',
        useModalOverlay: true,
        options: {
            attachTo: '.tour-4 bottom',
            buttons: [
                builtInButtons.back,
                builtInButtons.next,
            ],
            classes: 'sb-guide-text-area',
            title: 'Upload Content',
            text: [`Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs.`]
        }
    },
    {
        id: 'See Video',
        useModalOverlay: true,
        options: {
            attachTo: '.tour-5 bottom',
            buttons: [
                builtInButtons.back,
                builtInButtons.next,
            ],
            classes: 'sb-guide-text-area',
            title: 'Click',
            text: [`Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs.`]
        }
    },
    {
        id: 'Play',
        useModalOverlay: true,
        options: {
            attachTo: '.tour-6 top',
            buttons: [
                builtInButtons.back,
                builtInButtons.next,
            ],
            classes: 'sb-guide-text-area',
            title: 'Play',
            text: [`Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs.`]
        }
    },
    {
        id: 'Copy to Pendrive',
        useModalOverlay: true,
        options: {
            attachTo: '.tour-7 top',
            buttons: [
                builtInButtons.back,
                builtInButtons.next,
            ],
            classes: 'sb-guide-text-area',
            title: 'Copy to Pendrive',
            text: [`Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs.`]
        }
    },
    {
        id: 'Browse Online',
        useModalOverlay: true,
        options: {
            attachTo: '.tour-8 bottom',
            buttons: [
                builtInButtons.back,
                builtInButtons.next,
            ],
            classes: 'sb-guide-text-area',
            title: 'Click to Browse Online',
            text: [`Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs.`]
        }
    },
    {
        id: 'Download',
        useModalOverlay: true,
        options: {
            attachTo: '.tour-9 top',
            buttons: [
                builtInButtons.back,
                builtInButtons.cancel,
            ],
            classes: 'sb-guide-text-area',
            title: 'Download',
            text: [`Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs.`]
        }
    },
    {
        id: 'Exit',
        useModalOverlay: true,
        options: {
            attachTo: '.tour-10 top',
            buttons: [
                builtInButtons.back,
                builtInButtons.cancel,
            ],
            classes: 'sb-guide-text-area',
            title: 'Exit',
            text: [`Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs.`]
        }
    },

];
