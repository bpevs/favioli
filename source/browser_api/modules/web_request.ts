// deno-lint-ignore-file no-empty-interface

import { EventWithRequiredFilterInAddListener, Function } from './event.ts';

export type ResourceType =
  | 'main_frame'
  | 'sub_frame'
  | 'stylesheet'
  | 'script'
  | 'image'
  | 'font'
  | 'object'
  | 'xmlhttprequest'
  | 'ping'
  | 'csp_report'
  | 'media'
  | 'websocket'
  | 'other';

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface HttpHeader {
  name: string;
  value?: string | undefined;
  binaryValue?: ArrayBuffer | undefined;
}

/** Returns value for event handlers that have the 'blocking' extraInfoSpec applied. Allows the event handler to modify network requests. */
export interface BlockingResponse {
  /** Optional. If true, the request is cancelled. Used in onBeforeRequest, this prevents the request from being sent. */
  cancel?: boolean | undefined;
  /**
   * Optional.
   * Only used as a response to the onBeforeRequest and onHeadersReceived events. If set, the original request is prevented from being sent/completed and is instead redirected to the given URL. Redirections to non-HTTP schemes such as data: are allowed. Redirects initiated by a redirect action use the original request method for the redirect, with one exception: If the redirect is initiated at the onHeadersReceived stage, then the redirect will be issued using the GET method.
   */
  redirectUrl?: string | undefined;
  /**
   * Optional.
   * Only used as a response to the onHeadersReceived event. If set, the server is assumed to have responded with these response headers instead. Only return responseHeaders if you really want to modify the headers in order to limit the number of conflicts (only one extension may modify responseHeaders for each request).
   */
  responseHeaders?: HttpHeader[] | undefined;
  /** Optional. Only used as a response to the onAuthRequired event. If set, the request is made using the supplied credentials. */
  authCredentials?: AuthCredentials | undefined;
  /**
   * Optional.
   * Only used as a response to the onBeforeSendHeaders event. If set, the request is made with these request headers instead.
   */
  requestHeaders?: HttpHeader[] | undefined;
}

/** An object describing filters to apply to webRequest events. */
export interface RequestFilter {
  /** Optional. */
  tabId?: number | undefined;
  /**
   * A list of request types. Requests that cannot match any of the types will be filtered out.
   */
  types?: ResourceType[] | undefined;
  /** A list of URLs or URL patterns. Requests that cannot match any of the URLs will be filtered out. */
  urls: string[];

  /** Optional. */
  windowId?: number | undefined;
}

/**
 * Contains data uploaded in a URL request.
 * @since Chrome 23.
 */
export interface UploadData {
  /** Optional. An ArrayBuffer with a copy of the data. */
  bytes?: ArrayBuffer | undefined;
  /** Optional. A string with the file's path and name. */
  file?: string | undefined;
}

export interface WebRequestBody {
  /** Optional. Errors when obtaining request body data. */
  error?: string | undefined;
  /**
   * Optional.
   * If the request method is POST and the body is a sequence of key-value pairs encoded in UTF8, encoded as either multipart/form-data, or application/x-www-form-urlencoded, this dictionary is present and for each key contains the list of all values for that key. If the data is of another media type, or if it is malformed, the dictionary is not present. An example value of this dictionary is {'key': ['value1', 'value2']}.
   */
  formData?: { [key: string]: string[] } | undefined;
  /**
   * Optional.
   * If the request method is PUT or POST, and the body is not already parsed in formData, then the unparsed request body elements are contained in this array.
   */
  raw?: UploadData[] | undefined;
}

export interface WebAuthChallenger {
  host: string;
  port: number;
}

export interface ResourceRequest {
  url: string;
  /** The ID of the request. Request IDs are unique within a browser session. As a result, they could be used to relate different events of the same request. */
  requestId: string;
  /** The value 0 indicates that the request happens in the main frame; a positive value indicates the ID of a subframe in which the request happens. If the document of a (sub-)frame is loaded (type is main_frame or sub_frame), frameId indicates the ID of this frame, not the ID of the outer frame. Frame IDs are unique within a tab. */
  frameId: number;
  /** ID of frame that wraps the frame which sent the request. Set to -1 if no parent frame exists. */
  parentFrameId: number;
  /** The ID of the tab in which the request takes place. Set to -1 if the request isn't related to a tab. */
  tabId: number;
  /**
   * How the requested resource will be used.
   */
  type: ResourceType;
  /** The time when this signal is triggered, in milliseconds since the epoch. */
  timeStamp: number;
  /** The origin where the request was initiated. This does not change through redirects. If this is an opaque origin, the string 'null' will be used.
   * @since Since Chrome 63.
   */
  initiator?: string | undefined;
}

export interface WebRequestDetails extends ResourceRequest {
  /** Standard HTTP method. */
  method: string;
}

export interface WebRequestHeadersDetails extends WebRequestDetails {
  /** Optional. The HTTP request headers that are going to be sent out with this request. */
  requestHeaders?: HttpHeader[] | undefined;
}

export interface WebRequestBodyDetails extends WebRequestDetails {
  /**
   * Contains the HTTP request body data. Only provided if extraInfoSpec contains 'requestBody'.
   * @since Chrome 23.
   */
  requestBody: WebRequestBody | null;
}

