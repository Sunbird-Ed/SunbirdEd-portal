import { OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as i0 from "@angular/core";
export declare class ConversationSuccessComponent implements OnInit {
    private router;
    private activatedRoute;
    text: string;
    botId: string;
    constructor(router: Router, activatedRoute: ActivatedRoute);
    ngOnInit(): void;
    onCopy(id: any): void;
    onClose(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ConversationSuccessComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ConversationSuccessComponent, "lib-conversation-success", never, {}, {}, never, never, false, never>;
}
//# sourceMappingURL=conversation-success.component.d.ts.map