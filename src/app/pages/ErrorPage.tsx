import React from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

// type refinement of 'unknown' is kind of a pain...
const hasMessage = (error: unknown): error is object & {message: string} => {
  return error !== null 
    && typeof error === 'object'
    && 'message' in error
    && typeof (error as Record<'message', unknown>).message === 'string';
};

const getErrorMessage = (error: unknown): string => {
  if (isRouteErrorResponse(error)) return `${error.status} ${error.statusText}`;
  if (hasMessage(error)) return error.message;

  return 'Unknown error';
};

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  const errorMessage = getErrorMessage(error);
  
  return (
    <div className="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{errorMessage}</i>
      </p>
    </div>
  );
};

export default ErrorPage;