export interface WebRequestFullDetails
  extends WebRequestHeadersDetails, WebRequestBodyDetails {}

export interface WebResponseDetails extends ResourceRequest {
  /** HTTP status line of the response or the 'HTTP/0.9 200 OK' string for HTTP/0.9 responses (i.e., responses that lack a status line). */
  statusLine: string;
  /**
   * Standard HTTP status code returned by the server.
   * @since Chrome 43.
   */
  statusCode: number;
}

export interface WebResponseHeadersDetails extends WebResponseDetails {
  /** Optional. The HTTP response headers that have been received with this response. */
  responseHeaders?: HttpHeader[] | undefined;
  method: string /** standard HTTP method i.e. GET, POST, PUT, etc. */;
}

export interface WebResponseCacheDetails extends WebResponseHeadersDetails {
  /**
   * Optional.
   * The server IP address that the request was actually sent to. Note that it may be a literal IPv6 address.
   */
  ip?: string | undefined;
  /** Indicates if this response was fetched from disk cache. */
  fromCache: boolean;
}

export interface WebRedirectionResponseDetails extends WebResponseCacheDetails {
  /** The new URL. */
  redirectUrl: string;
}

export interface WebAuthenticationChallengeDetails
  extends WebResponseHeadersDetails {
  /** The authentication scheme, e.g. Basic or Digest. */
  scheme: string;
  /** The authentication realm provided by the server, if there is one. */
  realm?: string | undefined;
  /** The server requesting authentication. */
  challenger: WebAuthChallenger;
  /** True for Proxy-Authenticate, false for WWW-Authenticate. */
  isProxy: boolean;
}

export interface WebResponseErrorDetails extends WebResponseCacheDetails {
  /** The error description. This string is not guaranteed to remain backwards compatible between releases. You must not parse and act based upon its content. */
  error: string;
}

export interface WebRequestBodyEvent
  extends
    EventWithRequiredFilterInAddListener<
      (details: WebRequestBodyDetails) => BlockingResponse | void
    > {
  addListener(
    callback: (details: WebRequestBodyDetails) => BlockingResponse | void,
    filter: RequestFilter,
    opt_extraInfoSpec?: string[],
  ): void;
}

export interface WebRequestHeadersSynchronousEvent
  extends
    EventWithRequiredFilterInAddListener<
      (details: WebRequestHeadersDetails) => BlockingResponse | void
    > {
  addListener(
    callback: (details: WebRequestHeadersDetails) => BlockingResponse | void,
    filter: RequestFilter,
    opt_extraInfoSpec?: string[],
  ): void;
}

export interface WebRequestHeadersEvent
  extends
    EventWithRequiredFilterInAddListener<
      (details: WebRequestHeadersDetails) => void
    > {
  addListener(
    callback: (details: WebRequestHeadersDetails) => void,
    filter: RequestFilter,
    opt_extraInfoSpec?: string[],
  ): void;
}

export interface _WebResponseHeadersEvent<T extends WebResponseHeadersDetails>
  extends EventWithRequiredFilterInAddListener<(details: T) => void> {
  addListener(
    callback: (details: T) => void,
    filter: RequestFilter,
    opt_extraInfoSpec?: string[],
  ): void;
}

export interface WebResponseHeadersEvent
  extends
    EventWithRequiredFilterInAddListener<
      (details: WebResponseHeadersDetails) => BlockingResponse | void
    > {
  addListener(
    callback: (details: WebResponseHeadersDetails) => BlockingResponse | void,
    filter: RequestFilter,
    opt_extraInfoSpec?: string[],
  ): void;
}

export interface WebResponseCacheEvent
  extends _WebResponseHeadersEvent<WebResponseCacheDetails> {}

export interface WebRedirectionResponseEvent
  extends _WebResponseHeadersEvent<WebRedirectionResponseDetails> {}

export interface WebAuthenticationChallengeEvent
  extends
    EventWithRequiredFilterInAddListener<
      (
        details: WebAuthenticationChallengeDetails,
        callback?: (response: BlockingResponse) => void,
      ) => void
    > {
  addListener(
    callback: (
      details: WebAuthenticationChallengeDetails,
      callback?: (response: BlockingResponse) => void,
    ) => void,
    filter: RequestFilter,
    opt_extraInfoSpec?: string[],
  ): void;
}

export interface WebResponseErrorEvent
  extends _WebResponseHeadersEvent<WebResponseErrorDetails> {}

export interface WebRequest {
  MAX_HANDLER_BEHAVIOR_CHANGED_CALLS_PER_10_MINUTES: number;
  handlerBehaviorChanged: (callback?: Function) => void;
  onBeforeRequest: WebRequestBodyEvent;
  onBeforeSendHeaders: WebRequestHeadersSynchronousEvent;
  onSendHeaders: WebRequestHeadersEvent;
  onHeadersReceived: WebResponseHeadersEvent;
  onAuthRequired: WebAuthenticationChallengeEvent;
  onResponseStarted: WebResponseCacheEvent;
  onBeforeRedirect: WebRedirectionResponseEvent;
  onCompleted: WebResponseCacheEvent;
  onErrorOccurred: WebResponseErrorEvent;
}
