export const Response = {
  mockTelemetryImpression: {
		context: {
			env: 'mock-env'
		},
		edata: {
			type: 'mock-Type',
			pageid: 'mock-page-id',
			uri: '/library/mock',
			subtype: 'mock-sub-type',
			duration: 1,
			visits: []
		}
	},
  successData: {
    count: 5,
    data: [
      {
        name: 'Enrollment challenges in DIKSHA Courses-1621768529433',
        contentType: 'Observation',
        metaData: {
          identifier: '60aa395289c54c29e61e51e0',
        },
        identifier: '60aa395289c54c29e61e51e0',
        solutionId: '60aa395289c54c29e61e51e0',
        programId: '601429016a1ef53356b1d714',
        medium: ['English'],
        organization: '',
        _id: '60ab7e2826ecef7caf4fadb1',
        subject: ['School development Program'],
      },
      {
        name: 'Enrollment challenges in DIKSHA Courses-1621842462039',
        contentType: 'Observation',
        metaData: {
          identifier: '60ab5a1e5f71ce040512ca3f',
        },
        identifier: '60ab5a1e5f71ce040512ca3f',
        solutionId: '60ab5a1e5f71ce040512ca3f',
        programId: '601429016a1ef53356b1d714',
        medium: ['English'],
        organization: '',
        _id: '60ab7e0003d9d27c9e555794',
        subject: ['School development Program'],
      },
      {
        name: 'Test latest genie',
        contentType: 'Observation',
        metaData: {
          identifier: '609282b6eb30104968c5e881',
        },
        identifier: '609282b6eb30104968c5e881',
        solutionId: '609282b6eb30104968c5e881',
        programId: '607d320de9cce45e22ce90c0',
        medium: ['English'],
        organization: '',
        _id: '60ab7c5d26ecef7caf4fadb0',
        subject: ['Observation led projects testing'],
      },
      {
        name: 'Simple observation with only slider V2',
        contentType: 'Observation',
        metaData: {
          identifier: '609d28adb2f70d503e36f354',
        },
        identifier: '609d28adb2f70d503e36f354',
        solutionId: '609d28adb2f70d503e36f354',
        programId: '607d320de9cce45e22ce90c0',
        medium: ['English'],
        organization: '',
        _id: '60a63962b2f4ab2d871c8532',
        subject: ['Observation led projects testing'],
      },
      {
        name: 'Leadership Self Assessment',
        contentType: 'Observation',
        metaData: {
          identifier: '608271d214de0e1567f38f09',
        },
        identifier: '608271d214de0e1567f38f09',
        solutionId: '608271d214de0e1567f38f09',
        programId: '607d320de9cce45e22ce90c0',
        medium: ['English'],
        organization: '',
        _id: '',
        subject: ['Observation led projects testing'],
      },
    ],
  },
  profileData: {
    block: '27b28dcc-e11f-48a0-ac3f-613a0992da5a',
    district: 'f3e5b768-9008-4073-baf5-1dffc3c12b0b',
    role: 'DEO',
    state: '1222633c-bef9-4be8-a42d-edffa5a9c7ab',
  },
  metaData: {
    type: 'update profile',
    size: 'mini',
    isClosed: true,
    content: {
      title: 'Update Profile',
      body: {
        type: 'text', // text,checkbox
        data: 'Please update your profile',
      },
    },
    footer: {
      className: 'single-btn',
      buttons: [
        {
          type: 'accept',
          returnValue: true,
          buttonText: 'Update',
        },
      ],
    },
  },
  data: {
    programId: '607d320de9cce45e22ce90c0',
    solutionId: '609d28adb2f70d503e36f354',
    observationId: '60a63962b2f4ab2d871c8532',
    solutionName: 'Simple observation with only slider V2',
    programName: ['Observation led projects testing'],
  },
};

export const EventData = {
  event: {
    isTrusted: true,
  },
  data: {
    name: 'Test latest genie',
    contentType: 'Observation',
    metaData: {
      identifier: '609282b6eb30104968c5e881',
    },
    identifier: '609282b6eb30104968c5e881',
    solutionId: '609282b6eb30104968c5e881',
    programId: '607d320de9cce45e22ce90c0',
    medium: ['English'],
    organization: '',
    _id: '60ab7c5d26ecef7caf4fadb0',
    subject: ['Observation led projects testing'],
  },
};
