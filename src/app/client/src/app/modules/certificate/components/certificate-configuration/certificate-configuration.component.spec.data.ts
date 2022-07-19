export const response = {
  mockData: {
    data: [
      {
        'code': 'certTypes',
        'dataType': 'text',
        'name': 'certTypes',
        'label': 'Certificate type',
        'description': 'Select certificate',
        'editable': true,
        'inputType': 'select',
        'required': true,
        'displayProperty': 'Editable',
        'visible': true,
        'renderingHints': {
          'fieldColumnWidth': 'twelve'
        },
        'range': [
          {
            'type': 'Completion certificate',
            'status': 2
          }
        ],
        'index': 1
      },
      {
        'code': 'issueTo',
        'dataType': 'text',
        'name': 'issueTo',
        'label': 'Issue certificate to',
        'description': 'Select',
        'editable': true,
        'inputType': 'select',
        'required': true,
        'displayProperty': 'Editable',
        'visible': true,
        'renderingHints': {
          'fieldColumnWidth': 'twelve'
        },
        'range': [
          {
            'type': 'All',
            'rootOrgId': ''
          },
          {
            'type': 'My state teacher',
            'rootOrgId': ''
          }
        ],
        'index': 2
      }
    ]
  },
  criteria: {
    'user': {
      'rootOrgId': 'ORG_001'
    },
    'enrollment': {
      'status': 2
    }
  },
  courseData: {
    'id': 'api.course.hierarchy',
    'ver': '1.0',
    'ts': '2020-08-24T11:08:46.398Z',
    'params': {
      'resmsgid': '2df72de0-e5fa-11ea-ace0-211bfb284501',
      'msgid': 'ea66a664-b688-c0b5-df68-9aad02358023',
      'status': 'successful',
      'err': null,
      'errmsg': null
    },
    'responseCode': 'OK',
    'result' : {
      'content' : {
        'appIcon': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_2127645021030563841271/artifact/download_1557833776003.thumb.jpg',
        'contentType': 'Course',
        'name': 'vk-3.0Course3007',
      }
    }
  },

  batchData: {
    'id': 'api.course.batch.read',
    'ver': 'v1',
    'ts': '2020-08-24 11:08:46:289+0000',
    'params': {
      'resmsgid': null,
      'msgid': '8dc7dc3d-82b9-311b-f610-8ccefded4460',
      'err': null,
      'status': 'success',
      'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
      'response': {
        'identifier': '01307963745936998440',
        'createdFor': [
          '0124784842112040965'
        ],
        'endDate': null,
        'description': '',
        'batchId': '01307963745936998440',
        'createdDate': '2020-08-05 13:37:52:083+0000',
        'createdBy': 'ab467e6e-1f32-453c-b1d8-c6b5fa6c7b9e',
        'mentors': [],
        'name': 'Sudip Mukherjee',
        'id': '01307963745936998440',
        'enrollmentType': 'open',
        'courseId': 'do_21307528604532736012398',
        'enrollmentEndDate': null,
        'startDate': '2020-08-05',
        'status': 1
      }
    }
  },
  batchDataWithCertificate: {
    'id': 'api.course.batch.read',
    'ver': 'v1',
    'ts': '2020-08-24 11:08:46:289+0000',
    'params': {
      'resmsgid': null,
      'msgid': '8dc7dc3d-82b9-311b-f610-8ccefded4460',
      'err': null,
      'status': 'success',
      'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
      'response': {
        'identifier': '01307963745936998440',
        'createdFor': [
          '0124784842112040965'
        ],
        'cert_templates': {
          'template_21': {
            'identifier': 'mock_cert_identifier',
            'data' : `{'artifactUrl': 'https://cert.svg',}`,
            'criteria': {
              'user': {
                'rootOrgId': '0124784842112040965'
              },
              'enrollment': {
                'status': 2
              },
              'score': {
                '>=': 40
              }
            },
            'name': 'Course completion certificate',
            'notifyTemplate': {
              'emailTemplateType': 'defaultCertTemp',
              'subject': 'Completion certificate',
              'stateImgUrl': 'https://s.png',
              'regards': 'Minister of Gujarat',
              'regardsperson': 'Chairperson'
            },
            'issuer': {
              'name': 'Research and Training',
              'url': 'https://gcert/'
            },
            'signatoryList': [
              {
                'image': 'https://signature-523237__340.jpg',
                'name': 'CEO',
                'id': 'CEO',
                'designation': 'CEO'
              }
            ]
          }
        },
        'endDate': null,
        'description': '',
        'batchId': '01307963745936998440',
        'createdDate': '2020-08-05 13:37:52:083+0000',
        'createdBy': 'ab467e6e-1f32-453c-b1d8-c6b5fa6c7b9e',
        'mentors': [],
        'name': 'Sudip Mukherjee',
        'id': '01307963745936998440',
        'enrollmentType': 'open',
        'courseId': 'do_21307528604532736012398',
        'enrollmentEndDate': null,
        'startDate': '2020-08-05',
        'status': 1
      }
    }
  },
  certTemplateListData: {
    "id": "api.v1.search",
    "ver": "1.0",
    "ts": "2022-06-02T11:49:52.324Z",
    "params": {
        "resmsgid": "1d09e040-e26a-11ec-8b7d-a989390edda5",
        "msgid": "1ce408c0-e26a-11ec-87e1-7bbe73085f99",
        "status": "successful",
        "err": null,
        "errmsg": null
    },
    "responseCode": "OK",
    "result": {
        "count": 8,
        "content": [
            {
                "identifier": "do_11317806644278067214595",
                "certType": "cert template",
                "code": "VSV DEV Completion Certificate 1",
                "primaryCategory": "Certificate Template",
                "channel": "b00bc992ef25f1a9a8d63291e20efc8d",
                "name": "VSV DEV Completion Certificate 1",
                "artifactUrl": "https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11317806644278067214595/artifact/certificate_2020-12-22_20_54.svg",
                "issuer": "{\"name\":\"Gov of TG\",\"url\":\"https://gcert.gujarat.gov.in/gcert/\"}",
                "objectType": "Content",
                "signatoryList": "[{\"name\":\"Vinu, Ekstep\",\"image\":\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAAAuCAIAAAB/BgqbAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA7wDvAO/BzIMFAAAAB3RJTUUH5AsSCBUmJ2pvYAAAFl1JREFUaN7tWnd0VOeVf9/rZWZUZtRpEqgAEhLGIKsANh0rmG4bU2LABmxIsilnz2b3bDYnOSfxiZ0467a2AwTTu5ENojfTDAgwSBgkBEioI2mkqa+/t39c53k8EkIUJzl79v01Z+Y397u/e3/fvff7ZpCqqrqu+3w+mqZ5npckSZIkQRAoivL5fKZp2u12Xdf9fj8ARFGUZVkQBJIkfT4fhmF2u13TtEAgwDAMx3HBYFBRFJvNRhCEz+dDCNntdlVVA4EAy7IsywLAbrfjOO71enEct9vtiqIEAgGO41iWDQQCqqra7XaEkM/nIwjCZrMBgOd5hmECgYCmaXa7HcMwn89HkqQgCLIsB4NBQRBomvb7/bqu2+120zR9Ph9FUTabTZZlURQ5jqNp2ufzGYbhcDgMw3iM3EVRRG1tbQRBsCyr67okSTRN0zQtSZKu6xzHYRgmiiKO4xzHqaoqyzLDMBRFhQHAQihAFEXDMMIAiqIoisKyLEEQkiSZpsmyrGmakiR1BoiiiGEYx3GGYYiiSFEUwzCyLKuqGgYAz0MBHMfhOA6e8zwninJLS4umaRGRERzL6rrOsixCSJIkhNBj5E7TNJJlGcx1T0mSJJIke0hJ0zSWZYHSvTy+LyUAACWWZTVN62E6SZKUZRnDMJIkm5qar1+vDASDDEPzHHfrds3gQRnDhw8TRbH7dEK+Q7nTNK0oSvfcFUXpTqGPQkmSJFBo9x4/ECWWZWVZDgUghFiG0b5LSdM0SZIrKirv1NZTFJmWOiAxMYGmKcMwtmzZMWzY0IED02ia+T7SSdM0AuZAiWEYVVUfJUsA6EahFEXBnngghQqCIIpifX19RESE0+kEn3Gc2Lt3n6brPyiazHGcpmmKovh8/qtfX799uzoxMf6JoTkul1NRFJIkZVnZsHGLLEnz5r0YHR3dWaGPhbuqqsRPf/pT+GZYvBVFCauGpmlCLbMAHMeRJGmZtgCw8QHQuXSEVQYAIISscknTtAUQBIEgiK++urx69ZqPPlqFYSgjI41hGE3T167buG7dpjFjRqenpYqi6Ha3ny+9WHrhktMZNXbM01lZg3Ec13Wd5/mqqltvvfXn/QcOCgKflTmYZRlLa50L/aNwJwjiW4VCEnqSJU3TGIYJy5Isy6GAbhRqAUIVCnsqTMIEQdy9e7e4ePfZc+c0TTcM87e/+VXfvn1kWfZ4PH9dsz4QCPzi5z9RVa386tfl5V/375+SlzciKjIyGAzqui4IgqKoe/ft/+ijv4iiOH/e3GefnRQT48JxPKzgPC7uqqp+W0O7pNRlHYGqH1ZHGIYJBXSuodaesgBdUlJVFTxWFKWmpmblyjU0TY0cVbh338H5c+dkZ2fJsszz/JkzZ9et37hi+WuyLB85ejw5ud/Iwvy4uFirZ5IkeeNG1cZNWw8cOJiWlrbk1UXDhg0Faj1M50Nw/04N7UypS849V2hYiZRlmaKoHirUNM2GhsY333p76NDsiRPGrflkQ1bW4KJnJ5EkSZLksWNfrFmzrqhost8fECVp7Jin09NTNU2TJIlhGJqmPR7PkaPH136y3t3eMXvWjFmzpsfHx0EV6mE6H457uEIVRQHOXfYNANA03U2WLEDnJg4KVVW1S0AoJZZl29rc//Xr3w57Iqeo6Nl16zdGREQkJsQjhAoL848cObZr1+fpGRkEgQ8bNnT0qEKoZTDVqapSUVm1bdvOQ4eO9u3bZ9GiBU+PHgksuk/nY+FOUdQ/WKGyLCOEQh1iGMbn8/3xT+/QFDV+wtiSkn02QaiqunHnTl1R0WRRlI4cPR4bG1dQkFf07MT4+LhgMIjjOMMwhmG0t3ecOHFqw8bNHo8vN3f4wpfnpaQkQzppmpYkWVFkaCbfo0LdbrdVJu6VJfA4LEuGYTAMg2GYLMv3AnSjUNjXwWAQ+ilBEAxDBwJic3PziRMnd+/Zl5//lCTJgsAfO3osNXXAkCFZpaUXKypv9OrVe+bMqaNHFeq6bpomwzCwxPXrlZs2bysvL7fbHdOmTZn6XBFNUUFRVBS1rc3t9/sTExOcTidC2AMp9IG491ShhmGECZBhGBzH4UAC6uhSobCepVCCIGB7KoqC4/iRI0dXrfpr7969R40aGRUVKUnSpUuXm5qbL164GB3tHDd+XFSkY0/JvkkTJ3Ace+jwUVXV09JSF8yf07t3L/ABIaQoitfrPXT4+KbNW03TTE9LHfPM6H7Jfe/ebfF0eP2BQGSEo0+f3klJiYLA67p+34LzKNy7Uygk4YGypOu6qqoMQ+M44ff7ZVlGCPf7/U1NzZqu4wi53W5N13VNP19aev3a9fq6uieHD8vJyeno8OzeUxIbE5OVlSnJcnlZeUJCQkZGeumFC40NTYMHD0I4Mk2Unp72/OwZDoeNJCkcx4Feefm17Ts+/fLseUHgIyMi0tJSk5P7EQSRmBCfkBAfGxfjcjoxDIOo9bCGPgT3cIWCfEKz1L0Av5lsZBlDCA587e3tfn9AkuS7LS1+f0BVVdMwWI7leZ7neYfdTlEkz/MIoZUrV2/fvoOm6VdfXTx79kySJH/3uz989dXl3KdGBAPBzKzB0GecTmd9Q+OVy2U2u+3cuQuJifHTpz1nt9uAs6IoLS2tW7ftPHnyjCgGAoFgYWF+3lO56RlpiQnx4D9N0yBA4GwVHIIgoOCAQh+C+30UCuZ0Xe+cJSsJAID1SJL0+wM+n0+WZbe7vfnuXb/PTxAEhlB8XKzD4YiOjqIoiqJIm82G47iiyDhOUBSladqqVWs++ODDwZmDX1m8MDd3OM/zHo/n3Xc/8Pp8mZmDC/LzkpISaZqG2RvHcdPE3nv/Q5fTOWfObIIgGpuabt+qrqtvqKy84fN63e2ea9crHHb7vHlzpk+b4nDY4XQIFsI4UxRFkiRcV1oChJbYE+49VSicrhRFIYhvOIdliWUZDENgxR8I3L5d3dLSGgyIhmk4HA6XMzopKVEQBIoiRVGsuVPbPyWF41iaohCOWx5bS5w8dbq1pTU/Py8xMcGSD0mSmqZhGAbdSVVVy+P1GzYfPXp87twXm5vvNjU165pWW1dfU1P7zDOjMjMHrVu3SZaVpUsWjRpVYJomcIZDwd8smLIs4zhB0zRQC1OopS+KojRNVVUNfABAqOcQHE3TOmcrFPAdhaqqCpMzpBHOOS0trXV19dXV1Q2NTaIouVzO3r172QSBIAiO5xRZcbe3K7LsdruPHz8hyXLRs5MFm6CpKtwk0gxjGoZgE6IiIwmCoBna5XRClTBNE3YlOITjeHt7R1tbq6bpoijeuVNbVVV1+PARRdXiExL7p6S4XE5JkqqqbmVnZ/Xqlbhl8zZJVp6fPTMrazBECqKGIYzneBxHsJc5jlM1LRgIMixDU5QkSaqq8QKPMASX03a7TZJlRZYZlrUJgmmauq5HRDhIktR1HfYyJAPHCYahoUh2uX1JkuxCoZr2TZbOnDl74MDB6uqaxqYmh8ORmjogOio6KjqKYRiKJHmB5zmOoiiPx7t123ZFlufOnTNo0EAMwwzDICmSwAnDMDCECByHLYMQQgiZJmYYusPhiIiIIAgcIUTT9MGDh/ftP+B2u3Vdj4iISIiP7927F8dxa9duWLr0layszAsXvzp06Ghu7pOjRxVWVd388zvvp/bvv2jRD3mex3GEYcgwDFVVEI5TJAWXaTiOg1pxHNc0TTd0HOGwIQzDMDGTpmjYqrKiYBiGmZhhGoZuBMUgXKzQFC3YhMgIR1RUZGnphWPHjk+ePOnpp0fDANOlQknYdNb9BVw7qqqqaRpB4GlpqQUF+U6n0+VyMgyNEBIEAe7KYKy9du369h27MjMzFyx4KT4uVlFUSAZsOpqmMQxTFIUgcIr6Js8kSZqm6fV6GxsbZUVJSx0gy3Jq6oDIyAiapuGCzmYTTNNsa2vbXbKf5/mjx040NDS+tuyVwYMHXq+o3LBp68jCgoUL50dHRVEUBeqwKBmGYRgGRA3DTJqmdd1QVZWiSJpm2tvbT5/+sqz8qhgMJiYmTJv2XExMjOUYeA7ChF+GOjzey5evHD50pKampqamJi8vD/qYpVBrToDo3VOhkCKEEEVRALCKHdQRgiDOnS99/4OPJ44fO2PGVIQQAKBc0DQNQ6JlIbSeQKwRQsXFu53O6JEjCwzD0DSNJEmYh2BP+Xz+Za/9iGW5sWOfmTRxrMPhaGho/MObbw8Zkjl/3hyGYURRVFXVZrOB57quBwLBQ4eOnDp9mue4n/3sX1wuJ2x8hmE6OjrOnDl7/IuTLMsU5OfZ7baPPl6VmjrgRyteg3ZkUSNJEn7CunOn7vSZs8Fg8Knc4efPl+7Zs/f15csmT5pA0zQo1CpZQO1bhYJ0wxRKURTcuMCuDJWwrutlZeXvvffh5MkTpk97DsdxcCj0yBxaIq1RFwAQVoIgDNOsqrqVO+JJDCGwAO2Ypmmfz7937/76+oaFCxfMmjmVoqjb1TVvvvl2SkryhPFj9+0/eP16BUJI1zSXyzV+/FiXy3np0uVdxbvj4mKnTp3y9tvv7Ny5a9GiHzIM09jY+MUXJ8vKv+Y4rqhocvaQTBg/SJL83e/fLC//Ojd3OASFoqiODk91dc2dO7X19Q12hz3vqREDB6ZLkvzxX1bPm/9SXFzcqVNnCgryKIqCzRemUBKObsAZBohQzlZQQqd3WZaDQXHl6rUjRgyfNnWK9aZ1TWAlA9ajaTr0VykAMAzT1ub+8uz5WTOnUZ2yVVV1c0/JAa/Xy3FscnJflmXPnit94403fT5fUlLCu+99kJGR8YOiyYmJiR6PZ+enxe+8+74gCAjhM2dMzc0dThCELCvFxZ+vWr1GEmV3u9vldM6eNSM1tT/PczC0mKaZk5O9aOGCzz7fU1FZ6XK6ZFluc7tFUWQYZtDAjOHDh8XFxSKEVFUtK7/q9/sL8vNcLueOHcUjRjyJYRgo1JriIQ6k1aesjR8aFCsJFgDSuHXbBtMw5817Ea7WQ4c1a1+bpmlZsJIBAJqmGxobV678ZNDA9JzsrNBsSZJ09eq14s9Lckc8GRcXc+HixRiX68DBw5u3bPd6PdFRUTEu14L5c/v06a1pmmmaLlf0T368vK6u3jTNxMREmqZA+xMnjBuSlVlf38CwTK+kJJtNIEkSIaSqmmEYkG9VVcePH5ubO6K6usbr8zkc9vT0VKfT6XA4OI4FvsC9oqIyOTm5X7++V66Ud3g8QM0SosWdIIjvKLRzUELLhHX2uHjp8okTp3/+8x/beB7mFSsZMGFYCrUshAJM06ysrFq3YVNaauqM6VNCARiGDh46Wlp6cfrUHwwbNnTHzmKH3X7h4uWysqsrli+NjoriOC4mxmVVBgzDJEnGcTwlJRlaE2wpeJGQEJ+UlKCqGoZhBEHoug7dxqJGkiSGYTabkJMzBLqQpmkEQVhNHLxVVZXnOZIkSvbuP3v2/OzZM+B/Ap2p6bqOOjo6rL4B5giCgF4JHmuahhCCpgnN/Y0/vB0VGbF0yWKKIjEMU1UV6pHlMYwppmmCxxYAWtOVsquffvpZQUHe+HHPWB7DpcnWbZ+2trbNfen5Xr2SAoHAf/7qN1eulOfn57388ry+fXpDn7R6FwSlS89BjNZhoRtq9wUAd7/ff/lymSTLgwZmxMbGwBKduRMEQVoxDlMomIY0hhbZM1+eq66uWfjr/2AYGrJkiT9UoWGUTNPUNC0oiiUl+2/cuDnnxdlZWYMhlFDUa2vrPlm70emMfm3ZKzzPqapaW1t3paw8Jyd72dLFCQnxMNlYS0DmgJLVM0O7bWg6uwF0uTs7c+c4zhpFIMSh1EIVSoK50A9gsrMcAhMACASCu/fsHZozJDEhHtYOy3NnC6aJwfhVdfPWjp3FcbGxy19f4nRGw64ErV2+XLZh09bhw54oKpoImVAUZdPmbYMGZvzy334RFRVpOQkah10ZyhmU0g0g1DGQEgAsat1zt35ph9LRJeCbGmrJJ2zjI4RCgmKC6OrrG27evD3nhdlwUgz1WNM0i1KoBRzHg0GxZO+Bqpu3Jk4Y+8TQbIiXBTh3/sJnn5VMGDdm5Mh88Njtdn/40apjx7544/e/iYyMgKXBrLW/wijdC9BDavcFdKZ2L+6k5ZD1geVQaBpBOCdOnoqKiujfP1nXdcMwCILohhJCCMPQ+fMXSvYdTO7X97Wli0GYcM2s6zqGYefPX9xTsv+F52dkZg5CCGEYdvduy8rVn+zes2/smNHZ2UMwDIPMWVU4lHMYpZ4AuqTWJaD7bHUDuI9D1jdN07x27frAjHTo4FZQOluAWFfdvPX55yWGYcyaMXXQoAy4dLC+heP4ocPHTp36ct68FzLS0wzD0HXd4/Fu2bqj3d2RkpI896UX4IjxEJS6B8C2DaX2uLL1HYWGOQSc4aYDvunz+Zub744szLdqNgAs0xBKHMfr6hr2lOxraGgsLMgbOTIfJjOCICyHDMPcsbP4q8tlixfOT0lJBtl6vb516ze7XNGVN6qmT5uSmjoAwBZngiDAe3gTHHt0QDfcQ6l1mS0rMd+G1foAIQQfwGuEEKwXYtpECBmmCVGzHILXpmkihBobmw4eOlJVdXNIVubsWdOjo6MAYy0Bx+St2z6tqKhc+urCXr2SYGhtbW1bv2FzUlLijRs3U5L7TZo4DixbQQHHICih6/YEEEqtM6An3MMshHEPXQJ5vV74wDRNCApCCF6HfdM0zT/+6b8lSfr3X/4r+ITjOMyGoijerq45c+ZsS0trWuqAwsL8uLhYWMZaD17Lsrx9R/G1axUrli9JSIgzTQzDsEAgsGXrTkHg79ypZVl28eIfCjwftktCHQvj3BPP/34Av9/fGd2lxziO19bWvff+h+lpqWPGPO1w2H0+f2tra11dfVXVTYIkc3Kyc7KHREdHQSw6W9B1fcvWnbduVy9bsiguLtb8m9h37Nx17NiJyMiIgQMzpk+bAv8o6iaUYZQeAtBZXz3PVvcA5PV67+UQaOo7aITaOzrOfnmuvb0dLnF5QejXt2+/fn3i4uJgsoVQhlnAcVxR1Q0bNjc3tyxdsghKAbyv6/ru3Xs9Hk9BYX7/lGTTNC0LYaY6v34UQBi1xwaA/4qHPha6ywfuPQ3DgF+GoeWB1rB7PkhVldV/Xdvc3LJi+VKXyxkGDvXp3kbu49jfB3Dfp4uAPq4HIeTz+auqbiYn99u+Y9fdlpalry5yuaINw3x04/+0D/592cXxpqbmD/7n40AwuHvP3pbW1hWvgzb/L0cT+54CiuN4Tc2dt/7459TU/nV19bW19a8ve9Vut3VbFr59ut/4/+QPHur9fZlYZb7zR6FF2uv1rVr9ydCh2TRFX7tWsWjh/MjIiJ4vcd8y18M3vw9A99wxDMOtsRwLGdHDAhQGAKGF9TtrjEAI7d27H/56V3rh0iuvvJyQEA89vfMSYWs9ECC0lffQ80cHdM8dwzDcGl+wrqZ/66zSJQAG+7A3ZVm+XlGJYZjfH/jRimV9+/QOPaeGjm9gofNUGAbovC72t0PUfQH3pfZ4uWMYhvx+P/bg0++9nIBvud3tBEFERUVa4Md7VrlXAh5ibu8MwEKOvD1xLMwC8ng8kI2eUOqhpjon/1HOKg+UzkfPFpzcH4L7PQf7/38e5flfK4jbqvBYBZ4AAAAldEVYdGRhdGU6Y3JlYXRlADIwMjAtMTEtMThUMDg6MjE6MzgtMDU6MDD75tLZAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIwLTExLTE4VDA4OjIxOjM4LTA1OjAwirtqZQAAAABJRU5ErkJggg==\",\"designation\":\" Ekstep\",\"id\":\" Ekstep/CEO\"}]",
                "orgDetails": {}
            },
            {
                "identifier": "do_1131446242806251521827",
                "certType": "cert template",
                "code": "test",
                "primaryCategory": "Certificate Template",
                "channel": "b00bc992ef25f1a9a8d63291e20efc8d",
                "name": "test",
                "artifactUrl": "https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_1131446242806251521827/artifact/certificate_2020-11-05_14_56.svg",
                "issuer": "{\"name\":\"AP\",\"url\":\"https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11312763976015872012/artifact/apgov.png\"}",
                "objectType": "Content",
                "signatoryList": "[{\"image\":\"\",\"name\":\"CEO\"}]",
                "orgDetails": {}
            }
        ]
    }
},
  certRulesData: {
    'id': 'api.org.preferences.read',
    'ver': 'v2',
    'ts': '2020-08-25 15:26:17:543+0000',
    'params': {
      'resmsgid': null,
      'msgid': '1db734d8-a580-222b-91e1-1d0cfbe55108',
      'err': null,
      'status': 'success',
      'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
      'response': {
        'updatedBy': null,
        'data': {
          'templateName': 'certRules',
          'action': 'save',
          'fields': [
            {
              'code': 'certTypes',
              'dataType': 'text',
              'name': 'certTypes',
              'label': 'Certificate type',
              'description': 'Select certificate',
              'editable': true,
              'inputType': 'select',
              'required': true,
              'displayProperty': 'Editable',
              'visible': true,
              'renderingHints': {
                'fieldColumnWidth': 'twelve'
              },
              'range': [
                {
                  'name': 'Completion certificate',
                  'value': {
                    'enrollment': {
                      'status': 2
                    }
                  }
                },
                {
                  'name': 'Merit certificate',
                  'value': {
                    'score': '>= 60'
                  }
                }
              ],
              'index': 1
            },
            {
              'code': 'issueTo',
              'dataType': 'text',
              'name': 'issueTo',
              'label': 'Issue certificate to',
              'description': 'Select',
              'editable': true,
              'inputType': 'select',
              'required': true,
              'displayProperty': 'Editable',
              'visible': true,
              'renderingHints': {
                'fieldColumnWidth': 'twelve'
              },
              'range': [
                {
                  'name': 'All',
                  'value': {
                    'user': {
                      'rootid': ''
                    }
                  }
                },
                {
                  'name': 'My state teacher',
                  'rootOrgId': ''
                }
              ],
              'index': 2
            }
          ]
        },
        'createdBy': '18150cf9-b839-4ccd-956a-66e359f22278',
        'updatedOn': null,
        'createdOn': 1597591999662,
        'key': 'certRules',
        'orgId': 'od1'
      }
    }
  },
  certAddSuccess: {
    'id': 'api.course.batch.cert.template.add',
    'ver': 'v1',
    'ts': '2020-08-26 16:57:48:922+0000',
    'params': {
      'resmsgid': null,
      'msgid': '55e3bad3-a0fb-0a18-0949-d658cf9e2f9e',
      'err': null,
      'status': 'success',
      'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
      'response': 'SUCCESS'
    }
  },
  userMockData: {

    'lastName': 'User',
    'loginId': 'ntptest102',
    'regOrgId': '0123653943740170242',
    'roles': [
      'public'
    ],
    'rootOrg': {
      'dateTime': null,
      'preferredLanguage': 'English',
      'approvedBy': null,
      'channel': 'ROOT_ORG'
    },
    'identifier': '874ed8a5-782e-4f6c-8f36-e0288455901e',
    'userName': 'ntptest102',
    'rootOrgId': 'ORG_001',
    'userid': '874ed8a5-782e-4f6c-8f36-e0288455901e'
  },
  certificateFormData: {
    'id': 'api.form.read',
    'params': {
      'resmsgid': '9337d13b-7e06-4f74-9b07-f30e4f862d15',
      'msgid': '2da7164b-5756-4a90-81cf-81e038f80077',
      'status': 'successful'
    },
    'responseCode': 'OK',
    'result': {
      'form': {
        'type': 'certificate',
        'subtype': 'course',
        'action': 'certificatecreate',
        'component': 'portal',
        'framework': '*',
        'data': {
          'enableSVGEditor': true
        },
        'created_on': '2022-02-04T10:05:54.499Z',
        'last_modified_on': null,
        'rootOrgId': '*'
      }
    },
    'ts': '2022-02-08T12:27:14.173Z',
    'ver': '1.0'
  }
};

