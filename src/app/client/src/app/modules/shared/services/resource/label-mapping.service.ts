import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LabelMappingService {
  constructor() {}

  getLabelMappings(resourceService: any): Record<string, string> {
    const r = resourceService?.frmelmnts?.lbl || {};

    return {
      "Asset": r.asset || "Asset",
      "Digital Textbook": r.digitalTextbook || "Digital Textbook",
      "Explanation Content": r.explanationContent || "Explanation Content",
      "eTextBook": r.etextbook || "eTextbook",
      "Textbook Unit": r.textbookUnit || "Textbook Unit",
      "Textbook": r.textbook || "Textbook",
      "Certificate Template": r.certificateTemplate || "Certificate Template",
      "Course": r.course || "Course",
      "Course Unit": r.courseUnit || "Course Unit",
      "Content Playlist": r.contentPlaylist || "Content Playlist",
      "Course Assessment": r.courseAssessment || "Course Assessment",
      "Practice Assessment": r.practiceAssessment || "Practice Assessment",
      "Teacher Resource": r.teacherResource || "Teacher Resource",
      "Learning Resource": r.learningResource || "Learning Resource",
      "Practice Question Set": r.practiceQuestionSet || "Practice Question Set",
      "Multiple Choice Question": r.multipleChoiceQuestion || "Multiple Choice Question",
      "Subjective Question": r.subjectiveQuestion || "Subjective Question",
      "Question Paper": r.questionPaper || "Question Paper",
      "Lesson Plan Unit": r.lessonPlanUnit || "Lesson Plan Unit",
      "Exam Question": r.examQuestion || "Exam Question"
    };
  }
}