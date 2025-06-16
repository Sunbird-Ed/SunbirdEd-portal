import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LabelMappingService {
  constructor() {}

  getLabelMappings(resourceService: any): Record<string, string> {
    const r = resourceService?.frmelmnts?.lbl || {};

    return {
      "asset": r.asset || "Asset",
      "digital textbook": r.digitalTextbook || "Digital Textbook",
      "explanation content": r.explanationContent || "Explanation Content",
      "etextbook": r.etextbook || "eTextbook",
      "textbook unit": r.textbookUnit || "Textbook Unit",
      "textbook": r.textbook || "Textbook",
      "certificate template": r.certificateTemplate || "Certificate Template",
      "course": r.course || "Course",
      "course unit": r.courseUnit || "Course Unit",
      "content playlist": r.contentPlaylist || "Content Playlist",
      "course assessment": r.courseAssessment || "Course Assessment",
      "practice assessment": r.practiceAssessment || "Practice Assessment",
      "teacher resource": r.teacherResource || "Teacher Resource",
      "learning resource": r.learningResource || "Learning Resource",
      "practice question set": r.practiceQuestionSet || "Practice Question Set",
      "multiple choice question": r.multipleChoiceQuestion || "Multiple Choice Question",
      "subjective question": r.subjectiveQuestion || "Subjective Question",
      "question paper": r.questionPaper || "Question Paper",
      "lesson plan unit": r.lessonPlanUnit || "Lesson Plan Unit",
      "exam question": r.examQuestion || "Exam Question"
    };
  }
}