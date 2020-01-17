// tslint:disable:max-line-length
export const mcqTemplateConfig = {
    'templateConfig': [
        {
            'id': 1,
            'url': 'assets/images/mcq_template/horizontal.png',
            'templateClass': 'mcq-vertical',
            'templateDescription': '<span> Recommended for <br> 1. Long / short Text question and long / short text options <br> 2. Text question with small image and text options <br> 3. Text question with small image and text options with small image <br> </span>'
        },
        {
            'id': 2,
            'url': 'assets/images/mcq_template/vertical.png',
            'templateClass': 'mcq-horizontal',
            'templateDescription': '<span> Recommended for <br> 1. Text question and image as options <br> 2. Text question with small image and image as options </span>'
        },
        {
            'id': 3,
            'url': 'assets/images/mcq_template/vertical2.png',
            'templateClass': 'mcq-vertical mcq-split',
            'templateDescription': '<span> Recommended for <br> 1. Big image as question and text options <br> 2. Big image as question and short text options with small image </span>'
        },
        {
            'id': 4,
            'url': 'assets/images/mcq_template/grid2.png',
            'templateClass': 'mcq-grid mcq-split',
            'templateDescription': '<span> Recommended for <br> 1. Big image as question and image as options </span>'
        }
    ],
    'mcqBody': '<div class=\'{templateClass} cheveron-helper\'><div class=\'mcq-title\'>{question}</div><i class=\'chevron down icon\'></i><div class=\'mcq-options\'>{optionList}</div></div>',
    'optionTemplate': '<div data-simple-choice-interaction data-response-variable=\'responseValue\' value={value} class=\'mcq-option\'>{option}</div>'
};
