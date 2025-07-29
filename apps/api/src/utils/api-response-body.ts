import HttpStatusCode from "./http-status-code";

export class ApiResponseBody<T = undefined> {
  error?: {
    code: number;
    message: string;
  };
  data?: T;
}

export class ResponseHandler {
  static response<T>(
    message: string,
    status: HttpStatusCode
  ): ApiResponseBody<T> {
    const response = new ApiResponseBody<T>();
    response.error = {
      code: status,
      message,
    };
    return response;
  }

  static NoDataResponse<T = undefined>(
    message = "Operation successful"
  ): ApiResponseBody<T> {
    return this.response<T>(message, HttpStatusCode.OK);
  }

  static NotFound<T = undefined>(message = "Not found"): ApiResponseBody<T> {
    return this.response<T>(message, HttpStatusCode.NOT_FOUND);
  }

  static InvalidBody<T = undefined>(
    message = "Invalid request body"
  ): ApiResponseBody<T> {
    return this.response<T>(message, HttpStatusCode.UNPROCESSABLE_ENTITY);
  }

  static Unauthorized<T = undefined>(
    message = "Unauthorized"
  ): ApiResponseBody<T> {
    return this.response<T>(message, HttpStatusCode.UNAUTHORIZED);
  }

  static Forbidden<T = undefined>(message = "Forbidden"): ApiResponseBody<T> {
    return this.response<T>(message, HttpStatusCode.FORBIDDEN);
  }

  static BadRequest<T = undefined>(
    message = "Bad Request"
  ): ApiResponseBody<T> {
    return this.response<T>(message, HttpStatusCode.BAD_REQUEST);
  }
}
