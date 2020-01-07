export const resourceTemplateComponentInput = {
  templateList: [
    {
      filesConfig: { accepted: 'pdf', size: '50' },
      id: 'explanationContent',
      label: 'Explanation',
      metadata: {
        appIcon:
          // tslint:disable-next-line:max-line-length
          'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_21291553051403878414/artifact/explanation.thumb_1576602846206.png',
        audience: ['Learner'],
        contentType: 'ExplanationResource',
        description: 'ExplanationResource',
        marks: 5,
        name: 'Explanation Resource',
        resourceType: 'Read'
      },
      mimeType: ['application/pdf', 'application/msword'],
      onClick: 'uploadComponent'
    }
  ]
};
