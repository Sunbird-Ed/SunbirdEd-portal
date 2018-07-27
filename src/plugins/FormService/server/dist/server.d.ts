import { Manifest, BaseServer } from '@project-sunbird/ext-framework-server/models';
import { Request, Response } from 'express';
export declare class Server extends BaseServer {
    constructor(manifest: Manifest);
    create(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<void>;
    read(req: Request, res: Response): Promise<void>;
}
