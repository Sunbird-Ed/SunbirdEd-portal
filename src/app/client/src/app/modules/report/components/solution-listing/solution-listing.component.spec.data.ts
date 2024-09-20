export const profileData = {
  block: '27b28dcc-e11f-48a0-ac3f-613a0992da5a',
  district: 'f3e5b768-9008-4073-baf5-1dffc3c12b0b',
  role: 'DEO',
  state: '1222633c-bef9-4be8-a42d-edffa5a9c7ab',
};


export const PaginateData = {
  totalItems: 20,
  currentPage: 1,
  pageSize: 10,
  totalPages: 2,
  startPage: 1,
  endPage: 2,
  startIndex: 0,
  endIndex: 9,
  pages: [1, 2]
};

export const ObservationDataFail = {
  message: 'Solutions fetched successfully',
  status: 200,
  result: {
    entityType: [],
    count: 0,
    data: []
  }
};

export const ObservationData = {
  message: 'Solutions fetched successfully',
  status: 200,
  result: {
    entityType: ['state', 'district', 'block'],
    count: 7,
    data: [
      {
        isRubricDriven: false,
        solutionId: '6047209a9cdaea526d558440',
        programId: '601429016a1ef53356b1d714',
        entityType: 'district',
        scoringSystem: null,
        observationId: '60a5fa43bb954c2db8061f80',
        entities: [
          {
            _id: '5fd098e2e049735a86b748b7',
            externalId: 'D_AP-D012',
            name: 'ANANTAPUR',
          },
        ],
        programName: 'School development Program',
        name: 'Enrollment challenges in SUNBIRD Courses-1615274138124',
        allowMultipleAssessemts: false,
      },
      {
        isRubricDriven: false,
        solutionId: '60549beb823d601f0af5c38c',
        programId: '60549338acf1c71f0b2409c3',
        entityType: 'block',
        scoringSystem: null,
        observationId: '605827e6f74dc33920023f2a',
        entities: [
          {
            _id: '5fd1b52bb53a6416aaeefd99',
            externalId: 'D-AP-M_BANGARUPALEM',
            name: 'BANGARUPALEM',
          },
        ],
        programName: '3.8.0 testing program',
        name: 'Infrastructure Assessment- Furniture',
        allowMultipleAssessemts: true,
      },
      {
        isRubricDriven: false,
        solutionId: '603cc85782a7f406328009e5',
        programId: '601429016a1ef53356b1d714',
        entityType: 'district',
        scoringSystem: null,
        observationId: '606d884e272a8a5f3f0f688f',
        entities: [
          {
            _id: '5fd098e2e049735a86b748b8',
            externalId: 'D_AP-D013',
            name: 'CHITTOOR',
          },
        ],
        programName: 'Regression Test Program 3.6.5',
        name: 'Enrollment challenges in SUNBIRD Courses-1614596183034',
        allowMultipleAssessemts: false,
      },
      {
        isRubricDriven: true,
        solutionId: '6052eb7e79c5f153ae7f27b8',
        programId: '605083ba09b7bd61555580fb',
        entityType: 'state',
        scoringSystem: 'pointsBasedScoring',
        observationId: '6052ee8b92978c3afb0078f7',
        criteriaLevelReport: false,
        entities: [
          {
            _id: '5fd0987e1b70ff5a40d92345',
            externalId: 'AP',
            name: 'Andhra Pradesh',
          },
        ],
        programName: '3.8 Test AP program',
        name: 'Test-observation-upload-pointBased',
        allowMultipleAssessemts: true,
      },
      {
        isRubricDriven: true,
        solutionId: '6051c03bd2c9fe2d56c365a5',
        programId: '605083ba09b7bd61555580fb',
        entityType: 'state',
        scoringSystem: 'percentage',
        observationId: '6051d7c0f39f6f3d6a493d04',
        criteriaLevelReport: true,
        entities: [
          {
            _id: '5fd0987e1b70ff5a40d92345',
            externalId: 'AP',
            name: 'Andhra Pradesh',
          },
        ],
        programName: '3.8 Test AP program',
        name: 'mutiple domains',
        allowMultipleAssessemts: true,
      },
      {
        isRubricDriven: false,
        solutionId: '6054abd9823d601f0af5c3a0',
        programId: '60545d541fc23d6d2d44c0c9',
        entityType: 'district',
        scoringSystem: null,
        observationId: '60587848129c8857da854d9e',
        entities: [
          {
            _id: '5fd098e2e049735a86b748b8',
            externalId: 'D_AP-D013',
            name: 'CHITTOOR',
          },
        ],
        programName: '3.8.0 testing program - 2',
        name: 'Obs Form for All Question type',
        allowMultipleAssessemts: true,
      },
      {
        isRubricDriven: true,
        solutionId: '605084a02df993615443f06a',
        programId: '605083ba09b7bd61555580fb',
        entityType: 'state',
        scoringSystem: 'percentage',
        observationId: '605089622df993615443f06f',
        criteriaLevelReport: true,
        entities: [
          {
            _id: '5fd0987e1b70ff5a40d92345',
            externalId: 'AP',
            name: 'Andhra Pradesh',
          },
        ],
        programName: '3.8 Test AP program',
        name: 'multiple domain and multiple criteria 2',
        allowMultipleAssessemts: true,
      },
    ],
  },
  responseCode: 'OK',
};

export const EntityClick = {
  isTrusted: true,
  target: {
    value: 'block',
  },
};

export const ModalEventData = {
  value: {
  solutionDetail: {
    isRubricDriven: false,
    solutionId: '60aa18c68b5424712b5faf16',
    programId: '601429016a1ef53356b1d714',
    entityType: 'district',
    observationId: '60be1a584bb0a824895b9735',
    scoringSystem: null,
    criteriaLevelReport: false,
    entities: [
      {
        _id: '5fd098e2e049735a86b748ac',
        externalId: 'D_AP-D001',
        name: 'SRIKAKULAM',
        selected: false,
      },
      {
        _id: '5fd098e2e049735a86b748b7',
        externalId: 'D_AP-D012',
        name: 'ANANTAPUR',
        selected: true,
      },
    ],
    programName: 'School development Program',
    name: 'Enrollment challenges in SUNBIRD Courses-1621760198612',
    allowMultipleAssessemts: false,
  },
  selectedEntity: {
    _id: '5fd098e2e049735a86b748b7',
    externalId: 'D_AP-D012',
    name: 'ANANTAPUR',
    selected: true,
  },
}
};
