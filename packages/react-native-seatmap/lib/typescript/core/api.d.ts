import type { JetsStorageService } from './storage';
export declare class JetsApiService {
    private _appId;
    private _apiKey;
    private _apiUrl;
    private _localStorage;
    private _apiAuthorizationScheme;
    private _apiMetadata;
    constructor(appId: string, key: string, url: string, localStorage: JetsStorageService | null, apiAuthorizationScheme?: string, apiMetadata?: Record<string, unknown> | null);
    getData: (url: string, options?: RequestInit) => Promise<unknown>;
    postData: (url: string, body: unknown, options?: RequestInit) => Promise<unknown>;
    private _getRequestOptions;
    private _getAuthRequestOptions;
    private _getToken;
    private _saveToken;
    private _getTokenTTL;
    private _parseJwt;
}
//# sourceMappingURL=api.d.ts.map