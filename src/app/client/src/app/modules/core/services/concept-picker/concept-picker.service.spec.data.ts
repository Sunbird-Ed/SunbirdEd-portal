export const mockRes = {
  conceptData: {
    'id': 'api.v1.search',
    'ver': '1.0',
    'ts': '2018-04-23T15:08:27.918Z',
    'params': {
      'resmsgid': '2d3e7ae0-4708-11e8-b10f-411864e4cde7',
      'msgid': '2d321ed0-4708-11e8-a1f8-67cddbb881dd',
      'status': 'successful',
      'err': null,
      'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
      'concepts': [
        {
          'identifier': 'C532',
          'code': 'C532',
          'keywords': [
            'Funtoot',
            'Misconception'
          ],
          'consumerId': 'f6878ac4-e9c9-4bc4-80be-298c5a73b447',
          'subject': 'numeracy',
          'channel': 'in.ekstep',
          'description': 'Understand where ver (not write it in the sum) e.g. 25+7=212 instead of 32',
          'graph_id': 'domain',
          'nodeType': 'DATA_NODE',
          'createdOn': '2016-06-30T11:45:48.108+0000',
          'versionKey': '1496662627673',
          'objectType': 'Concept',
          'appId': 'dev.ekstep.in',
          'name': 'Write number being carried over on the next column',
          'lastUpdatedOn': '2017-06-05T11:37:07.673+0000',
          'GradeLevel': 'Grade 2',
          'status': 'Live',
          'node_id': 91072
        },
        {
          'identifier': 'C249',
          'code': 'C249',
          'consumerId': 'f6878ac4-e9c9-4bc4-80be-298c5a73b447',
          'subject': 'numeracy',
          'channel': 'in.ekstep',
          'description': 'Write numbers vertically for addition',
          'graph_id': 'domain',
          'nodeType': 'DATA_NODE',
          'createdOn': '2016-06-30T11:45:48.108+0000',
          'versionKey': '1496662627546',
          'objectType': 'Concept',
          'appId': 'dev.ekstep.in',
          'name': 'Write numbers vertically for addition',
          'lastUpdatedOn': '2017-06-05T11:37:07.546+0000',
          'status': 'Live',
          'node_id': 91071
        }
      ],
      'count': 2
    }
  },
  domainData: {
    'id': 'api.v1.search',
    'ver': '1.0',
    'ts': '2018-04-23T15:08:30.324Z',
    'params': {
      'resmsgid': '2ead9b40-4708-11e8-b10f-411864e4cde7',
      'msgid': '2ea2ece0-4708-11e8-a1f8-67cddbb881dd',
      'status': 'successful',
      'err': null,
      'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
      'count': 32,
      'domains': [
        {
          'identifier': 'AI',
          'code': 'AI',
          'keywords': [
            'Subject',
            'AI'
          ],
          'subject': 'Artificial_Intelligence',
          'consumerId': '72e54829-6402-4cf0-888e-9b30733c1b88',
          'channel': 'in.ekstep',
          'graph_id': 'domain',
          'nodeType': 'DATA_NODE',
          'createdOn': '2018-02-28T13:17:58.507+0000',
          'versionKey': '1519823878507',
          'objectType': 'Domain',
          'children': [
            'AI1',
            'AI3',
            'AI4',
            'AI2'
          ],
          'appId': 'ekstep_portal',
          'name': 'Artificial_Intelligence',
          'lastUpdatedOn': '2018-02-28T13:17:58.507+0000',
          'status': 'Live',
          'node_id': 31087
        }
      ],
      'dimensions': [
        {
          'identifier': 'SD1',
          'parent': [
            'science'
          ],
          'code': 'SD1',
          'keywords': [
            'Dimension'
          ],
          'consumerId': 'f6878ac4-e9c9-4bc4-80be-298c5a73b447',
          'subject': 'science',
          'channel': 'in.ekstep',
          'description': 'Physics',
          'graph_id': 'domain',
          'nodeType': 'DATA_NODE',
          'createdOn': '2016-12-05T13:27:42.934+0530',
          'versionKey': '1496769637626',
          'objectType': 'Dimension',
          'Language': 'English',
          'children': [
            'SC1',
            'SC2',
            'SC3',
            'SC4'
          ],
          'appId': 'dev.ekstep.in',
          'name': 'Physics',
          'lastUpdatedOn': '2017-06-06T17:20:37.626+0000',
          'status': 'Live',
          'node_id': 93925
        },
        {
          'parent': [
            'AI'
          ],
          'identifier': 'AI4',
          'code': 'AI4',
          'keywords': [
            'Topic',
            'AI'
          ],
          'subject': 'Artificial_Intelligence',
          'consumerId': '72e54829-6402-4cf0-888e-9b30733c1b88',
          'channel': 'in.ekstep',
          'graph_id': 'domain',
          'nodeType': 'DATA_NODE',
          'createdOn': '2018-02-28T13:18:00.225+0000',
          'versionKey': '1519823880225',
          'objectType': 'Dimension',
          'children': [
            'AI44',
            'AI41',
            'AI45',
            'AI43',
            'AI47',
            'AI411',
            'AI42',
            'AI46',
            'AI410',
            'AI414',
            'AI48',
            'AI412',
            'AI49',
            'AI413'
          ],
          'appId': 'ekstep_portal',
          'name': 'Programming',
          'lastUpdatedOn': '2018-02-28T13:18:00.225+0000',
          'status': 'Live',
          'node_id': 31119
        },
        {
          'identifier': 'LD1',
          'parent': [
            'literacy'
          ],
          'code': 'LD1',
          'keywords': [
            'Dimension'
          ],
          'consumerId': 'f6878ac4-e9c9-4bc4-80be-298c5a73b447',
          'subject': 'literacy',
          'channel': 'in.ekstep',
          'description': 'Building agenguage literacy. Vocabulary expands as the child grows.',
          'graph_id': 'domain',
          'nodeType': 'DATA_NODE',
          'Subject': 'literacy',
          'versionKey': '1496769636629',
          'objectType': 'Dimension',
          'children': [
            'LO1',
            'LO50',
            'LO51',
            'LO52',
            'LO53'
          ],
          'appId': 'dev.ekstep.in',
          'name': 'Vocabulary',
          'lastUpdatedOn': '2017-06-06T17:20:36.629+0000',
          'status': 'Live',
          'node_id': 250
        }
      ]
    }
  },
  cachedConceptData: {
    'value': [
      {
        'id': 'AI',
        'name': 'Artificial_Intelligence',
        'nodes': [
          {
            'id': 'AI3',
            'name': 'Deep_Learning',
            'nodes': [
              {
                'id': 'AI31',
                'name': '(Artificial) Neural Network',
                'selectable': 'selectable',
                'nodes': []
              },
              {
                'id': 'AI34',
                'name': 'Convolutional_Neural_Network',
                'selectable': 'selectable',
                'nodes': []
              },
              {
                'id': 'AI36',
                'name': 'Multilayer_Perceptron',
                'selectable': 'selectable',
                'nodes': []
              },
              {
                'id': 'AI32',
                'name': 'Neuron',
                'selectable': 'selectable',
                'nodes': []
              },
              {
                'id': 'AI33',
                'name': 'Perceptron',
                'selectable': 'selectable',
                'nodes': []
              },
              {
                'id': 'AI37',
                'name': 'RELU',
                'selectable': 'selectable',
                'nodes': []
              },
              {
                'id': 'AI35',
                'name': 'Softmax',
                'selectable': 'selectable',
                'nodes': []
              }
            ]
          },
          {
            'id': 'AI1',
            'name': 'Machine_Learning',
            'nodes': [
              {
                'id': 'AI17',
                'name': 'Convergence_Criteria',
                'selectable': 'selectable',
                'nodes': []
              },
              {
                'id': 'AI15',
                'name': 'Principal_Component_Analysis',
                'selectable': 'selectable',
                'nodes': []
              },
              {
                'id': 'AI12',
                'name': 'Regression_Analysis',
                'selectable': 'selectable',
                'nodes': []
              },
              {
                'id': 'AI16',
                'name': 'Stochastic_Gradient_Descent',
                'selectable': 'selectable',
                'nodes': []
              },
              {
                'id': 'AI13',
                'name': 'Supervised_Learning',
                'selectable': 'selectable',
                'nodes': []
              },
              {
                'id': 'AI11',
                'name': 'Support_Vector_Machine',
                'selectable': 'selectable',
                'nodes': []
              },
              {
                'id': 'AI14',
                'name': 'Unsupervised_Learning',
                'selectable': 'selectable',
                'nodes': []
              }
            ]
          },
          {
            'id': 'AI2',
            'name': 'Mathematics_for_AI',
            'nodes': [
              {
                'id': 'AI21',
                'name': 'Automatic_Differentiation',
                'selectable': 'selectable',
                'nodes': []
              },
              {
                'id': 'AI28',
                'name': 'Dimensionality_Reduction',
                'selectable': 'selectable',
                'nodes': []
              },
              {
                'id': 'AI24',
                'name': 'Dot_Product',
                'selectable': 'selectable',
                'nodes': []
              },
              {
                'id': 'AI27',
                'name': 'Gradient_Descent',
                'selectable': 'selectable',
                'nodes': []
              },
              {
                'id': 'AI23',
                'name': 'Heaviside_Step_Function',
                'selectable': 'selectable',
                'nodes': []
              },
              {
                'id': 'AI22',
                'name': 'Linear_Algebra',
                'selectable': 'selectable',
                'nodes': []
              },
              {
                'id': 'AI29',
                'name': 'Markov_Chain_Monte_Carlo',
                'selectable': 'selectable',
                'nodes': []
              },
              {
                'id': 'AI26',
                'name': 'Probability',
                'selectable': 'selectable',
                'nodes': []
              },
              {
                'id': 'AI25',
                'name': 'Singular_Value_Decomposition',
                'selectable': 'selectable',
                'nodes': []
              }
            ]
          },
          {
            'id': 'AI4',
            'name': 'Programming',
            'nodes': [
              {
                'id': 'AI410',
                'name': 'Benchmarking',
                'selectable': 'selectable',
                'nodes': []
              },
              {
                'id': 'AI44',
                'name': 'Broadcasting',
                'selectable': 'selectable',
                'nodes': []
              },
              {
                'id': 'AI412',
                'name': 'Distributed_Arrays',
                'selectable': 'selectable',
                'nodes': []
              },
              {
                'id': 'AI43',
                'name': 'Flux',
                'selectable': 'selectable',
                'nodes': []
              },
              {
                'id': 'AI48',
                'name': 'Functions',
                'selectable': 'selectable',
                'nodes': []
              },
              {
                'id': 'AI411',
                'name': 'GPUS',
                'selectable': 'selectable',
                'nodes': []
              },
              {
                'id': 'AI41',
                'name': 'Julia',
                'selectable': 'selectable',
                'nodes': []
              },
              {
                'id': 'AI47',
                'name': 'Loops',
                'selectable': 'selectable',
                'nodes': []
              },
              {
                'id': 'AI414',
                'name': 'Mutlithreading',
                'selectable': 'selectable',
                'nodes': []
              },
              {
                'id': 'AI42',
                'name': 'MXNet',
                'selectable': 'selectable',
                'nodes': []
              },
              {
                'id': 'AI46',
                'name': 'Strings',
                'selectable': 'selectable',
                'nodes': []
              },
              {
                'id': 'AI413',
                'name': 'Type_Stability',
                'selectable': 'selectable',
                'nodes': []
              },
              {
                'id': 'AI49',
                'name': 'Types',
                'selectable': 'selectable',
                'nodes': []
              },
              {
                'id': 'AI45',
                'name': 'Vectors_of_Vectors',
                'selectable': 'selectable',
                'nodes': []
              }
            ]
          }
        ]
      },
      {
        'id': 'literacy',
        'name': 'Literacy V3',
        'nodes': [
          {
            'id': 'LD3',
            'name': 'Akshara Knowledge',
            'nodes': [
              {
                'id': 'do_112300246933831680110',
                'name': 'abcd',
                'selectable': 'selectable',
                'nodes': []
              }
            ]
          },
          {
            'id': 'LD2',
            'name': 'Comprehension',
            'nodes': [
              {
                'id': 'LO43',
                'name': 'Inference About Implied Ideas',
                'selectable': 'selectable',
                'nodes': []
              }
            ]
          },
          {
            'id': 'LD4',
            'name': 'Decoding & Fluency',
            'nodes': []
          },
          {
            'id': 'LD7',
            'name': 'Expression',
            'nodes': []
          },
          {
            'id': 'LD6',
            'name': 'Phonological Awareness',
            'nodes': []
          },
          {
            'id': 'LD1',
            'name': 'Vocabulary',
            'nodes': [
              {
                'id': 'LO1',
                'name': 'Word Meaning',
                'selectable': 'selectable',
                'nodes': []
              }
            ]
          }
        ]
      },
      {
        'id': 'ncf',
        'name': 'National Curriculum',
        'nodes': [
          {
            'id': 'BIO',
            'name': 'Biology',
            'nodes': [
              {
                'id': 'BIO1',
                'name': 'Animals',
                'selectable': 'selectable',
                'nodes': [
                  {
                    'id': 'BIO10',
                    'name': 'Organs_and_Organ_Systems',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'BIO11',
                    'name': 'Physiology',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'BIO12',
                    'name': 'Tissues',
                    'selectable': 'selectable',
                    'nodes': []
                  }
                ]
              },
              {
                'id': 'BIO2',
                'name': 'Human_Anatomy_and_Physiology',
                'selectable': 'selectable',
                'nodes': [
                  {
                    'id': 'BIO20',
                    'name': 'Circulatory_System',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'BIO21',
                    'name': 'Digestive_System',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'BIO22',
                    'name': 'Endocrine_System',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'BIO23',
                    'name': 'Excretory_System',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'BIO24',
                    'name': 'Musculoskeletal_System',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'BIO25',
                    'name': 'Nervous_System',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'BIO26',
                    'name': 'Reproductive_System',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'BIO27',
                    'name': 'Respiratory_System',
                    'selectable': 'selectable',
                    'nodes': []
                  }
                ]
              },
              {
                'id': 'BIO3',
                'name': 'Human_Welfare',
                'selectable': 'selectable',
                'nodes': [
                  {
                    'id': 'BIO30',
                    'name': 'Animal_Husbandry',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'BIO31',
                    'name': 'Biotechnology',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'BIO32',
                    'name': 'Food_and_Nutrition',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'BIO33',
                    'name': 'Food_and_Plant_Breeding',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'BIO34',
                    'name': 'Health_and_Disease',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'BIO35',
                    'name': 'Microbes',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'BIO36',
                    'name': 'Textiles',
                    'selectable': 'selectable',
                    'nodes': []
                  }
                ]
              },
              {
                'id': 'BIO4',
                'name': 'Living_World',
                'selectable': 'selectable',
                'nodes': [
                  {
                    'id': 'BIO40',
                    'name': 'Biological_Classification',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'BIO41',
                    'name': 'Cells',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'BIO42',
                    'name': 'Ecology',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'BIO43',
                    'name': 'Genetics_and_Evolution',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'BIO44',
                    'name': 'Metabolism',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'BIO45',
                    'name': 'Natural_Phenomena',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'BIO46',
                    'name': 'Natural_Resources',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'BIO47',
                    'name': 'Senescence',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'BIO48',
                    'name': 'Taxonomical_Aids',
                    'selectable': 'selectable',
                    'nodes': []
                  }
                ]
              },
              {
                'id': 'BIO5',
                'name': 'Plant_Physiology',
                'selectable': 'selectable',
                'nodes': [
                  {
                    'id': 'BIO50',
                    'name': 'Coordination_and_Transport',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'BIO51',
                    'name': 'Growth_and_Reproduction',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'BIO52',
                    'name': 'Photosynthesis',
                    'selectable': 'selectable',
                    'nodes': []
                  }
                ]
              }
            ]
          },
          {
            'id': 'CHEM',
            'name': 'Chemistry',
            'nodes': [
              {
                'id': 'CHEM1',
                'name': 'Atoms_and_Molecules',
                'selectable': 'selectable',
                'nodes': [
                  {
                    'id': 'CHEM10',
                    'name': 'Chemical_Bonding',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'CHEM11',
                    'name': 'Matter_and_Measurements',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'CHEM12',
                    'name': 'Molecular_Structure',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'CHEM13',
                    'name': 'Periodic_Classification',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'CHEM14',
                    'name': 'Solid_State',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'CHEM15',
                    'name': 'Solutions',
                    'selectable': 'selectable',
                    'nodes': []
                  }
                ]
              },
              {
                'id': 'CHEM2',
                'name': 'Chemical_Reactions',
                'selectable': 'selectable',
                'nodes': [
                  {
                    'id': 'CHEM20',
                    'name': 'Coordination_Compounds',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'CHEM21',
                    'name': 'Electrochemistry',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'CHEM22',
                    'name': 'Equilibrium',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'CHEM23',
                    'name': 'Isolation_Of_Elements',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'CHEM24',
                    'name': 'Kinetics',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'CHEM25',
                    'name': 'Surface_Chemistry',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'CHEM26',
                    'name': 'Thermodynamics',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'CHEM27',
                    'name': 'Types_Of_Reaction',
                    'selectable': 'selectable',
                    'nodes': []
                  }
                ]
              },
              {
                'id': 'CHEM3',
                'name': 'Environmental_Chemistry',
                'selectable': 'selectable',
                'nodes': [
                  {
                    'id': 'CHEM31',
                    'name': 'Green_Technologies',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'CHEM32',
                    'name': 'Industrial_Waste',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'CHEM33',
                    'name': 'Pollution_and_Its_Control',
                    'selectable': 'selectable',
                    'nodes': []
                  }
                ]
              },
              {
                'id': 'CHEM4',
                'name': 'Everyday_Chemistry',
                'selectable': 'selectable',
                'nodes': [
                  {
                    'id': 'CHEM41',
                    'name': 'Health',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'CHEM42',
                    'name': 'Household',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'CHEM43',
                    'name': 'Resource_Management',
                    'selectable': 'selectable',
                    'nodes': []
                  }
                ]
              },
              {
                'id': 'CHEM5',
                'name': 'Organic_Chemistry',
                'selectable': 'selectable',
                'nodes': [
                  {
                    'id': 'CHEM51',
                    'name': 'Biomolecules',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'CHEM52',
                    'name': 'Functional_Groups',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'CHEM53',
                    'name': 'Haloalkanes_and_Haloarenes',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'CHEM54',
                    'name': 'Hydrocarbons',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'CHEM55',
                    'name': 'Organic_Compounds_and_Reactions',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'CHEM56',
                    'name': 'Polymers',
                    'selectable': 'selectable',
                    'nodes': []
                  }
                ]
              }
            ]
          },
          {
            'id': 'PHY',
            'name': 'Physics',
            'nodes': [
              {
                'id': 'PHY1',
                'name': 'Electricity_and_Magnetism',
                'selectable': 'selectable',
                'nodes': [
                  {
                    'id': 'PHY10',
                    'name': 'Current_Electricity',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'PHY11',
                    'name': 'Electromagnetism',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'PHY12',
                    'name': 'Electrostatics',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'PHY13',
                    'name': 'Magnetostatics',
                    'selectable': 'selectable',
                    'nodes': []
                  }
                ]
              },
              {
                'id': 'PHY2',
                'name': 'Electronics',
                'selectable': 'selectable',
                'nodes': [
                  {
                    'id': 'PHY20',
                    'name': 'Communication_Systems',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'PHY21',
                    'name': 'Electronic_Devices',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'PHY22',
                    'name': 'Semiconductors',
                    'selectable': 'selectable',
                    'nodes': []
                  }
                ]
              },
              {
                'id': 'PHY3',
                'name': 'Heat_and_Thermodynamics',
                'selectable': 'selectable',
                'nodes': [
                  {
                    'id': 'PHY30',
                    'name': 'Change_Of_State',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'PHY31',
                    'name': 'Laws_Of_Thermodynamics',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'PHY32',
                    'name': 'Properties_Of_Gases',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'PHY33',
                    'name': 'Thermal_Properties',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'PHY34',
                    'name': 'Thermodynamic_Processes',
                    'selectable': 'selectable',
                    'nodes': []
                  }
                ]
              },
              {
                'id': 'PHY4',
                'name': 'Matter_and_Radiation',
                'selectable': 'selectable',
                'nodes': [
                  {
                    'id': 'PHY40',
                    'name': 'Atoms_and_Atomic_Spectra',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'PHY41',
                    'name': 'Nuclear_Energy',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'PHY42',
                    'name': 'Nuclei_and_Radioactivity',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'PHY43',
                    'name': 'Photoelectricity',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'PHY44',
                    'name': 'Wave-Particle_Duality',
                    'selectable': 'selectable',
                    'nodes': []
                  }
                ]
              },
              {
                'id': 'PHY5',
                'name': 'Mechanics',
                'selectable': 'selectable',
                'nodes': [
                  {
                    'id': 'PHY50',
                    'name': 'Energy',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'PHY51',
                    'name': 'Motion',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'PHY52',
                    'name': 'Properties_Of_Fluids',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'PHY53',
                    'name': 'Properties_Of_Solids',
                    'selectable': 'selectable',
                    'nodes': []
                  }
                ]
              },
              {
                'id': 'PHY6',
                'name': 'Optics',
                'selectable': 'selectable',
                'nodes': [
                  {
                    'id': 'PHY60',
                    'name': 'Optical_Instruments',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'PHY61',
                    'name': 'Ray_Optics',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'PHY62',
                    'name': 'Wave_Optics',
                    'selectable': 'selectable',
                    'nodes': []
                  }
                ]
              },
              {
                'id': 'PHY7',
                'name': 'Oscillations_and_Waves',
                'selectable': 'selectable',
                'nodes': [
                  {
                    'id': 'PHY70',
                    'name': 'Electromagnetic_Waves',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'PHY71',
                    'name': 'Periodic_Motion',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'PHY72',
                    'name': 'Sound',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'PHY73',
                    'name': 'Wave_Motion',
                    'selectable': 'selectable',
                    'nodes': []
                  }
                ]
              },
              {
                'id': 'PHY8',
                'name': 'Physical_World',
                'selectable': 'selectable',
                'nodes': [
                  {
                    'id': 'PHY80',
                    'name': 'Fundamental_Forces',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'PHY82',
                    'name': 'Theories,_Laws_and_Models',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'PHY81',
                    'name': 'Units_and_Measurements',
                    'selectable': 'selectable',
                    'nodes': []
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        'id': 'numeracy',
        'name': 'Numeracy',
        'nodes': [
          {
            'id': 'D5',
            'name': 'Data Handling',
            'nodes': [
              {
                'id': 'C26',
                'name': 'Introduction to Data Handling',
                'selectable': 'selectable',
                'nodes': [
                  {
                    'id': 'C149',
                    'name': 'Collection and Organization of Data',
                    'selectable': 'selectable',
                    'nodes': [
                      {
                        'id': 'C421',
                        'name': 'Application of Graph',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C420',
                        'name': 'Frequency Table',
                        'selectable': 'selectable',
                        'nodes': []
                      }
                    ]
                  },
                  {
                    'id': 'C148',
                    'name': 'Grouped and Ungrouped Data',
                    'selectable': 'selectable',
                    'nodes': [
                      {
                        'id': 'C418',
                        'name': 'Class Limits',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C416',
                        'name': 'Group and Ungroup data',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C417',
                        'name': 'Types of Data',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C419',
                        'name': 'Types of variables',
                        'selectable': 'selectable',
                        'nodes': []
                      }
                    ]
                  }
                ]
              },
              {
                'id': 'C27',
                'name': 'Pictograph',
                'selectable': 'selectable',
                'nodes': [
                  {
                    'id': 'C422',
                    'name': 'Drawing Pictograph',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'C423',
                    'name': 'Intepretation of Pictograph',
                    'selectable': 'selectable',
                    'nodes': []
                  }
                ]
              }
            ]
          },
          {
            'id': 'D1',
            'name': 'Geometry',
            'nodes': [
              {
                'id': 'C2',
                'name': '2D Shape/ Patterns',
                'selectable': 'selectable',
                'nodes': [
                  {
                    'id': 'C33',
                    'name': 'Angles',
                    'selectable': 'selectable',
                    'nodes': [
                      {
                        'id': 'C160',
                        'name': 'Draw and trace right angle, acute angle an obtuse angle',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C158',
                        'name': 'Identify different angles',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C157',
                        'name': 'Understand angles through objects/shapes',
                        'selectable': 'selectable',
                        'nodes': []
                      }
                    ]
                  },
                  {
                    'id': 'C35',
                    'name': 'Draw, make 2D shapes',
                    'selectable': 'selectable',
                    'nodes': [
                      {
                        'id': 'C162',
                        'name': 'Draw 2D shapes',
                        'selectable': 'selectable',
                        'nodes': [
                          {
                            'id': 'C657',
                            'name': 'Drawing circles using compass',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C164',
                            'name': 'Identify and cut 2D shapes',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C658',
                            'name': 'Make shapes using Tangrams; tile an area using shapes',
                            'selectable': 'selectable',
                            'nodes': []
                          }
                        ]
                      },
                      {
                        'id': 'C168',
                        'name': 'Make patterns',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C161',
                        'name': 'Trace outline of objects',
                        'selectable': 'selectable',
                        'nodes': []
                      }
                    ]
                  },
                  {
                    'id': 'C31',
                    'name': 'Identify, distinguish and match patterns\n',
                    'selectable': 'selectable',
                    'nodes': [
                      {
                        'id': 'C156',
                        'name': 'Distinguish different types of lines used in patterns',
                        'selectable': 'selectable',
                        'nodes': []
                      }
                    ]
                  },
                  {
                    'id': 'C29',
                    'name': 'Lines',
                    'selectable': 'selectable',
                    'nodes': [
                      {
                        'id': 'C151',
                        'name': 'Distinguish Straight lines vs Curved lines',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C152',
                        'name': 'Distinguish straight, horizontal and slanting lines',
                        'selectable': 'selectable',
                        'nodes': [
                          {
                            'id': 'C654',
                            'name': 'Identify horizontal or sleeping lines',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C656',
                            'name': 'Identify slanting lines',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C655',
                            'name': 'Identify vertical or standing lines',
                            'selectable': 'selectable',
                            'nodes': []
                          }
                        ]
                      },
                      {
                        'id': 'C154',
                        'name': 'Draw curved lines',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C153',
                        'name': 'Draw Straight Lines',
                        'selectable': 'selectable',
                        'nodes': []
                      }
                    ]
                  },
                  {
                    'id': 'C39',
                    'name': 'Properties of shapes and patterns',
                    'selectable': 'selectable',
                    'nodes': [
                      {
                        'id': 'C186',
                        'name': 'Describe properties of 2D shapes (using appropriate names and vocabulary)',
                        'selectable': 'selectable',
                        'nodes': [
                          {
                            'id': 'C669',
                            'name': 'Properties of a circle or circular shape',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C668',
                            'name': 'Properties of a rectangle',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C666',
                            'name': 'Properties of a square',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C667',
                            'name': 'Properties of a triangle',
                            'selectable': 'selectable',
                            'nodes': []
                          }
                        ]
                      },
                      {
                        'id': 'C185',
                        'name': 'Describe properties of 2D shapes intuitively',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C182',
                        'name': 'Identify geometrical patterns based on symmetry',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C180',
                        'name': 'Identify simple 2D shapes by name',
                        'selectable': 'selectable',
                        'nodes': [
                          {
                            'id': 'C665',
                            'name': 'Collinear points cannot make a triange',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C664',
                            'name': '',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C662',
                            'name': 'Identify a circle or a circular shape',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C661',
                            'name': 'Identify a rectangle/ rectange like shape',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C660',
                            'name': 'Identify a square/square like shapes.',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C659',
                            'name': 'Identify triangle or a triangular shape',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C663',
                            'name': 'Identify vertex of a triangle',
                            'selectable': 'selectable',
                            'nodes': []
                          }
                        ]
                      },
                      {
                        'id': 'C181',
                        'name': 'Identify symmetrical shapes in patterns',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C183',
                        'name': 'Match and sort 2D shapes',
                        'selectable': 'selectable',
                        'nodes': []
                      }
                    ]
                  },
                  {
                    'id': 'C38',
                    'name': 'Rotations and reflections',
                    'selectable': 'selectable',
                    'nodes': [
                      {
                        'id': 'C176',
                        'name': 'Explore reflections in patterns',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C179',
                        'name': 'Explore reflections in patterns',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C178',
                        'name': 'Identify patterns in mirror images',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C177',
                        'name': 'Identify patterns in paper folding',
                        'selectable': 'selectable',
                        'nodes': []
                      }
                    ]
                  },
                  {
                    'id': 'C36',
                    'name': 'Sequence in shapes and patterns',
                    'selectable': 'selectable',
                    'nodes': [
                      {
                        'id': 'C173',
                        'name': 'Idenify and extend cyclical patterns',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C170',
                        'name': 'Idenify and extend repeating patterns',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C172',
                        'name': 'Idenify and extend upside down and inverted patterns',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C171',
                        'name': 'Identify and extend turning and revolving patterns',
                        'selectable': 'selectable',
                        'nodes': []
                      }
                    ]
                  },
                  {
                    'id': 'do_112237255013638144117',
                    'name': 'Test Concept',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'C41',
                    'name': 'Understand area and perimeter intuitively',
                    'selectable': 'selectable',
                    'nodes': []
                  }
                ]
              },
              {
                'id': 'C3',
                'name': '3D Objects',
                'selectable': 'selectable',
                'nodes': [
                  {
                    'id': 'C48',
                    'name': 'Convert 3D to 2D shapes',
                    'selectable': 'selectable',
                    'nodes': [
                      {
                        'id': 'C202',
                        'name': 'Drawing a 3-D object in 2-D.',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C200',
                        'name': 'Identifyobjects by observing their shadows',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C201',
                        'name': 'Read 3D objects',
                        'selectable': 'selectable',
                        'nodes': []
                      }
                    ]
                  },
                  {
                    'id': 'C43',
                    'name': 'Make, Draw 3D shapes',
                    'selectable': 'selectable',
                    'nodes': [
                      {
                        'id': 'C189',
                        'name': 'Draw 3D objects',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C191',
                        'name': 'Make objects : cylinders, cones',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C190',
                        'name': 'Make objects: cubes',
                        'selectable': 'selectable',
                        'nodes': []
                      }
                    ]
                  },
                  {
                    'id': 'C42',
                    'name': 'Observe, Identify 3D objects',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'C44',
                    'name': 'Understand properties of 3D shapes',
                    'selectable': 'selectable',
                    'nodes': [
                      {
                        'id': 'C194',
                        'name': 'Identify objects that can be stacked',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C195',
                        'name': 'Identify objects that can roll and slide',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C193',
                        'name': 'Properties of shapes and patterns',
                        'selectable': 'selectable',
                        'nodes': [
                          {
                            'id': 'C673',
                            'name': 'Properties of a cube',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C674',
                            'name': 'Properties of cuboid',
                            'selectable': 'selectable',
                            'nodes': []
                          }
                        ]
                      },
                      {
                        'id': 'C192',
                        'name': 'Understand and identify symmetry in 3D shapes',
                        'selectable': 'selectable',
                        'nodes': []
                      }
                    ]
                  }
                ]
              },
              {
                'id': 'C1',
                'name': 'Develop spatial understanding',
                'selectable': 'selectable',
                'nodes': [
                  {
                    'id': 'C28',
                    'name': 'Spatial relations vocabulary',
                    'selectable': 'selectable',
                    'nodes': []
                  }
                ]
              }
            ]
          },
          {
            'id': 'testDimension1',
            'name': 'Measurement',
            'nodes': []
          },
          {
            'id': 'D4',
            'name': 'Measurement',
            'nodes': [
              {
                'id': 'C25',
                'name': 'Money',
                'selectable': 'selectable',
                'nodes': [
                  {
                    'id': 'C146',
                    'name': 'Converting Money',
                    'selectable': 'selectable',
                    'nodes': [
                      {
                        'id': 'C409',
                        'name': 'Combination of notes and coins',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C410',
                        'name': 'Convering Money',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C411',
                        'name': 'Fractional and decimal notations',
                        'selectable': 'selectable',
                        'nodes': []
                      }
                    ]
                  },
                  {
                    'id': 'C145',
                    'name': 'Introduction to money',
                    'selectable': 'selectable',
                    'nodes': [
                      {
                        'id': 'C405',
                        'name': 'Different denominations of money',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C407',
                        'name': 'Estimate the price of objects',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C408',
                        'name': 'Symbol of Rupee',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C406',
                        'name': 'Uses of Money',
                        'selectable': 'selectable',
                        'nodes': []
                      }
                    ]
                  },
                  {
                    'id': 'C147',
                    'name': 'Operations on money',
                    'selectable': 'selectable',
                    'nodes': [
                      {
                        'id': 'C412',
                        'name': 'Add money',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C415',
                        'name': 'Divide money',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C414',
                        'name': 'Multiply money',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C413',
                        'name': 'Subtract money',
                        'selectable': 'selectable',
                        'nodes': []
                      }
                    ]
                  }
                ]
              },
              {
                'id': 'C22',
                'name': 'Weight',
                'selectable': 'selectable',
                'nodes': [
                  {
                    'id': 'C131',
                    'name': 'Arithmatic operations with Weight',
                    'selectable': 'selectable',
                    'nodes': [
                      {
                        'id': 'C352',
                        'name': 'Addition of weight',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C354',
                        'name': 'Multiplication of weight',
                        'selectable': 'selectable',
                        'nodes': []
                      }
                    ]
                  },
                  {
                    'id': 'C130',
                    'name': 'Measuring Devices',
                    'selectable': 'selectable',
                    'nodes': [
                      {
                        'id': 'C351',
                        'name': 'Comman balance',
                        'selectable': 'selectable',
                        'nodes': []
                      }
                    ]
                  },
                  {
                    'id': 'C126',
                    'name': 'Weight using a non-standard metric',
                    'selectable': 'selectable',
                    'nodes': [
                      {
                        'id': 'C336',
                        'name': 'Compare weights with non-standard metrics',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C339',
                        'name': 'Estimate weight with non-standard metrics',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C338',
                        'name': 'Measure weight with non-standard metrics',
                        'selectable': 'selectable',
                        'nodes': []
                      }
                    ]
                  },
                  {
                    'id': 'C127',
                    'name': 'Weight using a standard metric',
                    'selectable': 'selectable',
                    'nodes': [
                      {
                        'id': 'C341',
                        'name': 'Estimate weight with standard metrics',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C340',
                        'name': 'Measure weight with standard metrics',
                        'selectable': 'selectable',
                        'nodes': []
                      }
                    ]
                  },
                  {
                    'id': 'C335',
                    'name': 'Weight Vocabulary',
                    'selectable': 'selectable',
                    'nodes': []
                  }
                ]
              }
            ]
          },
          {
            'id': 'D2',
            'name': 'Number sense',
            'nodes': [
              {
                'id': 'C6',
                'name': 'Counting',
                'selectable': 'selectable',
                'nodes': [
                  {
                    'id': 'C49',
                    'name': 'Counting objects',
                    'selectable': 'selectable',
                    'nodes': [
                      {
                        'id': 'C212',
                        'name': 'Count collections of objects',
                        'selectable': 'selectable',
                        'nodes': [
                          {
                            'id': 'C203',
                            'name': 'Counting in groups of 10s',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C432',
                            'name': 'Learner counts the number of bundles incorrectly.',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C430',
                            'name': '',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C431',
                            'name': 'Learner is unable to count the objects when they are grouped.',
                            'selectable': 'selectable',
                            'nodes': []
                          }
                        ]
                      },
                      {
                        'id': 'C211',
                        'name': 'Count to 20',
                        'selectable': 'selectable',
                        'nodes': [
                          {
                            'id': 'C454',
                            'name': 'Learner counts two objects at the same number.',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C455',
                            'name': 'Learner does not know the order of numbers.',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C463',
                            'name': 'Learner enters twenty as tenteen (goes in the same rhyming as other teens).',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C466',
                            'name': '',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C465',
                            'name': 'Learner gets confused while counting the same picture, if it is shown in a different orientation.',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C464',
                            'name': 'Learner gets confused while counting the same picture, if shown in the different color.',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C456',
                            'name': 'Learner is not able to count till a specified number within a given set.',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C462',
                            'name': 'Learner is not able to follow the atypical number 12.',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C451',
                            'name': 'Learner is not able to match the number of objects and its numeral values.',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C452',
                            'name': 'Learner misses a few numbers while counting.',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C453',
                            'name': 'Learner repeats a few numbers while counting.',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C460',
                            'name': 'Learner skips all even numbers while counting.',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C459',
                            'name': 'Learner skips all odd numbers while counting.',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C457',
                            'name': 'Learner starts counting from zero.',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C458',
                            'name': 'The learner does not stop counting when the numbers are rhythemic in nature.',
                            'selectable': 'selectable',
                            'nodes': []
                          }
                        ]
                      }
                    ]
                  },
                  {
                    'id': 'C50',
                    'name': 'Decode written numbers',
                    'selectable': 'selectable',
                    'nodes': [
                      {
                        'id': 'C207',
                        'name': 'Decode numbers: 0-20',
                        'selectable': 'selectable',
                        'nodes': [
                          {
                            'id': 'C435',
                            'name': 'Learner does not know that the absence of a picture or an object is marked as zero.',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C433',
                            'name': 'Learner gets confused between the numbers 2 and 5 while writing.',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C434',
                            'name': 'Learner gets confused between the numbers 6 and 9 while writing.',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C204',
                            'name': 'Read, write, speak, identify from 1to 9',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C205',
                            'name': 'Read, write, speak, identify, understand 0',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C436',
                            'name': '',
                            'selectable': 'selectable',
                            'nodes': []
                          }
                        ]
                      },
                      {
                        'id': 'C208',
                        'name': 'Decode numbers: 10-99',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C209',
                        'name': 'Decode numbers: 3 digit numbers',
                        'selectable': 'selectable',
                        'nodes': []
                      }
                    ]
                  },
                  {
                    'id': 'C56',
                    'name': 'Estimation of quantities without counting',
                    'selectable': 'selectable',
                    'nodes': []
                  }
                ]
              },
              {
                'id': 'C8',
                'name': 'Place value',
                'selectable': 'selectable',
                'nodes': [
                  {
                    'id': 'C70',
                    'name': 'Compare numbers using place value',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'C71',
                    'name': 'Expand a number with respect to place values',
                    'selectable': 'selectable',
                    'nodes': [
                      {
                        'id': 'C506',
                        'name': 'Convert an expanded number to standard form beyond 1000',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C502',
                        'name': 'Convert an expanded number to standard form upto 1000',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C498',
                        'name': 'Convert an expanded number to standard form upto 99',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C231',
                        'name': 'Expand a number with respect to place values upto 99',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C234',
                        'name': 'Expand numbers beyond 1000',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C232',
                        'name': 'Expand numbers upto 1000',
                        'selectable': 'selectable',
                        'nodes': []
                      }
                    ]
                  },
                  {
                    'id': 'C68',
                    'name': 'Identify place value and face value of numbers',
                    'selectable': 'selectable',
                    'nodes': [
                      {
                        'id': 'C229',
                        'name': 'Identify place value of digits in a number (Indian, international system) ',
                        'selectable': 'selectable',
                        'nodes': [
                          {
                            'id': 'C501',
                            'name': 'Identify place value of a digit in Indian number system upto 99 (Indian and international system)',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C230',
                            'name': 'Understand tens and ones upto 99: count and group objects',
                            'selectable': 'selectable',
                            'nodes': []
                          }
                        ]
                      },
                      {
                        'id': 'C508',
                        'name': 'Identify the face value of a digit in a given number',
                        'selectable': 'selectable',
                        'nodes': []
                      }
                    ]
                  },
                  {
                    'id': 'C67',
                    'name': 'Vocabulary of place value',
                    'selectable': 'selectable',
                    'nodes': [
                      {
                        'id': 'C486',
                        'name': 'Use vocabulary of hundreds and above place value in Indian system',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C228',
                        'name': 'Use vocabulary of tens and ones',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C487',
                        'name': 'Vocabulary of hundreds and above place value in international system system',
                        'selectable': 'selectable',
                        'nodes': []
                      }
                    ]
                  }
                ]
              },
              {
                'id': 'C7',
                'name': 'Sequence',
                'selectable': 'selectable',
                'nodes': [
                  {
                    'id': 'C64',
                    'name': 'Compare numbers',
                    'selectable': 'selectable',
                    'nodes': [
                      {
                        'id': 'C225',
                        'name': 'Compare numbers upto 1000',
                        'selectable': 'selectable',
                        'nodes': [
                          {
                            'id': 'C484',
                            'name': 'Learner does not know how to compare the numbers using symbols of comparison.',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C482',
                            'name': 'Learner is not able to identify the largest number in the given set.',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C483',
                            'name': 'Learner is not able to identify the smallest number in the given set.',
                            'selectable': 'selectable',
                            'nodes': []
                          }
                        ]
                      },
                      {
                        'id': 'C223',
                        'name': 'Compare using numbers: 0 to 20',
                        'selectable': 'selectable',
                        'nodes': [
                          {
                            'id': 'C219',
                            'name': 'Compare using only numbers (0-20)',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C679',
                            'name': 'Compare using only numbers and dots/pictures/objects (0-20)',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C479',
                            'name': 'Learner is not able to identify the largest number in the range 0-20',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C480',
                            'name': 'Learner is not able to identify the smallest number in the range 0-20',
                            'selectable': 'selectable',
                            'nodes': []
                          }
                        ]
                      },
                      {
                        'id': 'C226',
                        'name': 'greater than less, than, equal to with symbols up to 1000',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C224',
                        'name': 'Symbols for comparison',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C481',
                        'name': 'Vocabulary of comparison: greater than, less than',
                        'selectable': 'selectable',
                        'nodes': []
                      }
                    ]
                  },
                  {
                    'id': 'C66',
                    'name': 'Mental number line',
                    'selectable': 'selectable',
                    'nodes': [
                      {
                        'id': 'C227',
                        'name': 'Identify numbers on a mental number line',
                        'selectable': 'selectable',
                        'nodes': []
                      }
                    ]
                  },
                  {
                    'id': 'C59',
                    'name': 'Ordering of numbers and objects',
                    'selectable': 'selectable',
                    'nodes': [
                      {
                        'id': 'C214',
                        'name': 'Identify, describe and extend patterns in sequence of  numbers',
                        'selectable': 'selectable',
                        'nodes': [
                          {
                            'id': 'C221',
                            'name': 'Identify patterns in square numbers and triangular numbers',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C222',
                            'name': 'Identify sequences of odd numbers between consecutive square numbers',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C470',
                            'name': 'Learner is unable to find the skipped number when the numbers are not starting from the beginning.',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C476',
                            'name': 'Sequence and patterns in numbers using even numbers',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C475',
                            'name': 'Sequence and patterns in numbers using odd numbers.',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C474',
                            'name': 'Sequence in numbers using skip counting.',
                            'selectable': 'selectable',
                            'nodes': []
                          }
                        ]
                      },
                      {
                        'id': 'C216',
                        'name': 'Indicates and identifies the position of an object in a line',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C213',
                        'name': 'Order numbers in Ascending & descending order',
                        'selectable': 'selectable',
                        'nodes': [
                          {
                            'id': 'C467',
                            'name': 'Order numbers in descending order.',
                            'selectable': 'selectable',
                            'nodes': []
                          }
                        ]
                      },
                      {
                        'id': 'C217',
                        'name': 'Ordinal numbers',
                        'selectable': 'selectable',
                        'nodes': [
                          {
                            'id': 'C471',
                            'name': 'Learner does not know how to write ordinal numbers.',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C472',
                            'name': 'Learner does not know the meaning of ordinal numbers.',
                            'selectable': 'selectable',
                            'nodes': []
                          },
                          {
                            'id': 'C473',
                            'name': 'Learner is not able to understand the given ordinal numbers.',
                            'selectable': 'selectable',
                            'nodes': []
                          }
                        ]
                      },
                      {
                        'id': 'C218',
                        'name': 'Sequencing, additive reasoning and skip counting using numbers upto 1000',
                        'selectable': 'selectable',
                        'nodes': []
                      },
                      {
                        'id': 'C215',
                        'name': 'Understand and apply whole part relationship, stable order, order irrelevance upto 100',
                        'selectable': 'selectable',
                        'nodes': [
                          {
                            'id': 'C511',
                            'name': 'Whole-part relationship in numbers',
                            'selectable': 'selectable',
                            'nodes': []
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        'id': 'science',
        'name': 'Science',
        'nodes': [
          {
            'id': 'SD6',
            'name': 'Astronomy',
            'nodes': [
              {
                'id': 'SC7',
                'name': 'Earth',
                'selectable': 'selectable',
                'nodes': []
              },
              {
                'id': 'SC6',
                'name': 'Solar System',
                'selectable': 'selectable',
                'nodes': []
              },
              {
                'id': 'SC5',
                'name': 'Universe',
                'selectable': 'selectable',
                'nodes': []
              }
            ]
          },
          {
            'id': 'SD3',
            'name': 'Biology',
            'nodes': [
              {
                'id': 'SC9',
                'name': 'Evolution',
                'selectable': 'selectable',
                'nodes': []
              },
              {
                'id': 'SC8',
                'name': 'Human Body',
                'selectable': 'selectable',
                'nodes': []
              },
              {
                'id': 'SC10',
                'name': 'Plants',
                'selectable': 'selectable',
                'nodes': []
              }
            ]
          },
          {
            'id': 'SD2',
            'name': 'Chemistry',
            'nodes': []
          },
          {
            'id': 'SD5',
            'name': 'Environment',
            'nodes': []
          },
          {
            'id': 'SD4',
            'name': 'Geology',
            'nodes': []
          },
          {
            'id': 'SD1',
            'name': 'Physics',
            'nodes': [
              {
                'id': 'SC3',
                'name': 'Energy',
                'selectable': 'selectable',
                'nodes': []
              },
              {
                'id': 'SC2',
                'name': 'Light',
                'selectable': 'selectable',
                'nodes': [
                  {
                    'id': 'SMC4',
                    'name': 'Properties of Light',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'SMC5',
                    'name': 'Understanding Colors',
                    'selectable': 'selectable',
                    'nodes': []
                  }
                ]
              },
              {
                'id': 'SC4',
                'name': 'Matter',
                'selectable': 'selectable',
                'nodes': []
              },
              {
                'id': 'SC1',
                'name': 'Motion',
                'selectable': 'selectable',
                'nodes': [
                  {
                    'id': 'SMC1',
                    'name': 'Introduction to Motion',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'SMC2',
                    'name': 'Newton’s Laws of Motion',
                    'selectable': 'selectable',
                    'nodes': []
                  },
                  {
                    'id': 'SMC3',
                    'name': 'Pendulums',
                    'selectable': 'selectable',
                    'nodes': []
                  }
                ]
              }
            ]
          },
          {
            'id': 'SD7',
            'name': 'Technology',
            'nodes': []
          }
        ]
      }
    ],
    'options': {
      'expires': 1530165055542,
      'maxAge': 600
    }
  }
};
