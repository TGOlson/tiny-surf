import React from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

// type refinement of 'unknown' is kind of a pain...
const isError = (error: unknown): error is Error => {
  return error !== null 
    && typeof error === 'object'
    && 'message' in error
    && typeof (error as Record<'message', unknown>).message === 'string';
};

const getErrorMessage = (error: unknown): string => {
  if (isRouteErrorResponse(error)) return `${error.status} ${error.statusText}`;
  if (isError(error)) return error.message;

  return 'Unknown error';
};

const PageNotFound = () => {
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
}

export default PageNotFound;
