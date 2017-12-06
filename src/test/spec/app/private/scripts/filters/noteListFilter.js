'use strict'

describe('Filter: noteListFilter', function () {
  // load the filter's module
  beforeEach(module('playerApp'))

  // initialize a new instance of the filter before each test
  var noteListFilter

  beforeEach(inject(function ($filter) {
    noteListFilter = $filter('noteListFilter')
  }))

  var noteListData = [
    {
      note: 'My notes 1 middle update',
      identifier: '0123358253923532806',
      createdDate: '2017-09-19 16:09:49:284+0000',
      updatedBy: 'be7efb23-6af9-4d92-82b3-a4d78fcfa2f6',
      contentId: 'do_2123215064116756481869',
      id: '0123358253923532806',
      updatedDate: '2017-09-19 16:38:24:440+0000',
      title: ' title3update',
      userId: 'be7efb23-6af9-4d92-82b3-a4d78fcfa2f6',
      courseId: 'do_2123347975635599361299',
      tags: [
        'tags 1'
      ]
    },
    {
      note: 'My notes 2',
      identifier: '0123358275097886727',
      createdDate: '2017-09-19 16:11:46:120+0000',
      contentId: 'do_2123215064116756481869',
      id: '0123358275097886727',
      updatedDate: '2017-09-19 16:11:46:120+0000',
      title: ' title 3',
      userId: 'be7efb23-6af9-4d92-82b3-a4d78fcfa2f6',
      courseId: 'do_212334797563559936129912',
      tags: [
        'tags 1'
      ]
    },
    {
      note: 'My notes 3',
      identifier: '0123358256784916486',
      createdDate: '2017-09-19 16:09:35:270+0000',
      contentId: 'do_2123215064116756481869',
      id: '0123358256784916486',
      updatedDate: '2017-09-19 16:09:35:270+0000',
      title: ' 123455',
      userId: 'be7efb23-6af9-4d92-82b3-a4d78fcfa2f6',
      courseId: 'do_2123347975635599361299',
      tags: [
        'tags 1'
      ]
    }
  ]

  xit('should return 1 note"', function () {
    var searchText = '123455'
    expect(noteListFilter(noteListData, searchText).length).toBe(1)
  })
  xit('should return 0 note"', function () {
    var searchText = '12345566'
    expect(noteListFilter(noteListData, searchText).length).toBe(0)
  })
  it('should return all notes"', function () {
    var searchText = '12345566'
    expect(noteListFilter(noteListData).length).toBe(noteListData.length)
  })
})
