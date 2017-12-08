'use strict'

angular.module('playerApp')
  .controller('ProfileController', [
    '$scope',
    '$rootScope',
    'contentService',
    'userService',
    'toasterService',
    'config',
    '$timeout',
    '$filter',
    'uuid4',
    'formValidation',
    'searchService',
    '$state',
    'learnService',
    'adminService',
    'workSpaceUtilsService',
    'configService',
    '$q', '$anchorScroll',
    function ($scope, $rootScope, contentService, userService,
      toasterService, config, $timeout, $filter, uuid4, formValidation, searchService,
      $state, learnService, adminService, workSpaceUtilsService, configService, $q, $anchorScroll) {
      var profile = this
      profile.defaultLimit = 4
      profile.limit = profile.defaultLimit
      profile.resetLimit = 0
      profile.userId = $rootScope.userId
      profile.formElmnt = configService.getProfileAddInfformElmnt()
      profile.languages = profile.formElmnt.languages
      profile.subjects = profile.formElmnt.subjects
      profile.yearOfPassing = configService.getYearOfPassingValues()
      profile.grades = profile.formElmnt.grades
      profile.experienceForm = false
      profile.isCurrentJobExist = false
      profile.profileSummary = ''
      profile.isError = false
      profile.contentSortBy = 'desc'
      profile.quantityOfContent = 4
      profile.badges = []
      profile.isViewMore = true

      var today = new Date()

      var orgIds = []
      _.forEach($rootScope.organisations, function (org) {
        if (org.organisationId) {
          orgIds.push(org.organisationId)
        }
      })

      // Get user profile
      // formate date
      profile.formateDate = function (userDetails) {
        if (userDetails.length) {
          userDetails.forEach(function (element) {
            if (element.updatedDate) {
              element.updatedDate = new Date(element.updatedDate)
            }
          }, this)
        }
      }
      // user badges
      profile.getUserBadges = function () {
        var badges = adminService.getBadgesList()
        if (profile.user.badges.length) {
          profile.user.badges.forEach(function (badge) {
            var userBadge = badges.find(function (badgE) {
              return badgE.id === badge.badgeTypeId
            })

            profile.badges.push({
              title: userBadge.name
            })
          })
        }
      }
      // processing profile data
      profile.processProfileData = function (userProfile) {
        profile.loader.showLoader = false
        if (userProfile && userProfile.responseCode === 'OK') {
          var profileData = angular.copy(userProfile.result.response)

          profile.user = profileData
          // temp mock data
          profile.user.profileVisibility = profileData.profileVisibility
          profile.fullName = profileData.firstName + ' ' + profileData.lastName
          profile.email = profileData.email
          profileData.dob = profileData.dob ? new Date(profileData.dob) : profileData.dob
          profile.formateDate(profileData.jobProfile)
          profile.formateDate(profileData.address)
          profile.formateDate(profileData.education)
          if (profileData.education.length) {
            profileData.education.forEach(function (education) {
              education.yearOfPassing = education.yearOfPassing === 0 ? '' : education.yearOfPassing
              education.percentage = education.percentage === 0 ? '' : education.percentage
            })
          }
          if (profile.isAvatarUpdate) {
            $rootScope.avatar = profileData.avatar
          }
          profile.address = angular.copy(profileData.address)

          profile.education = angular.copy(profileData.education)
          profile.experience = angular.copy(profileData.jobProfile)
          if (profile.user.lastLoginTime > 0) {
            profile.lastLoginTime = angular.copy(profile.user.lastLoginTime)
          }
          if (profile.user.badges) {
            profile.getUserBadges()
          }
          if (profileData.completeness) {
            $rootScope.profileCompleteness = profileData.completeness
            $('.profile-progress').progress({
              percent: $rootScope.profileCompleteness
            })
          }
          if (profileData.missingFields) {
            $rootScope.profileMissingFields = profileData.missingFields
          }
          if (profile.user.profileVisibility) {
            $rootScope.privateProfileFields = Object.keys(profile.user.profileVisibility)
          } else {
            $rootScope.privateProfileFields = []
          }

          if (profile.user.webPages) {
            var socialMedia = {}

            socialMedia.fb = profile.user.webPages.find(function (webLink) {
              return webLink.type === 'fb'
            }) || { type: 'fb', url: '' }

            socialMedia.twitter = profile.user.webPages.find(function (webLink) {
              return webLink.type === 'twitter'
            }) || { type: 'twitter', url: '' }
            socialMedia.in = profile.user.webPages.find(function (webLink) {
              return webLink.type === 'in'
            }) || { type: 'in', url: '' }
            socialMedia.blog = profile.user.webPages.find(function (webLink) {
              return webLink.type === 'blog'
            }) || { type: 'blog', url: '' }

            profile.user.socialMedia = socialMedia
          }
          profile.userSkills = profile.user.skills !== undefined ? profile.user.skills : []
          profile.basicProfile = angular.copy(profile.user)
        } else {
          profile.loader.showLoader = false
          profile.isError = true
          toasterService.error($rootScope.messages.fmsg.m0005)
        }
      }
      // fetch profile
      profile.getProfile = function (fields) {
        profile.loader = toasterService.loader('', $rootScope.messages.stmsg.m0074)
        userService.getUserProfile(profile.userId, fields).then(function (successResponse) {
          profile.processProfileData(successResponse)
        }).catch(function () {
          profile.loader.showLoader = false
          profile.isError = true
          toasterService.error($rootScope.messages.fmsg.m0005)
        })
      }

      // update user profile
      profile.updateProfile = function (updateReq) {
        updateReq.userId = $rootScope.userId
        profile.updateProfileRequest = {
          id: uuid4.generate(),
          ts: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss:sssZ'),
          params: {},
          request: updateReq
        }
        profile.disableSave = true
        profile.loader = toasterService.loader('', $rootScope.messages.stmsg.m0075)
        return userService
          .updateUserProfile(profile.updateProfileRequest, profile.fullName, profile.email)
          .then(function (successResponse) {
            profile.disableSave = false
            if (successResponse && successResponse.responseCode === 'OK') {
              return true
            } else if (successResponse.responseCode === 'CLIENT_ERROR') {
              throw new Error(successResponse.params.errmsg)
            } else throw new Error('')
          }).catch(function (err) {
            if (err.message) {
              throw new Error(err.message)
            } else { throw new Error($rootScope.messages.fmsg.m0048) }
          })
      }

      profile.updateUserInfo = function (req, activeForm, successMessage, errMessage) {
        profile.updateProfile(req).then(function () {
          profile[activeForm] = false
          toasterService.success(successMessage)
          profile.getProfile('completeness,missingFields')
        }).catch(function (err) {
          profile.loader.showLoader = false
          if (err.message) {
            toasterService.error(err.message)
          } else { toasterService.error(errMessage) }
        })
      }

      // update avatar
      profile.openImageBrowser = function () {
        $('#iconImageInput').click()
      }
      profile.validateAvatar = function (files) {
        var deferred = $q.defer()
        var formData = new FormData()
        var reader = new FileReader()
        if (files[0] &&
                    files[0].name.match(/.(jpg|jpeg|png)$/i) &&
                    files[0].size < 4000000) {
          formData.append('file', files[0])
          reader.readAsDataURL(files[0])
          profile.icon = formData
          profile.iconUpdate = true
          deferred.resolve(true)
          return deferred.promise
        }
        toasterService.warning($rootScope.messages.imsg.m0005)
        throw new Error('')
      }

      profile.updateAvatar = function (files) {
        try {
          profile.validateAvatar(files)
            .then(function () {
              profile.icon.append('container', 'user/' + profile.userId)
              contentService.uploadMedia(profile.icon)
                .then(function (res) {
                  if (res && res.responseCode === 'OK') {
                    profile.isAvatarUpdate = true
                    profile.updateProfile({ avatar: res.result.url })
                    var req = { avatar: res.result.url }
                    profile.updateUserInfo(
                      req,
                      'basicProfileForm',
                      $rootScope.messages.smsg.m0018,
                      $rootScope.messages.fmsg.m0035)
                  } else {
                    profile.error = toasterService.error($rootScope.messages.fmsg.m0048)
                  }
                }).catch(function () {
                  profile.loader.showLoader = false
                  profile.error = toasterService.error($rootScope.messages.fmsg.m0048)
                })
            })
        } catch (e) {
          //
        }
      }

      // update basic Info
      profile.webLink = function () {
        if (profile.user.webPages) {
          var socialMediaLinks = []
          Object.keys(profile.user.socialMedia).forEach(function (key) {
            if (profile.user.socialMedia[key].url.length) {
              socialMediaLinks.push({
                type: key,
                url: profile.user.socialMedia[key].url
              })
            }
          })
          return socialMediaLinks
        }
        return []
      }
      profile.EditBasicProfile = function () {
        var isValid = formValidation.validate('#basicInfoForm')
        if (isValid === true) {
          var dob = $('#editDob').calendar('get date')
          var basicInfo = {
            firstName: profile.user.firstName,
            lastName: profile.user.lastName,
            gender: profile.user.gender,
            dob: dob instanceof Date ? $filter('date')(dob, 'yyyy-MM-dd') : null,
            language: profile.user.language,
            subject: profile.user.subject,
            grade: profile.user.grade,
            location: profile.user.location
          }
          if (profile.user.phone !== profile.basicProfile.phone) {
            basicInfo.phone = profile.user.phone
          }
          if (!profile.user.email) {
            basicInfo.email = profile.user.email
          }
          var webPages = profile.webLink()
          profile.webPages = webPages

          basicInfo.webPages = profile.webPages

          profile.updateUserInfo(

            basicInfo,
            'basicProfileForm',
            $rootScope.messages.smsg.m0022,
            $rootScope.messages.fmsg.m0039)
        } else return false
      }

      // CURD address
      profile.addAddress = function (newAddress) {
        var isValid = formValidation.validate('#addressForm')
        if (isValid === true) {
          profile.address.push(newAddress)
          var req = { address: profile.address }
          profile.updateUserInfo(
            req,
            'addressForm',
            $rootScope.messages.smsg.m0026,
            $rootScope.messages.fmsg.m0046
          )
        } else return false
      }

      profile.editAddress = function (address) {
        var isValid = formValidation.validate('.addressForm')
        if (isValid === true || !isValid.includes(false)) {
          var req = { address: address }
          profile.updateUserInfo(
            req,
            'addressForm',
            $rootScope.messages.smsg.m0023,
            $rootScope.messages.fmsg.m0040
          )
        } else {
          return false
        }
      }

      profile.deleteAddress = function (address) {
        address.isDeleted = true
        var req = { address: [address] }
        // req.userId = $rootScope.userId;
        profile.updateUserInfo(
          req,
          'addressForm',
          $rootScope.messages.smsg.m0016,
          $rootScope.messages.fmsg.m0043
        )
      }

      // CURD education
      profile.addEducation = function (newEducation) {
        var isValid = formValidation.validate('.educationForm')
        if (isValid === true) {
          newEducation.percentage = newEducation.percentage
            ? parseFloat(newEducation.percentage)
            : 0
          newEducation.yearOfPassing = newEducation.yearOfPassing
            ? parseInt(newEducation.yearOfPassing)
            : 0
          profile.education.push(newEducation)
          var req = { education: profile.education }
          profile.updateUserInfo(
            req,
            'educationForm',
            $rootScope.messages.smsg.m0024,
            $rootScope.messages.fmsg.m0044
          )
        } else return false
      }

      profile.editEducation = function (education) {
        var isValid = formValidation.validate('.educationForm')

        if (isValid === true || !isValid.includes(false)) {
          education.forEach(function (edu) {
            edu.percentage = edu.percentage ? parseFloat(edu.percentage) : 0
            edu.yearOfPassing = edu.yearOfPassing ? parseInt(edu.yearOfPassing)
              : 0
          })
          var req = { education: education }
          profile.updateUserInfo(
            req,
            'educationForm',
            $rootScope.messages.smsg.m0020,
            $rootScope.messages.fmsg.m0037)
        } else return false
      }

      profile.deleteEducation = function (education) {
        var req = { education: education }
        req.userId = $rootScope.userId
        profile.updateUserInfo(
          req,
          'educationForm',
          $rootScope.messages.smsg.m0014,
          $rootScope.messages.fmsg.m0041)
      }

      // edit experience
      profile.addExperience = function (newExperience) {
        var isValid = formValidation.validate('.jobProfileForm')
        if (isValid === true) {
          var startDate = $('#rangestartAdd').calendar('get date')
          var endDate = $('#rangeendAdd').calendar('get date')
          newExperience.isCurrentJob = newExperience.isCurrentJob
            ? newExperience.isCurrentJob === 'true' : null
          endDate = newExperience.isCurrentJob ? null : endDate
          newExperience.joiningDate = startDate instanceof Date
            ? $filter('date')(startDate, 'yyyy-MM-dd')
            : null
          newExperience.endDate = endDate instanceof Date
            ? $filter('date')(endDate, 'yyyy-MM-dd')
            : null
          newExperience.userId = $rootScope.userId
          profile.experience.push(newExperience)
          var req = { jobProfile: profile.experience }
          profile.updateUserInfo(
            req,
            'experienceForm',
            $rootScope.messages.smsg.m0025,
            $rootScope.messages.fmsg.m0045
          )
        } else return false
      }

      profile.editExperience = function (experiences) {
        var isValid = formValidation.validate('.jobProfileForm')
        if (isValid === true || !isValid.includes(false)) {
          if (experiences.length) {
            experiences.forEach(function (element, index) {
              var startDate = $('.rangeStart').calendar('get date')
              var endDate = $('.rangeEnd').calendar('get date')
              if (startDate instanceof Array && endDate instanceof Array) {
                element.joiningDate = startDate
                  ? $filter('date')(startDate[index], 'yyyy-MM-dd')
                  : element.joiningDate
                element.endDate = endDate
                  ? $filter('date')(endDate[index], 'yyyy-MM-dd')
                  : element.endDate
              } else {
                element.joiningDate = startDate
                  ? $filter('date')(startDate, 'yyyy-MM-dd')
                  : element.joiningDate
                element.endDate = endDate
                  ? $filter('date')(endDate, 'yyyy-MM-dd')
                  : element.endDate
              }
            }, this)
          }

          var req = { jobProfile: experiences }
          profile.updateUserInfo(
            req,
            'experienceForm',
            $rootScope.messages.smsg.m0021,
            $rootScope.messages.fmsg.m0038)
        } else return false
      }

      profile.deleteExperience = function (experiences) {
        var req = { jobProfile: [experiences] }
        req.userId = $rootScope.userId
        profile.updateUserInfo(
          req,
          'experienceForm',
          $rootScope.messages.smsg.m0015,
          $rootScope.messages.fmsg.m0042)
      }
      // update Description
      profile.EditDetails = function (details) {
        var req = { profileSummary: details }
        profile.updateUserInfo(
          req,
          'openDiscriptionEdit',
          $rootScope.messages.smsg.m0019,
          $rootScope.messages.fmsg.m0061)
      }

      profile.setEditStart = function (id, index, joinDate) {
        $timeout(function () {
          $('#' + id + index).calendar('set date', joinDate)
        }, 500)
      }
      profile.setEditEnd = function (id, index, endDate) {
        $timeout(function () {
          $('#' + id + index).calendar('set date', endDate)
        }, 500)
      }
      profile.setDob = function () {
        $('#editDob').calendar('set date', profile.user.dob)
        $('#editDob').calendar({
          maxDate: new Date(today.getFullYear(), today.getMonth(), today.getDate())
        })
        $timeout(function () { $scope.dobVis = true }, 100)
      }
      $timeout(function () {
        $('.ui.radio.checkbox')
          .checkbox('attach events', '.toggle.button').checkbox({
            onChange: function () {}
          })
      }, 1000)

      profile.setDropdownValue = function () {
        $timeout(function () {
          $('#languageSelect').dropdown()
          $('#languageSelect').dropdown('refresh')
          $('#languageSelect').dropdown('set selected', profile.user.languages)
        }, 100)
      }

      profile.setSubject = function () {
        $timeout(function () {
          $('#setSubjects').dropdown()
          $('#setSubjects').dropdown('refresh')
          $('#setSubjects').dropdown('set selected', profile.user.subjects)
        }, 100)
      }

      profile.setPassingYears = function () {
        $timeout(function () {
          $('#passingYears').dropdown()
          $('#passingYears').dropdown('refresh')
          $('#passingYears').dropdown('set selected', profile.yearOfPassing)
        }, 100)
      }

      profile.setEditSubject = function (name, index, subjects) {
        $timeout(function () {
          var id = '#' + name + index
          $(id).dropdown()
          $(id).dropdown('refresh')
          $(id).dropdown('set selected', subjects)
        }, 100)
      }

      profile.checkCurrentJob = function (experience, value) {
        var currentjob = profile.experience.find(function (currentJob) {
          return currentJob.isCurrentJob === true
        })

        if (currentjob && currentjob.id !== experience.id && value === true) {
          profile.isCurrentJobExist = true
        } else {
          profile.isCurrentJobExist = false
          experience.isCurrentJob = value
        }
      }

      profile.setJobProfileCheckbox = function (experience, value) {
        experience.isCurrentJob = value
      }
      profile.getContentLogo = function (content) {
        var contentIcon = content.appIcon
        var mimeType = content.mimeType
        if (contentIcon) {
          return content.appIcon
        }
        switch (mimeType) {
        case config.MIME_TYPE.pdf:
          return '/common/images/pdf.png'
        case config.MIME_TYPE.mp4:
          return '/common/images/mp4.png'
        case config.MIME_TYPE.webm:
          return '/common/images/mp4.png'
        case config.MIME_TYPE.pYoutube:
          return '/common/images/youtubeFileIcon.jpg'
        case config.MIME_TYPE.youtube:
          return '/common/images/youtubeFileIcon.jpg'
        case config.MIME_TYPE.h5p || config.MIME_TYPE.ePub:
          return '/common/images/zipFileIcon.png'
        default:
          return '/common/images/zipFileIcon.png'
        }
      }

      profile.getProfile('lastLoginTime')

      profile.getCreatedContentList = function () {
        var request = {
          filters: {
            createdBy: profile.userId,
            status: ['Live'],
            contentType: config.contributeContentType
          },
          sort_by: {
            lastUpdatedOn: profile.contentSortBy
          }
        }

        searchService.search(request).then(function (res) {
          if (res && res.responseCode === 'OK') {
            profile.contentList = res.result.content || []
          } else {
            // toasterService.error(profile.message.DRAFT.FAILED);
          }
        }).catch(function () {
          // toasterService.error(profile.message.DRAFT.FAILED);
        })
      }

      profile.openContentPlayer = function (item) {
        if (item.mimeType === 'application/vnd.ekstep.content-collection') {
          workSpaceUtilsService.previewCollection(item, $state.current.name)
        } else {
          workSpaceUtilsService.previewContent(item, $state.current.name)
        }
      }

      profile.getbadges = function () {
        learnService.enrolledCourses($rootScope.userId).then(function (res) {
          if (res && res.responseCode === 'OK') {
            var courses = res.result.courses
            _.forEach(courses, function (course) {
              if (course.leafNodesCount && course.progress && course.leafNodesCount === course.progress) {
                profile.badges.push({
                  title: course.courseName
                })
              }
            })
          }
        })
      }

      profile.getbadges()

      profile.setSelectedGrades = function () {
        $timeout(function () {
          $('#selectGrades').dropdown()
          $('#selectGrades').dropdown('refresh')
          $('#selectGrades').dropdown('set selected', profile.user.grade)
        }, 100)
      }

      // cancel
      profile.cancelEditExperience = function () {
        profile.experienceForm = false
        profile.isCurrentJobExist = false
        profile.experience = profile.getProfileObject(profile.user.jobProfile)
      }

      profile.getProfileObject = function (profileData) {
        return angular.copy(profileData)
      }
      profile.updateAction = function (field) {
        switch (field) {
        case 'education':
          profile.educationForm = true
          profile.isNewEducation = true
          profile.newEducation = {}
          $timeout(function () { $anchorScroll('educationForm') }, 100)
          break
        case 'jobProfile':
          profile.experienceForm = true
          profile.isNewExperience = true
          profile.newExperience = {}
          $timeout(function () { $anchorScroll('jobProfileForm') }, 100)
          break
        case 'address':
          profile.addressForm = true
          profile.isNewAddress = true
          profile.newAddress = {}
          $timeout(function () { $anchorScroll('addressForm') }, 100)
          break
        case 'avatar':
          profile.openImageBrowser()
          break
        case 'profileSummary':
          profile.openDiscriptionEdit = true
          break
        case 'lastName':
        case 'email':
        case 'phone':
        case 'dob':
        case 'gender':
        case 'grade':
        case 'language':
        case 'location':
        case 'subject':
          profile.basicProfileForm = true
          $timeout(function () { $anchorScroll('basicInfoForm') }, 100)
          break
        default:
        }
      }
      profile.getSkills = function () {
        userService.getSkills().then(function (response) {
          if (response.responseCode === 'OK') {
            profile.skills = response.result.skills
          }
        })
      }

      profile.getSkills()

      profile.openAddSkillModal = function () {
        $timeout(function () {
          $('#addSkillModal').modal({
            onShow: function () {
              $('#addSkill').dropdown('clear')
              var excludeHasResults = false
              $.fn.dropdown.settings.templates.addition = function (search) {
                var output = 'Add '
                if (!excludeHasResults) {
                  output = 'Add '
                }
                output += '" <strong>' + search + '</strong> "'
                return output
              }

              $('#addSkill').dropdown({
                allowAdditions: true,
                // action: 'select',
                // debug: true,
                hideAdditions: false,
                minCharacters: 2,
                showNoResults: true,
                onChange: function (value) {
                  // profile.selectedSkills.push(value);
                  // profile.skills = profile.skills.filter(function (skill) {
                  //     return skill !== value;
                  // });
                  // $('#addSkillModal').modal('refresh');
                  // $scope.$apply();
                },
                message: {
                  addResult: '{term}'
                },
                onAdd: function (addedValue, addedText, $addedChoice) {
                  $(this).dropdown('remove selected', addedValue)
                },
                onLabelCreate: function (value, text) {
                  return $(this)
                },
                onNoResults: function (searchValue) {
                  excludeHasResults = false
                  return true
                }

              })
            },

            onHide: function () {}
          }).modal('show')
        }, 50)
        $('#addSkillModal').modal('refresh')
      }

      profile.addSkills = function () {
        var isNoNewSkill = false
        var skills = $('#addSkill').dropdown('get value')

        var newUserSkills = skills.split(',')

        if (profile.userSkills.length) {
          profile.userSkills.forEach(function (userSkill) {
            newUserSkills = newUserSkills.filter(function (skill) {
              return skill !== userSkill.skillName
            })
          })
        }
        var req = {
          request: {
            endorsedUserId: profile.userId,
            skillName: newUserSkills
          }
        }
        if (newUserSkills.length === 1 && newUserSkills[0].length === 0) {
          isNoNewSkill = true
        }
        if (!isNoNewSkill) {
          userService.addSkills(req).then(function (response) {
            if (response && response.responseCode === 'OK') {
              toasterService.success($rootScope.messages.smsg.m0038)
              profile.getProfile()
            } else {
              toasterService.error($rootScope.messages.fmsg.m0062)
            }
          })
        }
      }

      profile.setLimit = function (lim) {
        profile.limit = (lim <= 0) ? profile.userSkills.length : lim
      }
    }
  ])
