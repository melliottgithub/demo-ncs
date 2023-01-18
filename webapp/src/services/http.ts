import qs from "qs";

type Options = {
  baseURL: string,
  defaultHeaders?: Record<string, string>,
  // accessToken : string,
};

const defaultHeaders = {
  'Content-Type': 'application/json',
};

export type HttpResponse<T> = {
  ok: boolean,
  error: string,
  data: T
}

export class HttpClient {
  defaultHeaders?: Record<string, string>;
  baseURL: string;

  constructor(options: Options) {
    this.baseURL = options.baseURL;
    this.defaultHeaders = options.defaultHeaders || defaultHeaders;
  }

  private getHeaders(headers?: Record<string, string>) {
    return {
      ...this.defaultHeaders,
      ...headers,
      // Authorization: `Bearer ${this.options.accessToken}`,
    };
  }

  /*
  {
      ok: resp.ok,
      error: `${resp.statusText} ${resp.status}`,
      data: await resp.json() as T
    }
  */
  public async get<T, P = unknown>(url: string, query?: P, headers?: Record<string, string>): Promise<T> {
    const queryString = qs.stringify(query);
    return fetch(`${this.baseURL}${url}?${queryString}`, {
      method: 'GET',
      headers: this.getHeaders(headers),
    }).then((resp) => resp.json()) as T;
  }

  public async post<T, B>(url: string, body?: B, headers?: Record<string, string>): Promise<T> {
    return await fetch(`${this.baseURL}${url}`, {
      method: 'POST',
      headers: this.getHeaders(headers),
      body: JSON.stringify(body)
    }).then((resp) => resp.json()) as T;
  }

  public async put<T, B>(url: string, body?: B, headers?: Record<string, string>): Promise<T> {
    return await fetch(`${this.baseURL}${url}`, {
      method: 'PUT',
      headers: this.getHeaders(headers),
      body: JSON.stringify(body)
    }).then((resp) => resp.json()) as T;
  }

  public async delete<T, P = unknown>(url: string, query?: P, headers?: Record<string, string>): Promise<T> {
    const queryString = qs.stringify(query);
    return fetch(`${this.baseURL}${url}?${queryString}`, {
      method: 'DELETE',
      headers: this.getHeaders(headers),
    }).then((resp) => resp.json()) as T;
  }
}
