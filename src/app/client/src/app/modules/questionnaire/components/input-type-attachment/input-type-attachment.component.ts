import { Component, Input, OnInit } from "@angular/core";
import { QuestionnaireService } from "../../questionnaire.service";
import { ObservationUtilService } from "../../../observation/service";
import { ResourceService }from "@sunbird/shared";
@Component({
  selector: "app-input-type-attachment",
  templateUrl: "./input-type-attachment.component.html",
  styleUrls: ["./input-type-attachment.component.scss"],
})
export class InputTypeAttachmentComponent implements OnInit {
  @Input() data;

  td = [
    {
      name: "xyz.png",
      sourcePath:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/1200px-Visual_Studio_Code_1.35_icon.svg.png",
    },
    {
      name: "abc.jpg",
      sourcePath:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/1200px-Visual_Studio_Code_1.35_icon.svg.png",
    },
    {
      name: "example.pdf",
      sourcePath: "http://www.pdf995.com/samples/pdf.pdf",
    },
  ];
  constructor(
    private qService: QuestionnaireService,
    private observationUtil:ObservationUtilService,
    public resourceService: ResourceService
    ) {}

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

  async onAddApproval(file){
    let metaData=this.observationUtil.getAlertMetaData();
    metaData.type="upload evidence";
    metaData.size="tiny";
    metaData.content.title=this.resourceService.frmelmnts.alert.uploadevidencetitle;
    metaData.content.body.type="checkbox";
    let html =
    `
    ${this.resourceService.frmelmnts.alert.evidence_content_policy}<a href='https://diksha.gov.in/term-of-use.html' target="_blank">${this.resourceService.frmelmnts.alert.evidence_content_policy_label}</a> .${this.resourceService.frmelmnts.alert.uploadevidencecontent}
    `;
    metaData.content.body.data=html;
    metaData.footer.className="double-btn"
    metaData.footer.buttons.push(
      {
        type:"cancel",
        returnValue:false,
        buttonText:this.resourceService.frmelmnts.btn.donotupload,
      },
      {
       type:"accept",
       returnValue:true,
       buttonText:this.resourceService.frmelmnts.btn.upload,
     }
     );
   let returnData=await this.observationUtil.showPopupAlert(metaData);
   if(!returnData){
     return;
   }
   file.click();
  }


}
