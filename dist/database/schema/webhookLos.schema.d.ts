export declare class WebhookLog {
    log: string;
    event: string;
    headers: string;
}
export declare const WebhookLogSchema: import("mongoose").Schema<WebhookLog, import("mongoose").Model<WebhookLog, any, any, any, any, any, WebhookLog & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, WebhookLog, import("mongoose").Document<unknown, {}, WebhookLog, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<WebhookLog & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    log?: import("mongoose").SchemaDefinitionProperty<string, WebhookLog, import("mongoose").Document<unknown, {}, WebhookLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WebhookLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    event?: import("mongoose").SchemaDefinitionProperty<string, WebhookLog, import("mongoose").Document<unknown, {}, WebhookLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WebhookLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    headers?: import("mongoose").SchemaDefinitionProperty<string, WebhookLog, import("mongoose").Document<unknown, {}, WebhookLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WebhookLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, WebhookLog>;
