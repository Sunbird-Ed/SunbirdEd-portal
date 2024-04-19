import { OnInit } from '@angular/core';
import { UciService } from '../../services/uci.service';
import { Router } from '@angular/router';
import { GlobalService } from '../../services/global.service';
import * as i0 from "@angular/core";
export declare class ConversationListComponent implements OnInit {
    private uciService;
    private router;
    private globalService;
    chatBots: any[];
    pager: any;
    pageNumber: number;
    column: string;
    sortDirection: string;
    reverse: boolean;
    queryParams: any;
    search: any;
    user: any;
    constructor(uciService: UciService, router: Router, globalService: GlobalService);
    ngOnInit(): void;
    getAllChatBots(): void;
    parseConversations(data: any): void;
    sortColumns(column: any): void;
    navigateToPage(page: number): undefined | void;
    getSearch(): void;
    onAddNew(): void;
    onEdit(conversation: any): void;
    onStatusChange(conversation: any, index: any): void;
    onDelete(conversation: any, index: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ConversationListComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ConversationListComponent, "lib-conversation-list", never, {}, {}, never, never, false, never>;
}
//# sourceMappingURL=conversation-list.component.d.ts.map