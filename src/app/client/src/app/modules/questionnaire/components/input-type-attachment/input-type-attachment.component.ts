import { Component, Input, OnInit } from "@angular/core";
import { QuestionnaireService } from "../../questionnaire.service";

@Component({
  selector: "app-input-type-attachment",
  templateUrl: "./input-type-attachment.component.html",
  styleUrls: ["./input-type-attachment.component.scss"],
})
export class InputTypeAttachmentComponent implements OnInit {
  @Input() data;

  td = [
  ];
  constructor(private qService: QuestionnaireService) {}

  ngOnInit() {}

  basicUpload(files: File[]) {
    var formData = new FormData();
    Array.from(files).forEach((f) => formData.append("file", f));
    this.preSignedUrl(this.getFileNames(formData));
  }

  getFileNames(formData) {
    let files = [];
    formData.forEach((element) => {
      files.push(element.name);
    });
    return files;
  }

  preSignedUrl(files) {
    let payload = {};
    payload["ref"] = "survey";
    payload["request"] = {};
    payload["request"][this.data.submissionId] = {
      files: files,
    };
    this.qService.getPreSingedUrls(payload).subscribe(
      (data) => {
        console.log(data);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  extension(name) {
    return name.split(".").pop();
  }
  openFile(file) {
    window.open(file.sourcePath, "_blank");
  }
}
