import { Component, Input, OnInit } from "@angular/core";
import { QuestionnaireService } from "../../questionnaire.service";
import { ObservationUtilService } from "../../../observation/service";
import { ResourceService, ToasterService } from "@sunbird/shared";
import * as _ from "lodash-es";

@Component({
  selector: "app-input-type-attachment",
  templateUrl: "./input-type-attachment.component.html",
  styleUrls: ["./input-type-attachment.component.scss"],
})
export class InputTypeAttachmentComponent implements OnInit {
  @Input() data;
  formData;

  constructor(
    private qService: QuestionnaireService,
    private observationUtil: ObservationUtilService,
    public resourceService: ResourceService,
    private toastService: ToasterService
  ) {}

  ngOnInit() {}

  basicUpload(files: File[]) {
    let sizeMB = +(files[0].size / 1000 / 1000).toFixed(4);
    if (sizeMB > 20) {
      this.fileLimitCross();
      return;
    }
    this.formData = new FormData();
    Array.from(files).forEach((f) => this.formData.append("file", f));
    this.preSignedUrl(this.getFileNames(this.formData));
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
      (imageData) => {
        const presignedUrlData =
          imageData["result"][this.data.submissionId].files[0];
        this.formData.append("url", presignedUrlData.url);
        this.qService.cloudStorageUpload(this.formData).subscribe(
          (success: any) => {
            if (success.status === 200) {
              const obj = {
                name: this.getFileNames(this.formData)[0],
                url: presignedUrlData.url.split("?")[0],
              };
              for (const key of Object.keys(presignedUrlData.payload)) {
                obj[key] = presignedUrlData["payload"][key];
              }
              this.data.files.push(obj);
              this.uploadedToast();
            } else {
              this.toastService.error(
                _.get(this.resourceService, "frmelmnts.message.unableToUpload")
              );
            }
          },
          (error) => {
            this.toastService.error(
              _.get(this.resourceService, "frmelmnts.message.unableToUpload")
            );
          }
        );
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
    window.open(file.url, "_blank");
  }

  async onAddApproval(file) {
    let metaData = this.observationUtil.getAlertMetaData();
    metaData.type = "upload evidence";
    metaData.size = "tiny";
    metaData.content.title =
      this.resourceService.frmelmnts.alert.uploadevidencetitle;
    metaData.content.body.type = "checkbox";
    let html = `
    ${this.resourceService.frmelmnts.alert.evidence_content_policy}<a href='https://diksha.gov.in/term-of-use.html' target="_blank">${this.resourceService.frmelmnts.alert.evidence_content_policy_label}</a> .${this.resourceService.frmelmnts.alert.uploadevidencecontent}
    `;
    metaData.content.body.data = html;
    metaData.footer.className = "double-btn";
    metaData.footer.buttons.push(
      {
        type: "cancel",
        returnValue: false,
        buttonText: this.resourceService.frmelmnts.btn.donotupload,
      },
      {
        type: "accept",
        returnValue: true,
        buttonText: this.resourceService.frmelmnts.btn.upload,
      }
    );
    let returnData = await this.observationUtil.showPopupAlert(metaData);
    if (!returnData) {
      this.notAccepted();
      return;
    }
    file.click();
  }

  notAccepted(): void {
    let metaData = this.observationUtil.getAlertMetaData();
    metaData.type = "notAccepted";
    metaData.size = "tiny";
    metaData.content.body.type = "text";
    metaData.content.body.data =
      this.resourceService.frmelmnts.alert.upload_terms_rejected;
    metaData.footer.className = "single-btn";
    metaData.footer.buttons.push({
      type: "accept",
      returnValue: true,
      buttonText: this.resourceService.frmelmnts.btn.ok,
    });
    this.observationUtil.showPopupAlert(metaData);
  }

  uploadedToast(): void {
    let metaData = this.observationUtil.getAlertMetaData();
    metaData.type = "uploaded";
    metaData.size = "tiny";
    metaData.content.body.type = "text";
    metaData.content.body.data =
      this.resourceService.frmelmnts.alert.evidence_uploaded;
    metaData.footer.className = "single-btn";
    metaData.footer.buttons.push({
      type: "accept",
      returnValue: true,
      buttonText: this.resourceService.frmelmnts.btn.ok,
    });
    this.observationUtil.showPopupAlert(metaData);
  }

  async deleteAttachment(fileIndex) {
    let metaData = await this.observationUtil.getAlertMetaData();
    metaData.content.body.data =
      this.resourceService.frmelmnts.alert.confirm_evidence_delete;
    metaData.content.body.type = "text";
    metaData.content.title = this.resourceService.frmelmnts.btn.delete;
    metaData.size = "mini";
    metaData.footer.buttons.push({
      type: "cancel",
      returnValue: false,
      buttonText: this.resourceService.frmelmnts.btn.no,
    });
    metaData.footer.buttons.push({
      type: "accept",
      returnValue: true,
      buttonText: this.resourceService.frmelmnts.btn.yes,
    });
    metaData.footer.className = "double-btn";
    const accepted = await this.observationUtil.showPopupAlert(metaData);
    if (!accepted) {
      return;
    }
    this.data.files.splice(fileIndex, 1);
  }

  fileLimitCross() {
    let metaData = this.observationUtil.getAlertMetaData();
    metaData.type = "fileSizeLimit";
    metaData.size = "tiny";
    metaData.content.body.type = "text";
    metaData.content.body.data =
      this.resourceService.frmelmnts.alert.file_limit_cross_20;
    metaData.footer.className = "single-btn";
    metaData.footer.buttons.push({
      type: "accept",
      returnValue: true,
      buttonText: this.resourceService.frmelmnts.btn.ok,
    });
    this.observationUtil.showPopupAlert(metaData);
  }
}
