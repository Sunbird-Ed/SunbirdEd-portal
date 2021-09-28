export const ProfileData = {
    block: '966c3be4-c125-467d-aaff-1eb1cd525923',
    district: '2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03',
    role: 'DEO',
    school: '28226200402',
    state: 'bc75cc99-9205-463e-a722-5326857838f8',
  };

  export const EntityList = {
    message: 'Observation entities fetched successfully',
    status: 200,
    result: {
      allowMultipleAssessemts: false,
      _id: '60bdabda4d5bea24ac0a5c69',
      entities: [
        {
          _id: '5fd1f4a0e84a88170cfb0497',
          externalId: '28220100203',
          name: 'MPPS H.SIDDAPURAM',
          submissionsCount: 3,
        },
        {
          _id: '5fd1f4a0e84a88170cfb04b6',
          externalId: '28220101403',
          name: 'MPUPS KADALURU',
          submissionsCount: 0,
        },
      ],
      entityType: 'school',
    },
    responseCode: 'OK',
  };

  export const ObservationForm = {
    message: 'Successfully fetched observation submissions',
    status: 200,
    result: [
      {
        _id: '60ba1f5d4bb0a824895b96f8',
        evidencesStatus: [
          {
            name: 'School Leadership and Management Team',
            code: 'SL_1620912285090',
            status: 'notstarted',
          },
          {
            name: 'Teaching and Learning Practices',
            code: 'TLP_1620912285090',
            status: 'notstarted',
          },
        ],
        isRubricDriven: true,
        entityId: '5fd1f4a0e84a88170cfb0495',
        entityExternalId: '28220100101',
        entityType: 'school',
        observationId: '609e3b85b2f70d503e36f363',
        status: 'started',
        scoringSystem: 'pointsBasedScoring',
        criteriaLevelReport: false,
        submissionNumber: 1,
        title: 'ddddd',
        updatedAt: '2021-06-07T06:50:53.080Z',
        createdAt: '2021-06-04T12:41:01.582Z',
        observationName: 'simple observation with only slider V2',
        submissionDate: '',
        ratingCompletedAt: '',
      },
    ],
    responseCode: 'OK',
  };

  export const AlertMetaData = {
    type: '',
    size: '',
    isClosed: false,
    content: {
      title: '',
      body: {
        type: '', // text,checkbox
        data: '',
      },
    },
    footer: {
      className: '', // single-btn,double-btn,double-btn-circle
      buttons: [],
    },
  };

  export const AlertNotApplicable={
    type: 'Not Applicable',
    size: 'mini',
    isClosed: true,
    content: {
      title: 'Update Profile',
      body: {
        type: 'text', // text,checkbox
        data: 'Are you sure want to make not applicable',
      },
    },
    footer: {
      className: 'double-btn',
      buttons: [
        {
          type: 'accept',
          returnValue: true,
          buttonText: 'proceed',
        },
        {
          type: 'cancel',
          returnValue: false,
          buttonText: 'Go Back',
        }
      ],
    },
  };

  export const Entity = {
    action: 'change',
    data: {
      _id: '5fd1f4a0e84a88170cfb0498',
      externalId: '28220100204',
      name: 'ZPHS H.SIDDAPURAM',
      submissionsCount: 0,
    },
  };
  export const EventForSubmission = {
    actiom: 'edit',
    data: {
      createdAt: '2021-06-14T08:10:47.388Z',
      entityExternalId: '28220100203',
      entityId: '5fd1f4a0e84a88170cfb0497',
      entityType: 'school',
      evidencesStatus: [
        {
          code: 'OB',
          name: 'Observation',
          status: 'notstarted',
        },
      ],
      isRubricDriven: false,
      observationId: '60bdabda4d5bea24ac0a5c69',
      observationName: 'Infrastructure Assessment- Toilets & Urinals',
      ratingCompletedAt: '',
      scoringSystem: null,
      status: 'started',
      submissionDate: '',
      submissionNumber: 5,
      title: 'Observation 5',
      updatedAt: '2021-06-14T08:10:47.388Z',
      _id: '60c70f07944a3a53d9256010',
    },
  };

  export const EditSubmissionEvent = {
    actiom: 'edit',
    data: {
      createdAt: '2021-06-14T08:10:47.388Z',
      entityExternalId: '28220100203',
      entityId: '5fd1f4a0e84a88170cfb0497',
      entityType: 'school',
      evidencesStatus: [
        {
          code: 'OB',
          name: 'Observation',
          status: 'notstarted',
        },
      ],
      isRubricDriven: false,
      observationId: '60bdabda4d5bea24ac0a5c69',
      observationName: 'Infrastructure Assessment- Toilets & Urinals',
      ratingCompletedAt: '',
      scoringSystem: null,
      status: 'started',
      submissionDate: '',
      submissionNumber: 5,
      title: 'Observation 5',
      updatedAt: '2021-06-14T08:10:47.388Z',
      _id: '60c70f07944a3a53d9256010',
    },
  };
  export const UpdatedSubmission = {
    message: 'Observation submission updated successfully',
    status: 200,
    responseCode: 'OK',
  };

