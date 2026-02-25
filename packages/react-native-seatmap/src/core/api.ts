import { DEFAULT_AUTHORIZATION_SCHEME } from './constants';
import type { JetsStorageService } from './storage';

const JWT_TOKEN = 'jetsJwtToken';
const TOKEN_EXPIRATION_BUFFER_IN_MS = 300000;

export class JetsApiService {
  private _appId: string;
  private _apiKey: string;
  private _apiUrl: string;
  private _localStorage: JetsStorageService | null;
  private _apiAuthorizationScheme: string;
  private _apiMetadata: Record<string, unknown> | null;

  constructor(
    appId: string,
    key: string,
    url: string,
    localStorage: JetsStorageService | null,
    apiAuthorizationScheme: string = DEFAULT_AUTHORIZATION_SCHEME,
    apiMetadata: Record<string, unknown> | null = null
  ) {
    this._appId = appId;
    this._apiKey = key;
    this._apiUrl = url;
    this._localStorage = localStorage;
    this._apiAuthorizationScheme = apiAuthorizationScheme;
    this._apiMetadata = apiMetadata;
  }

  getData = async (url: string, options: RequestInit = {}): Promise<unknown> => {
    let basicOptions: RequestInit = {};
    if (!(options as {headers?: Record<string, string>}).headers?.authorization) {
      basicOptions = await this._getRequestOptions();
    }

    const reqOptions = { ...options, ...basicOptions };
    const response = await fetch(`${this._apiUrl}/${url}`, reqOptions);
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(`getData: ${response.status} - ${responseData.message}`);
    }

    return responseData;
  };

  postData = async (url: string, body: unknown, options: RequestInit = {}): Promise<unknown> => {
    const basicOptions = await this._getRequestOptions();
    const params = {
      ...options,
      method: 'post',
      body: JSON.stringify(body),
      ...basicOptions,
    };
    const path = `${this._apiUrl}/${url}`;
    const response = await fetch(path, params);
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(`postData: ${response.status} - ${responseData.message}`);
    }

    return responseData;
  };

  private _getRequestOptions = async (): Promise<RequestInit> => {
    const token = await this._getToken();
    return {
      headers: {
        'content-type': 'application/json',
        authorization: `${this._apiAuthorizationScheme} ${token}`,
      },
    };
  };

  private _getAuthRequestOptions = (key: string): RequestInit => {
    return {
      headers: {
        authorization: `${this._apiAuthorizationScheme} ${key}`,
      },
    };
  };

  private _getToken = async (): Promise<string> => {
    const token = this._localStorage ? this._localStorage.getData(JWT_TOKEN) : null;

    if (token) return token;

    const path = `auth?appId=${this._appId}`;
    const { accessToken } = (await this.getData(
      path,
      this._getAuthRequestOptions(this._apiKey)
    )) as { accessToken?: string };

    if (!accessToken) {
      throw new Error('Unable to authenticate');
    }

    this._saveToken(accessToken);

    return accessToken;
  };

  private _saveToken = (token: string): void => {
    if (!token || !this._localStorage) return;

    const { exp } = this._parseJwt(token);
    const tokenTTL = this._getTokenTTL(exp);
    this._localStorage.setData(JWT_TOKEN, token, tokenTTL);
  };

  private _getTokenTTL(exp: number): number {
    return exp * 1000 - Date.now() - TOKEN_EXPIRATION_BUFFER_IN_MS;
  }

  private _parseJwt(token: string): { exp: number } {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  }
}
